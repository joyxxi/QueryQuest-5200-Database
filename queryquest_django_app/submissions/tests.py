from django.test import TestCase
from .models import Submission

class SubmissionTests(TestCase):

    def test_incorrect_submissions(self):
        """测试获取特定学生的错误提交记录"""
        response = self.client.get('/submissions/incorrect/student1/')  # 假设你的 URL 配置已经正确
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'DROP')  # 错误答案
        self.assertNotContains(response, 'SELECT')  # 正确答案的提交不应该在这个接口中返回

    def test_problem_submissions(self):
        """测试获取某个问题的所有提交记录"""
        response = self.client.get('/submissions/problem/1/')  # 假设你有一个视图用于返回某个问题的提交记录
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'DROP')  # 该问题的错误答案提交
        self.assertContains(response, 'SELECT')  # 该问题的正确答案提交也应该出现
