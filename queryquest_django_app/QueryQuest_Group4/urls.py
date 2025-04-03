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
from users.views import signup, login, logout, getUserById, deleteUser
from usermessages.views import send_message, mark_as_read, select_all_users, all_messages

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/signup/', signup, name='signup'),  
    path('api/login/', login, name='login'), 
    path('api/logout/', logout, name='logout'),
    path('api/users/<int:user_id>/', getUserById, name='get_user_by_id'),
    path('api/users/<int:user_id>/delete/', deleteUser, name='delete_user'),

    path('api/send_message/', send_message, name='send-message'),
    path('api/mark_as_read/<int:message_id>/', mark_as_read, name='mark_as_read'),
    path('api/allusers/', select_all_users, name='select_all_users'),
    path('api/allmessages/', all_messages, name='all_messages'),

    # Path to problems app
    path('problems/', include('problems.urls')),


    # Path to submissions app
    path('api/submissions/', include('submissions.urls')),

    # Include the progress app URLs
    path('api/progress/', include('progress.urls')),  

    # Path to feedback app
    path('feedback/', include('feedback.urls')),

    
]
