from django.urls import include,path
from .views import SearchView,RegisterView,LoginView,LogoutView,PdfView,PaperView
urlpatterns=[
    path('search',SearchView.as_view()),
    path('register',RegisterView.as_view()),
    path('login',LoginView.as_view()),
    path('logout',LogoutView.as_view()),
    path('pdf',PdfView.as_view()),
    path('paper',PaperView.as_view())
]