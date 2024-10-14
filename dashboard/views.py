# views.py
import pandas as pd
from django.shortcuts import render
from sklearn.metrics.pairwise import cosine_similarity
from itertools import chain, combinations
from sklearn.feature_extraction.text import TfidfVectorizer
from .models import ResearchArticle, UserActivity
from about.models import Profile
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from .recommender import get_collaborative_recommendations
def get_interest_subsets(user_interests):
    # Split the interests by comma and strip whitespace
    interest_list = [interest.strip() for interest in user_interests.split(',')]
    
    # Generate all possible non-empty subsets
    all_subsets = list(chain.from_iterable(combinations(interest_list, r) for r in range(1, len(interest_list) + 1)))

    # Join each subset into a string
    subset_strings = [' '.join(subset) for subset in all_subsets]
    return subset_strings
def get_recommendations(user_interests, user=None, exclude_ids=None):
    df = pd.read_csv('dataset/cs_papers_api.csv')
    df['combined_text'] = df['title'] +  ' ' + df['categories']

    # If user is provided, exclude articles they've already viewed
    if user and exclude_ids is None:
        viewed_articles = UserActivity.objects.filter(user=user).values_list('article__id', flat=True)
        exclude_ids = list(viewed_articles)

    if exclude_ids:
        df = df[~df['paper_id'].isin(exclude_ids)]

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

    interest_subsets = get_interest_subsets(user_interests)

    best_scores = []
    for interests in interest_subsets:
        user_vector = vectorizer.transform([interests])
        similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
        best_scores.append(similarity_scores)

    combined_similarity_scores = pd.DataFrame(best_scores).max().values

    df['similarity_score'] = combined_similarity_scores

    top_articles = df.sort_values(by='similarity_score', ascending=False)
    print(top_articles)  # Check the console to ensure this returns data
    return top_articles[['paper_id', 'title', 'abstract', 'similarity_score']].to_dict(orient='records')

@login_required
def dashboard(request):
    user_profile = Profile.objects.get(user=request.user)
    user_interests = user_profile.interests
    
    # Get all recommendations
    all_recommendations = get_recommendations(user_interests, user=request.user)
    
    # Filter recommendations with similarity score above 0.4
    filtered_recommendations = [
        rec for rec in all_recommendations if rec['similarity_score'] > 0.4
    ]
    
    # Set up pagination
    paginator = Paginator(filtered_recommendations, 5)  # Show 5 recommendations per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'user_profile': user_profile,
    }
    
    return render(request, 'dashboard/dashboard.html', context)

@login_required
def profile(request):
    # Implement the profile view logic here
    return render(request, 'dashboard/profile.html')  # Simple profile template rendering

@login_required
def article_detail(request, paper_id):
    df = pd.read_csv('dataset/cs_papers_api.csv')
    article_data = df[df['paper_id'] == paper_id].to_dict(orient='records')[0]
    
    # Ensure all necessary fields are included
    if 'title' not in article_data:
        article_data['title'] = article_data.get('name', 'Untitled Article')
    if 'authors' not in article_data:
        article_data['authors'] = 'Unknown Authors'
    if 'abstract' not in article_data:
        article_data['abstract'] = 'No abstract available.'
    
    # Get or create the ResearchArticle object
    article, created = ResearchArticle.objects.get_or_create(
        id=paper_id,
        defaults={
            'name': article_data['title'],
            'authors': article_data['authors'],
            'abstract': article_data['abstract'],
            'primary_category': article_data.get('primary_category', ''),
            'categories': article_data.get('categories', '')
        }
    )
    
    # Record user activity
    UserActivity.objects.create(user=request.user, article=article)
    
    # Update user's interests with the article's primary category
    user_profile = Profile.objects.get(user=request.user)
    primary_category = article_data.get('primary_category', '')
    if primary_category:
        current_interests = set(user_profile.interests.split(',')) if user_profile.interests else set()
        current_interests.add(primary_category.strip())
        user_profile.interests = ','.join(current_interests)
        user_profile.save()
    
    # Get recommendations based on the current article, excluding viewed articles
    viewed_articles = UserActivity.objects.filter(user=request.user).values_list('article__id', flat=True)
    recommendations = get_recommendations(article_data['title'], exclude_ids=list(viewed_articles))[:4]
    
    return render(request, 'dashboard/articles.html', {
        'article': article_data,
        'recommendations': recommendations
    })

@login_required
def profile_view(request):
    # Get the user's recent activity
    user_activity = UserActivity.objects.filter(user=request.user).order_by('-viewed_at')[:5]

    # Get the user's most viewed categories as research interests
    research_interests = UserActivity.objects.filter(user=request.user).values('article__primary_category').annotate(
        category_count=Count('article__primary_category')
    ).order_by('-category_count')[:5]

    context = {
        'user_profile': {
            'user': request.user,
        },
        'user_activity': user_activity,
        'research_interests': [{'name': category['article__primary_category']} for category in research_interests],
    }

    return render(request, 'dashboard/profile.html', context)

def get_query_subsets(query):
    # Split the query into words
    words = query.split()
    
    # Generate all possible non-empty subsets
    all_subsets = list(chain.from_iterable(combinations(words, r) for r in range(1, len(words) + 1)))
    
    # Join each subset into a string
    subset_strings = [' '.join(subset) for subset in all_subsets]
    
    return subset_strings

@login_required
def search_view(request):
    query = request.GET.get('q', '')
    page_number = request.GET.get('page', 1)
    
    # Generate subsets of the query
    query_subsets = get_query_subsets(query)
    
    # Use get_recommendations for each subset
    all_recommendations = []
    for subset in query_subsets:
        recommendations = get_recommendations(subset, user=request.user)
        all_recommendations.extend(recommendations)
    
    # Remove duplicates based on paper_id
    unique_recommendations = {item['paper_id']: item for item in all_recommendations}.values()
    
    # Convert recommendations to a list of dictionaries and filter by similarity score
    results = [
        {
            'paper_id': item['paper_id'],
            'title': item['title'],
            'abstract': item['abstract'],
            'similarity_score': item['similarity_score']
        }
        for item in unique_recommendations if item['similarity_score'] >= 0.4
    ]
    
    # Sort results by similarity score in descending order
    results.sort(key=lambda x: x['similarity_score'], reverse=True)
    
    # Paginate the results
    paginator = Paginator(results, 5)  # 10 results per page
    page_obj = paginator.get_page(page_number)
    
    context = {
        'query': query,
        'page_obj': page_obj,
    }
    
    return render(request, 'dashboard/search.html', context)

@login_required
@login_required
def similar_to_you(request):
    recommended_articles = get_collaborative_recommendations(request.user)
    print(f"Recommended articles: {recommended_articles}")  # Debug print
    
    # Set up pagination
    paginator = Paginator(recommended_articles, 5)  # Show 5 recommendations per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    print(f"Page object: {page_obj}")  # Debug print
    
    context = {
        'page_obj': page_obj,
    }
    
    return render(request, 'dashboard/similar_to_you.html', context)