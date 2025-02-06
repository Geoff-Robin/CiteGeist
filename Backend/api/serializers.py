from rest_framework import serializers
from .models import Users,Papers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['email']=user.email

        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'password','interests']
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    def update(self,instance,validated_data):
        instance.email=validated_data.get('email',instance.email)
        instance.username=validated_data.get('username',instance.username)
        instance.interests=validated_data.get('interests',instance.interests)
        password = validated_data.pop('password', None)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model=Papers()
        fields = ['title', 'id', 'url', 'abstract','authors']
        
