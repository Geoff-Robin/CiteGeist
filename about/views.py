from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login,authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from .models import Profile
from dashboard.views import dashboard as dash
from django.urls import reverse

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.contrib import messages
from django.urls import reverse
from .models import Profile
# About view
def about(request):
    return render(request, 'about/about.html')  # Make sure to create this template
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('thq-sign-up-10-password')
        interests = request.POST.get('interests', '')

        print(f"Received username: {username}")
        print(f"Received password: {'*' * len(password) if password else 'No password'}")
        print(f"Received interests: {interests}")

        if not username:
            messages.error(request, "Username cannot be empty.")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists. Please choose a different one.")
        else:
            try:
                user = User.objects.create_user(username=username, password=password)
                profile = Profile.objects.create(user=user, interests=interests)
                print(f"Created profile with interests: {profile.interests}")
                
                login(request, user)
                messages.success(request, "Registration successful. Welcome!")
                return redirect(reverse('dashboard'))
            except Exception as e:
                print(f"Error creating user or profile: {str(e)}")
                messages.error(request, f"Registration failed. Error: {str(e)}")

    return render(request, 'about/register.html')




# Login view
def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid name or password")
            return render(request, 'about/login.html')
    
    return render(request, 'about/login.html')