from django.db import models
from django.contrib.auth.models import User
class ResearchArticle(models.Model):
    id = models.CharField(max_length=255,primary_key=True)  # Automatically increments for each article
    name = models.CharField(max_length=255)  # Name of the research article
    authors = models.CharField(max_length=255)  # Authors of the article
    abstract = models.TextField()  # Abstract of the article
    primary_category = models.CharField(max_length=255) 
    categories=models.CharField(max_length=255)
    def __str__(self):
        return self.name  # Returns the name of the article when the object is printed

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(ResearchArticle, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "User Activities"
        ordering = ['-viewed_at']

    def __str__(self):
        return f"{self.user.username} viewed {self.article.name}"