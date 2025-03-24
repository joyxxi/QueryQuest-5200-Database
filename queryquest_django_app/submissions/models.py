from django.db import models

# 假设 Student 和 Problem 模型已经存在
class Submission(models.Model):
    #problem = models.ForeignKey('problems.Problem', on_delete=models.CASCADE)  # 假设问题模型在 problems 应用中
    #student = models.ForeignKey('auth.Student', on_delete=models.CASCADE)  # 假设学生模型在 auth 应用中
    
    submission_id = models.AutoField(primary_key=True)  # 自定义主键
    
    #临时去掉外键
    problem_id = models.IntegerField()  # 存储问题 ID，类型是整数
    student_id = models.CharField(max_length=36)  # 存储学生 ID，类型是字符串
    
    
    result = models.CharField(max_length=1, choices=[('T', 'True'), ('F', 'False')])  # 'T' = 正确, 'F' = 错误
    submitted_answer = models.CharField(max_length=50)  # 学生提交的答案
    correct_answer = models.CharField(max_length=50)  # 正确答案
    submitted_at = models.DateTimeField(auto_now_add=True)  # 提交时间
    
    class Meta:
        db_table = 'Submissions'  # 显式定义表名为 'Submissions'
    
    #回复外键时
    #def __str__(self):
        #return f"Submission {self.id} by {self.student.student_id} on {self.problem.description}"
        
    def __str__(self):
        return f"Submission {self.id} by student {self.student_id} for problem {self.problem_id}"
