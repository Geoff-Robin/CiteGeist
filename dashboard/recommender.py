import numpy as np
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity
from .models import UserActivity, ResearchArticle

def get_collaborative_recommendations(user, n_recommendations=10):
    # Get all users and articles
    users = list(UserActivity.objects.values_list('user', flat=True).distinct())
    articles = list(ResearchArticle.objects.all())
    
    # Create user-item matrix
    user_item_matrix = np.zeros((len(users), len(articles)))
    
    for i, u in enumerate(users):
        user_articles = UserActivity.objects.filter(user=u).values_list('article', flat=True)
        for j, a in enumerate(articles):
            if a.id in user_articles:
                user_item_matrix[i, j] = 1
    
    # Convert to sparse matrix for efficiency
    user_item_matrix_sparse = csr_matrix(user_item_matrix)
    
    # Compute cosine similarity between users
    user_similarity = cosine_similarity(user_item_matrix_sparse)
    
    # Get the index of the current user
    user_index = users.index(user.id)
    
    # Get similar users
    similar_users = user_similarity[user_index].argsort()[::-1][1:11]  # top 10 similar users
    
    # Get articles viewed by similar users but not by the current user
    current_user_articles = set(UserActivity.objects.filter(user=user).values_list('article', flat=True))
    recommended_articles = set()
    
    for similar_user_index in similar_users:
        similar_user_id = users[int(similar_user_index)]  # Convert to int
        similar_user_articles = set(UserActivity.objects.filter(user_id=similar_user_id).values_list('article', flat=True))
        recommended_articles.update(similar_user_articles - current_user_articles)
        
        if len(recommended_articles) >= n_recommendations:
            break
    
    # Convert article IDs to ResearchArticle objects
    recommended_articles = ResearchArticle.objects.filter(id__in=list(recommended_articles)[:n_recommendations])
    
    return recommended_articles