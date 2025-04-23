from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Teacher, Project, Review, Course

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

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.name')
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'code', 'description', 'teacher', 'teacher_name', 'created_at']
        read_only_fields = ['created_at']

class CourseEnrollmentSerializer(serializers.Serializer):
    course_id = serializers.IntegerField(required=True)
    
    def validate_course_id(self, value):
        try:
            Course.objects.get(id=value)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course does not exist")
        return value

class SearchInputSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=100, required=True)
    department = serializers.CharField(max_length=100, required=False)
    interests = serializers.CharField(max_length=200, required=False)

class UserProfileSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    skills = serializers.CharField(max_length=500, required=False)
    department = serializers.CharField(max_length=100, required=False)