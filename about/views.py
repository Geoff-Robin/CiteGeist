from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login,authenticate
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from .models import Profile
from dashboard.views import dashboard as dash
# About view
def about(request):
    return render(request, 'about/about.html')  # Make sure to create this template


class CustomLoginView(LoginView):
    template_name = 'about/login.html'  # Update with your custom login template path

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        # Get the interests from the POST data
        interests = request.POST.getlist('interests')  # Get a list of selected interests
        
        if form.is_valid():
            user = form.save()
            # Create a UserProfile for the new user
            profile = Profile.objects.create(user=user)  # Create the profile
            
            # Set interests in the profile (as a comma-separated string)
            profile.interests = ', '.join(interests)  # Save as a comma-separated string
            profile.save()
            
            login(request, user)  # Log the user in after registration
            return redirect('dash')  # Redirect to the About page or another page after registration
        else:
            messages.error(request, "Registration failed. Please check the details.")
    else:
        form = UserCreationForm()
    return render(request, 'about/register.html', {'form': form})




# Login view
def login_view(request):
    if request.method == "POST":
        username = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid email or password")
            return render(request, 'about/login.html')
    
    return render(request, 'about/login.html')