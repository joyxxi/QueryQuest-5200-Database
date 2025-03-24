from django.http import JsonResponse
from .models import Submission





# 获取某个学生的所有错误提交记录
def incorrect_submissions(request, student_id):
    # 获取指定学生且答案错误的提交记录
    submissions = Submission.objects.filter(student_id=student_id, result='F')

    # 如果没有找到相关记录，返回适当的错误消息
    if not submissions.exists():
        return JsonResponse({'error': 'No incorrect submissions found for this student.'}, status=404)

    # 提取错误提交的相关信息
    submissions_data = list(submissions.values('submission_id', 'problem_id', 'result', 'submitted_answer', 'correct_answer', 'submitted_at'))
    return JsonResponse(submissions_data, safe=False)



# 获取某个问题的所有提交记录
def problem_submissions(request, problem_id):
    # 获取指定问题的所有提交记录
    submissions = Submission.objects.filter(problem_id=problem_id)

    # 如果没有找到相关记录，返回适当的错误消息
    if not submissions.exists():
        return JsonResponse({'error': 'No submissions found for this problem.'}, status=404)

    # 提取相关提交数据
    submissions_data = list(submissions.values('submission_id', 'student_id', 'result', 'submitted_answer', 'correct_answer', 'submitted_at'))
    return JsonResponse(submissions_data, safe=False)
