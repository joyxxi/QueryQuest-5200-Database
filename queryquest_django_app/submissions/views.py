from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Submission
from .serializers import SubmissionSerializer
from progress.models import Progress
from django.utils.timezone import now

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """
        处理学生提交的答案并计算结果。
        """
        # 获取请求数据
        data = request.data

        # 校验必填字段
        if not data.get('problem') or not data.get('student') or not data.get('submitted_answer'):
            return Response(
                {"error": "problem, student and submitted_answer are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 创建提交记录
        submission = Submission.objects.create(
            problem_id=data.get('problem'),
            student_id=data.get('student'),
            submitted_answer=data.get('submitted_answer'),
        )

        # If the submission is correct, update progress
        if submission.result == 'T':
            try:
                progress = Progress.objects.get(student=submission.student, problem=submission.problem)
                # if submission is correct for a problem for the first time, add point and update progress
                if progress.status == 'Incomplete':
                    progress.status = 'Complete'
                    progress.complete_at = now()
                    progress.save()
                    
                    # Increment student's total_points only if this is the first time completing this problem
                    submission.student.total_points += 1
                    submission.student.save()
                
            except Progress.DoesNotExist:
                # If no progress entry exists, create one
                Progress.objects.create(
                    student=submission.student,
                    problem=submission.problem,
                    status='Complete',
                    complete_at=now()
                )
                # Since it's the first correct submission for this problem, increment student's points
                student = submission.student.student_profile
                student.total_points += 1
                student.save()

        # 自动计算并保存 result（由 save() 方法完成）
        submission.save()

        # 返回创建的记录
        return Response(self.get_serializer(submission).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='filter_submissions')
    def filter_submissions(self, request):
        """
        根据学生 ID、问题 ID 和 result 过滤提交记录。
        可以根据查询参数自由组合，例如：
        - student_id=1&problem_id=2
        - student_id=1&result=T
        - problem_id=2&result=F
        - 或者没有参数，返回所有提交记录
        """
        student_id = request.query_params.get('student_id', None)
        problem_id = request.query_params.get('problem_id', None)
        result = request.query_params.get('result', None)

        # 动态构建查询条件
        filters = {}

        if student_id:
            filters['student_id'] = student_id

        if problem_id:
            filters['problem_id'] = problem_id

        if result:
            filters['result'] = result

        # 根据构建的过滤条件获取提交记录
        submissions = Submission.objects.filter(**filters)

        # 如果没有符合条件的记录，返回 404 错误
        if not submissions.exists():
            return Response({'error': 'No matching submissions found.'}, status=status.HTTP_404_NOT_FOUND)

        # 返回符合条件的提交记录
        submissions_data = self.get_serializer(submissions, many=True).data
        return Response(submissions_data)
