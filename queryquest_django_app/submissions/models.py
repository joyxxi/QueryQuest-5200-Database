# submissions/models.py
from django.db import models
from problems.models import Problem
from users.models import Student

class Submission(models.Model):
    submission_id = models.AutoField(primary_key=True)  # 自定义主键

    # 外键关系
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)  # 关联问题
    student = models.ForeignKey(Student, on_delete=models.CASCADE)  # 关联学生

    # 学生提交的答案（索引 1、2 或 3）
    submitted_answer = models.PositiveSmallIntegerField(choices=[(1, 'Choice 1'), (2, 'Choice 2'), (3, 'Choice 3')])

    # 结果：正确 ('T') 或 错误 ('F')
    result = models.CharField(max_length=1, choices=[('T', 'True'), ('F', 'False')], blank=True)

    # 提交时间
    submitted_at = models.DateTimeField(auto_now_add=True)  # 提交时间

    class Meta:
        db_table = 'Submissions'  # 显式定义表名为 'Submissions'

    def __str__(self):
        return f"Submission {self.submission_id} by student {self.student.student_id} for problem {self.problem.problem_id}"

    def save(self, *args, **kwargs):
        # 在保存之前，获取问题的正确答案（索引 1、2 或 3）
        if self.problem:
            self.correct_answer = self.problem.correct_answer  # 获取问题的正确答案索引（1、2 或 3）

        # 根据提交的答案与正确答案的比较结果设置 result
        if self.submitted_answer == self.correct_answer:
            self.result = 'T'  # 正确
        else:
            self.result = 'F'  # 错误

        super().save(*args, **kwargs)  # 调用父类的 save 方法，保存记录
