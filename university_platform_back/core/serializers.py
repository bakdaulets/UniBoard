from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Teacher, Project, Review

User = get_user_model()

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'name', 'department']

class ProjectSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    teacher = serializers.ReadOnlyField(source='teacher.name')

    class Meta:
        model = Review
        fields = ['id', 'teacher', 'author', 'rating', 'text', 'created_at']
        read_only_fields = ['author', 'created_at']


class SearchInputSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=100, required=True)