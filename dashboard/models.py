from django.db import models

class ResearchArticle(models.Model):
    id = models.AutoField(primary_key=True)  # Automatically increments for each article
    name = models.CharField(max_length=255)  # Name of the research article
    authors = models.CharField(max_length=255)  # Authors of the article
    abstract = models.TextField()  # Abstract of the article

    def __str__(self):
        return self.name  # Returns the name of the article when the object is printed