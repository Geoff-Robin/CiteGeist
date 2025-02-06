import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
from .models import Papers
import yake

class DocumentSearch:
    def __init__(self, vectors_path='doc_vectors.joblib'):
        self.vectors_path = Path(vectors_path)
        self.vectorizer = None
        self.doc_vectors = None
        self.paper_ids = None
        self.load_or_create_vectors()
    
    def preprocess(self, text):
        return str(text).lower()
    
    def load_or_create_vectors(self):
        if self.vectors_path.exists():
            saved_data = joblib.load(self.vectors_path)
            self.vectorizer = saved_data['vectorizer']
            self.doc_vectors = saved_data['vectors']
            self.paper_ids = saved_data['paper_ids']
        else:
            self.compute_and_save_vectors()
    
    def compute_and_save_vectors(self):
        # Get all papers from database
        papers = Papers.objects.all().values('id', 'title', 'abstract', 'authors')
        
        if not papers:
            raise ValueError("No papers found in database")
        
        combined_docs = []
        paper_ids = []
        
        for paper in papers:
            # Include title, abstract, and authors in the vector
            combined_text = f"{paper['title']} {paper['abstract']} {paper['authors']}"
            combined_docs.append(combined_text)
            paper_ids.append(paper['id'])
        
        self.vectorizer = TfidfVectorizer(preprocessor=self.preprocess)
        self.doc_vectors = self.vectorizer.fit_transform(combined_docs)
        self.paper_ids = paper_ids
        
        joblib.dump({
            'vectorizer': self.vectorizer,
            'vectors': self.doc_vectors,
            'paper_ids': self.paper_ids
        }, self.vectors_path)
    
    def search(self, query_terms, author=None, min_results=25, threshold=0.3):
        """
        Search for papers based on query terms and optionally filter by author.
        
        Args:
            query_terms (str): Search query
            author (str, optional): Author name to filter results
            min_results (int): Minimum number of results
            threshold (float): Minimum similarity score (0-1)
            
        Returns:
            QuerySet: Matching Papers objects
        """
        query_vector = self.vectorizer.transform([self.preprocess(query_terms)])
        similarities = cosine_similarity(self.doc_vectors, query_vector).flatten()
        
        high_similarity_indices = np.where(similarities >= threshold)[0]
        high_similarity_papers = [(i, similarities[i]) for i in high_similarity_indices]
        high_similarity_papers.sort(key=lambda x: -x[1])
        
        if len(high_similarity_papers) < min_results:
            sorted_indices = np.argsort(-similarities)
            additional_indices = [
                i for i in sorted_indices 
                if i not in high_similarity_indices
            ]
            
            additional_papers = [
                (i, similarities[i]) 
                for i in additional_indices[:min_results - len(high_similarity_papers)]
            ]
            high_similarity_papers.extend(additional_papers)
        
        selected_paper_ids = [self.paper_ids[i[0]] for i in high_similarity_papers]
        
        # Get base queryset
        results = Papers.objects.filter(id__in=selected_paper_ids)
        
        # Filter by author if provided
        if author:
            results = results.filter(authors__icontains=author)
        
        return results

    def refresh_vectors(self):
        """
        Force refresh of document vectors
        """
        self.compute_and_save_vectors()

class InterestAmplifier:
    def __init__(self, text, user):
        self.text = text
        self.user = user
        kw_extractor = yake.KeywordExtractor()
        self.keywords = [kw for kw, _ in kw_extractor.extract_keywords(text)]

    def update_interests(self, new_keywords):
        interests = self.user.interests.split()  
        interests.extend(new_keywords)
        interests = interests[-5:]  
        self.user.interests = ' '.join(interests)  
        self.user.save() 

    def from_search(self):
        if self.text == self.user.interests:
            return
        self.update_interests(self.keywords)
    
    def from_pdf(self):
        self.update_interests(self.keywords[:3] if len(self.keywords) > 3 else self.keywords)

    def from_paper(self):
        self.update_interests(self.keywords[:3] if len(self.keywords) > 3 else self.keywords)