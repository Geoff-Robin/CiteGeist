from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class Users(AbstractUser):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    interests = models.CharField()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','interests']

class Papers(models.Model):
    title=models.CharField()
    url=models.CharField()
    abstract=models.CharField()
    authors=models.CharField()

