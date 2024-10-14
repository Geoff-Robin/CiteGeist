from django.urls import path
from . import views as about_views
urlpatterns=[
    path('',about_views.about,name="about"),
    path('login/', about_views.login_view, name="login"),
    path('register/',about_views.register,name="register")
]