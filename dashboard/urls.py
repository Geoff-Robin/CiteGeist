from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('article/<str:paper_id>/', views.article_detail, name='article_detail'),
    path('profile/', views.profile_view, name='profile'),
    path('search/', views.search_view, name='search'),
    path('similar-to-you/', views.similar_to_you, name='similar_to_you')
]