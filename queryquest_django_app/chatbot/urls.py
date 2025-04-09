# chatbot/urls.py
from django.urls import path
from .views import top_5_students, number_of_students, number_of_problems
from .views import QueryStudentPoints, QueryStudentRankingWithPosition, QueryStudentWrongProblems

urlpatterns = [
    # 配置 RESTful API 路径，传入 student_id 作为路径参数
    path('query_points/<int:student_id>/', QueryStudentPoints.as_view(), name='query_student_points'),
    
    path('query_ranking_position/<int:student_id>/', QueryStudentRankingWithPosition.as_view(), name='query_student_ranking_position'),

    path('query_wrong_problems/<int:student_id>/', QueryStudentWrongProblems.as_view(), name='query_student_wrong_problems'),

    path('top_5_students/', top_5_students, name='get_top_5_students'),
    path('number_of_students/', number_of_students, name='get_number_of_students'),
    path('number_of_problems/', number_of_problems, name='get_number_of_problems'),
    

]
