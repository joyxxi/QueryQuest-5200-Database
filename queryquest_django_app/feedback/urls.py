from django.urls import path
from .views import get_or_refresh_feedback

urlpatterns = [
    path('<int:student_id>/<int:problem_id>/', get_or_refresh_feedback, name='get_or_refresh_feedback'),
]
