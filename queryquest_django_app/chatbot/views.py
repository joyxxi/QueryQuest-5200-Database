from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from django.conf import settings
from users.models import Student
from rest_framework.decorators import api_view
from django.db import connection
import re
import logging
from submissions.models import Submission


# 配置 OpenAI API 密钥
client = OpenAI(api_key=settings.OPENAI_API_KEY)

class QueryStudentPoints(APIView):
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



#-----------------------API-----------------------#
@api_view(['GET'])
def top_5_students(request):
    """
    Retrieves the names of the top 5 students with the highest scores, including ties.
    """
    query = top_students_llm()
    print("Generated SQL Query:", query)

    if not is_safe_query(query, allowed_tables=['Students', 'Users'], allow_joins=True, allow_subqueries=True):
        return Response({
            "message": "Sorry, I couldn't retrieve the student rankings at this time.",
            "query": query,
        }, status=status.HTTP_400_BAD_REQUEST)


    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            columns = [col[0] for col in cursor.description]
            results = cursor.fetchall()
            
        students_data = []
        for row in results:
            students_data.append(dict(zip(columns, row)))

        if not students_data:
            formatted_message = "I couldn't find any student records with scores."
        else:
            formatted_message = "Here are the top 5 students with the highest scores:\n\n"

            for i, student in enumerate(students_data, 1):
                formatted_message += f"{i}. {student['username']}: {student['total_points']} points\n"
            
            if len(students_data) > 5:
                formatted_message += "\nMore than 5 students are shown because there are tied scores."
        
        return Response({
            "message": formatted_message,
            "query": query,
            "data": students_data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        
        return Response({
            "message": "I encountered an issue while retrieving the student rankings. Please try again later.",
            "query": query,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def number_of_students(request):
    """
    Retrieves the current number of students.
    """
    query = number_of_students_llm()
    if not is_safe_query(query, allowed_tables=['Students'], allow_joins=False, allow_subqueries=True):
        return Response({
            "message": "Sorry, I couldn't retrieve the number of students at this time.",
            "query": query,
        }, status=status.HTTP_400_BAD_REQUEST)
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
        
        if result:
            count = result[0]
            return Response({
                "message": f"There are currently {count} students enrolled.",
                "query": query,
                "data": {"number_of_students": count}
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": "I couldn't find the number of students.",
                "query": query,
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        return Response({
            "message": "I encountered an issue while retrieving the number of students. Please try again later.",
            "query": query,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def number_of_problems(request):
    """
    Retrieves the current number of problems.
    """
    query = number_of_problems_llm()
    if not is_safe_query(query, allowed_tables=['Problems'], allow_joins=False, allow_subqueries=True):
        return Response({
            "message": "Sorry, I couldn't retrieve the number of problems at this time.",
            "query": query,
        }, status=status.HTTP_400_BAD_REQUEST)
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
        
        if result:
            count = result[0]
            return Response({
                "message": f"There are currently {count} problems in the database.",
                "query": query,
                "data": {"number_of_problems": count}
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": "I couldn't find the number of problems.",
                "query": query,
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        return Response({
            "message": "I encountered an issue while retrieving the number of problems. Please try again later.",
            "query": query,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#----------------------OpenAI API----------------------#
def number_of_problems_llm():
    """
    Calls OpenAI API to generate SQL query for retrieving the number of problems.
    """
    prompt = """
    Generate a SQL query to count the total number of problems.
    The database structure is:
    table 'Problems' with fields 'problem_id' (primary key) etc.;
    Only return the SQL query without any explanation.
    """
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates SQL queries."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )
    
    sql_query = response.choices[0].message.content.strip()

    match = re.search(r"```(?:sql)?(.*?)```", sql_query, re.DOTALL | re.IGNORECASE)
    if match:
        sql_query = match.group(1).strip()
    else:
        sql_query = sql_query.strip()
    
    return sql_query

def number_of_students_llm():
    """
    Calls OpenAI API to generate SQL query for retrieving the number of students.
    """
    prompt = """
    Generate a SQL query to count the total number of current students.
    The database structure is:
    table 'Students' with fields 'student_id' (primary key) and 'total_points'.
    Only return the SQL query without any explanation.
    """
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates SQL queries."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )
    
    sql_query = response.choices[0].message.content.strip()

    match = re.search(r"```(?:sql)?(.*?)```", sql_query, re.DOTALL | re.IGNORECASE)
    if match:
        sql_query = match.group(1).strip()
    else:
        sql_query = sql_query.strip()
    
    return sql_query


def top_students_llm():
    """
    Calls OpenAI API to generate SQL query for retrieving top students.
    """
    prompt = """
    Generate a SQL query to retrieve the top 5 students with the highest scores.
    If there is a tie for any position, include all students with the same score.
    The result should be ordered by score in descending order.
    The database structure is:
    table 'Students' with fields 'student_id' (primary key) and 'total_points';
    table 'Users' with fields 'user_id' (primary key) and 'username'.
    The query should join the 'Students' and 'Users' tables on 'student_id' and 'user_id'.
    Only return the SQL query without any explanation.
    """
    
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates SQL queries."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )
    
    sql_query = response.choices[0].message.content.strip()

    match = re.search(r"```(?:sql)?(.*?)```", sql_query, re.DOTALL | re.IGNORECASE)
    if match:
        sql_query = match.group(1).strip()
    else:
        sql_query = sql_query.strip()
    
    return sql_query

#-----------------------Helper-----------------------#
def is_safe_query(query, allowed_tables=[], allow_joins=True, allow_subqueries=True):
    """
    Flexible SQL validation that can be configured for different APIs.
    """
    # Basic validation
    query_lower = query.lower().strip()
    
    if not query_lower.startswith('select'):
        return False
    
    # SQL comments
    if '--' in query_lower or '/*' in query_lower:
        return False
    
    # Dangerous operations
    dangerous_operations = [
        'insert', 'update', 'delete', 'drop', 'alter', 'truncate', 
        'create', 'grant', 'revoke', 'commit', 'rollback'
    ]
    
    for operation in dangerous_operations:
        if re.search(r'\b' + operation + r'\b', query_lower):
            return False

    # Table validation
    from_pattern = r'from\s+([a-zA-Z0-9_\.]+)(?:\s+(?:as\s+)?[a-zA-Z0-9_]+)?'
    join_pattern = r'join\s+([a-zA-Z0-9_\.]+)(?:\s+(?:as\s+)?[a-zA-Z0-9_]+)?'
    found_tables = set()
    
    for match in re.finditer(from_pattern, query_lower):
        table = match.group(1)
        if '.' in table:
            table = table.split('.')[-1]
        found_tables.add(table)
    
    for match in re.finditer(join_pattern, query_lower):
        table = match.group(1)
        # Remove schema prefixes
        if '.' in table:
            table = table.split('.')[-1]
        found_tables.add(table)

    for table in found_tables:
        if table not in [t.lower() for t in allowed_tables]:
            print(f"Table not allowed: {table}")
            return False
    
    # Check for JOIN if not allowed
    if not allow_joins and re.search(r'\bjoin\b', query_lower):
        print("JOIN not allowed")
        return False
    
    # Check for subqueries if not allowed
    if not allow_subqueries and ('(' in query_lower and 'select' in query_lower):
        print("Subqueries not allowed")
        return False
    
    # Check for suspicious patterns
    suspicious_patterns = ['exec', 'execute', 'sp_', 'xp_', '@@']
    for pattern in suspicious_patterns:
        if pattern in query_lower:
            print(f"Suspicious pattern found: {pattern}")
            return False
    
    return True
class QueryStudentWrongProblems(APIView):
    def get(self, request, student_id):
        '''
        Retrieves the problem_id of all wrong problems for a specific student using ChatGPT.
        '''
        prompt = f"""
Generate an SQL query to retrieve the distinct problem_id and the corresponding submission_id for all wrong problems (result = 'F') 
for the student with student_id = {student_id} from the 'Submissions' table. 
The database structure is:
table 'Submissions' with fields 'submission_id' (primary key), 'student_id', 'problem_id', and 'result' (which can be 'F' or 'P').

The query should have two levels: an inner query and an outer query. 
1. The inner query should find the minimum 'submission_id' for each 'problem_id' where the 'student_id' is {student_id} and 'result' is 'F'.
2. The outer query should use this inner query to retrieve the corresponding 'submission_id' and 'problem_id', ensuring that there are no duplicate 'problem_id' values.

The query should return only the columns 'submission_id' and 'problem_id', ensuring there are no duplicate 'problem_id' entries.

Please output only the SQL query, with no additional text or formatting, and ensure it includes both a subquery and an outer query.
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
            generated_sql = generated_sql.replace('```sql', '').replace('```', '').strip()

            # 输出生成的 SQL 查询以便调试
            print("Generated SQL:", generated_sql)

            # 执行生成的 SQL 查询（确保包括主键）
            problems = Submission.objects.raw(generated_sql)  # 执行生成的 SQL 查询

            # 如果查询结果为空，返回错误信息
            if not problems:
                return Response({"error": "No wrong problems found for this student."}, status=status.HTTP_404_NOT_FOUND)

            # 获取所有错题的 problem_id
            wrong_problem_ids = [problem.problem_id for problem in problems]

            # 返回错题的 problem_ids
            return Response({
                'student_id': student_id,  # 使用请求中的 student_id
                'wrong_problem_ids': wrong_problem_ids,
                'generated_sql': generated_sql  # 将生成的 SQL 查询作为附加字段返回
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # 捕获错误并返回错误信息
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

