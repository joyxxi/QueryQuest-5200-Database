from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from submissions.models import Submission
from problems.models import Problem
from feedback.models import Feedback
from feedback.serializers import FeedbackSerializer
from django.utils import timezone
from django.conf import settings
from openai import OpenAI

@api_view(['POST'])
def get_or_refresh_feedback(request, student_id, problem_id):
    '''
    Retrieves feedback if it exists, otherwise generates and stores feedback using ChatGPT.
    If `?refresh=true`, regenerate the feedback.
    '''
    refresh = request.GET.get('refresh', 'false').lower() == 'true'

    submission = Submission.objects.filter(student_id=student_id, problem_id=problem_id).order_by('-submitted_at').first()

    if not submission:
        return Response({"message": "No submission found for this student and problem."}, status=status.HTTP_404_NOT_FOUND)
    
    feedback = Feedback.objects.filter(submission=submission).first()
    if feedback:
        if refresh:
            # Refresh the existing feedback
            feedback.f_content = generate_llm_feedback(submission)
            feedback.created_at = timezone.now()
            feedback.save()
    else:
        # Create new feedback if none exists
        feedback = Feedback.objects.create(
            submission=submission,
            f_content=generate_llm_feedback(submission)
        )

    serializer = FeedbackSerializer(feedback)
    return Response(serializer.data, status=status.HTTP_200_OK)


def generate_llm_feedback(submission):
    '''
    Calls OpenAI APT to generate feedback for the given submission.
    - If correct, explain why it is correct/
    - If incorrect, explain why it is wrong and guide the student.
    '''
    # set openai api key
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    # retrieve problem details
    problem = get_object_or_404(Problem, problem_id=submission.problem_id)
    description = problem.description
    correct_answer_index = problem.correct_answer
    choices = [problem.choice1, problem.choice2, problem.choice3]
    correct_answer = choices[correct_answer_index - 1]
    student_answer = choices[submission.submitted_answer - 1]

    # print(f"Correct Answer: {correct_answer}, student_answer: {student_answer}")
    # set prompt
    if student_answer == correct_answer:
        prompt = f"""
                The student correctly answered '{student_answer}' for the SQL question:
                "{description}"
                Explain why this answer is correct in a simple way.
                """
    else:
        prompt = f"""
        The student answered '{student_answer}' for the SQL question:
        "{description}"
        The correct answer is '{correct_answer}'.
        - Explain why the student's answer is incorrect.
        - Explain why the correct answer is correct.
        - Suggest why the student might have made this mistake.
        """

    system_promp = '''You are a helpful SQL assistant. Limit your response less than 200 words. 
                        The message will be sent to the student, so use 'You'
                        instead of 'The student' Use a friendly tone.
                        '''

    # generate feedback
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_promp},
            {"role": "user", "content": prompt},
        ],
        max_tokens=200,
        temperature=0.5,
    )

    # logging
    print("\nReturned Message:\n")
    print(response.choices[0].message.content.strip())

    return response.choices[0].message.content.strip()
