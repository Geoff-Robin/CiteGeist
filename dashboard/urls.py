from django.urls import path
from . import views  # Assuming your views are in views.py of the same app

urlpatterns = [
    path('', views.dashboard, name='dashboard'),        # Home page
    path('profile/', views.profile, name='profile')  # Profile page
]