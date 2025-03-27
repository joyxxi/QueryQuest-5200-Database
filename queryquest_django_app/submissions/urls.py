# submissions/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubmissionViewSet

# 创建一个默认的 router
router = DefaultRouter()
router.register(r'', SubmissionViewSet, basename='submission')

# 将路由添加到 urls 中
urlpatterns = [
    path('', include(router.urls)),  # 将 router 配置为根 URL
]
