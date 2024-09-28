# views.py
import pandas as pd
from django.shortcuts import render
from about.models import Profile  # Ensure you have the Profile model imported

def recommended_articles(request):
    # Load data from CSV file
    df = pd.read_csv('C://Users//HP//Codes//CiteGeist//CiteGeist//dashboard//sampled_cs_papers_1000.csv')  # Update with the correct path to your CSV file

    if request.user.is_authenticated:
        # Get user interests from the Profile model
        profile = Profile.objects.get(user=request.user)
        user_interests = profile.interests  # Assuming interests are stored as a comma-separated string
        
        # Split the interests into a list
        interests_list = [interest.strip() for interest in user_interests.split(',')]
    else:
        # Default interests or empty if user is not authenticated
        interests_list = []

    # Content-based filtering: create a filter based on interests
    # Assuming the DataFrame has a column 'keywords' which contains the relevant keywords for filtering
    filtered_articles = df[df['keywords'].apply(lambda x: any(interest.lower() in x.lower() for interest in interests_list))]

    # Select top 5 articles
    top_articles = filtered_articles.head(5)

    # Create an array of objects
    articles = [
        {
            'id': row['id'],
            'name': row['name'],
            'authors': row['authors'],
            'abstract': row['abstract']
        }
        for index, row in top_articles.iterrows()
    ]
    
    return articles  # Return articles for use in dashboard

def dashboard(request):
    articles = recommended_articles(request)  # Call the function to get recommended articles
    return render(request, 'dashboard.html', {'articles': articles})  # Pass articles to the dashboard template

def profile(request):
    # Implement the profile view logic here
    return render(request, 'profile.html')  # Simple profile template rendering
