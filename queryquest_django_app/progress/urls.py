from django.urls import path
from .views import ProgressView, StudentProgressView, ProblemProgressView
# , CreateStudentWithProgressView, CreateProblemWithProgressView


urlpatterns = [
    # URL for manage progress for a specific student and a specific problem
    path('<int:student_id>/<int:problem_id>/', ProgressView.as_view(), name='progress-detail'),

    # Get all progress records for a specific student
    path('student/<int:student_id>/', StudentProgressView.as_view(), name='progress-for-student'),

    # Get all progress records for a specific problem across all students
    path('problem/<int:problem_id>/', ProblemProgressView.as_view(), name='progress-for-problem'),
    
    # # URL for creating a student with progress for all problems
    # path('create_student_with_progress/', CreateStudentWithProgressView.as_view(), name='create-student-with-progress'),
    
    # # URL for creating a problem with progress for all students
    # path('create_problem_with_progress/', CreateProblemWithProgressView.as_view(), name='create-problem-with-progress'),
]