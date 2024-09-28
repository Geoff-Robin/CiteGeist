from django.urls import path
from . import views as about_views
from .views import CustomLoginView
urlpatterns=[
    path('',about_views.about,name="about"),
    path('login/', CustomLoginView.as_view(), name="login"),
    path('register/',about_views.register,name="register")
]