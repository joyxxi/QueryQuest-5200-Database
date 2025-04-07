# chatbot/urls.py
from django.urls import path
from .views import QueryStudentRanking, QueryStudentRankingWithPosition

urlpatterns = [
    # 配置 RESTful API 路径，传入 student_id 作为路径参数
    path('query_ranking/<int:student_id>/', QueryStudentRanking.as_view(), name='query_student_ranking'),
    
    path('query_ranking_position/<int:student_id>/', QueryStudentRankingWithPosition.as_view(), name='query_student_ranking_position'),
]
