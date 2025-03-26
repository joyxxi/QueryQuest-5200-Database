"""
URL configuration for QueryQuest_Group4 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from submissions import views
from users.views import signup, login, send_message # Import the new view

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/signup/', signup, name='signup'),  
    path('api/login/', login, name='login'), 
    path('api/send_message/', send_message, name='send-message'),

    # Path to get incorrect submissions for a specific student
    path('submissions/incorrect/<str:student_id>/', views.incorrect_submissions, name='incorrect_submissions'),
    
    # Path to get all submissions for a specific problem
    path('submissions/problem/<int:problem_id>/', views.problem_submissions, name='problem_submissions'),

    # Path to problems app
    path('problems/', include('problems.urls')),

    # Include the progress app URLs
    path('progress/', include('progress.urls')),  

    
]
