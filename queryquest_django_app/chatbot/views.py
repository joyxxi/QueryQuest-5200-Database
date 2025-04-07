from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from django.conf import settings
from users.models import Student  # 确保引入正确的模型路径

# 配置 OpenAI API 密钥
client = OpenAI(api_key=settings.OPENAI_API_KEY)

class QueryStudentRanking(APIView):
    def get(self, request, student_id):
        '''
        Retrieves the total_points for a specific student using ChatGPT.
        '''
        # 将 student_id 传给 ChatGPT，要求其生成 SQL 查询
        prompt = f"""
        Generate an SQL query to retrieve the total_points from the 'Students' table 
        where student_id = {student_id}. The database structure is:
        table 'Students' with fields 'student_id' (primary key) and 'total_points'.
        The query should only return 'student_id' and 'total_points' columns.
        Please output only the SQL query with no additional text.
        """

        try:
            # 与 ChatGPT API 交互，获取 SQL 查询
            response = client.chat.completions.create(  # 使用正确的端点
                model="gpt-3.5-turbo",  # 使用指定的模型
                messages=[  # ChatGPT 模型的对话内容需要通过 messages 参数传递
                    {"role": "system", "content": "You are a helpful SQL assistant."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=150,  # 调整为你需要的 token 数量
                temperature=0.5,  # 可以调整温度控制生成的文本多样性
            )

            # 获取 ChatGPT 返回的 SQL 查询
            generated_sql = response.choices[0].message.content.strip()

            # 执行生成的 SQL 查询（注意安全性，避免直接执行不可信的 SQL）
            students = Student.objects.raw(generated_sql)  # 执行生成的 SQL 查询

            # 如果查询结果为空，返回错误信息
            if not students:
                return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            # 只需要从查询结果中提取 total_points
            total_points = students[0].total_points

            # 返回学生的 total_points
            return Response({
                'student_id': student_id,  # 直接使用请求中的 student_id
                'total_points': total_points,
                'generated_sql': generated_sql
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # 捕获错误并返回错误信息
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QueryStudentRankingWithPosition(APIView):
    def get(self, request, student_id):
        '''
        Retrieves the rank and total_points for a specific student using ChatGPT.
        '''
        # 将 student_id 传给 ChatGPT，要求其生成 SQL 查询
        prompt = f"""
        Generate an SQL query that ranks all students based on their total_points from the 'Students' table. 
        Use a WITH clause to generate a ranking for all students and then select both 'student_id' and 'ranking_position' 
        for the student with student_id = {student_id}.
        The database structure is:
        table 'Students' with fields 'student_id' (primary key) and 'total_points'.
        The query should return both 'student_id' and 'ranking_position' for the specified student.
        The field for rank should be labeled as \`ranking_position\` (or another name) to avoid conflicts with SQL reserved keywords.
        Please output only the SQL query with no additional text.
        """

        try:
            # 与 ChatGPT API 交互，获取 SQL 查询
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful SQL assistant."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=150,
                temperature=0.5,
            )

            # 获取 ChatGPT 返回的 SQL 查询并清理
            generated_sql = response.choices[0].message.content.strip()

            # 清理掉代码块格式化部分
            generated_sql = generated_sql.replace('```sql', '').replace('```', '').strip()
            # 输出生成的 SQL 查询以便调试
            print("Generated SQL:", generated_sql)

            # 执行生成的 SQL 查询（确保包括主键）
            students = Student.objects.raw(generated_sql)  # 执行生成的 SQL 查询

            # 如果查询结果为空，返回错误信息
            if not students:
                return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            # 提取 rank
            ranking_position = students[0].ranking_position

            # 返回学生的排名和生成的 SQL 查询
            return Response({
                'student_id': student_id,  # 使用请求中的 student_id
                'ranking_position': ranking_position,
                'generated_sql': generated_sql  # 将生成的 SQL 查询作为附加字段返回
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # 捕获错误并返回错误信息
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

