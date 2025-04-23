from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Teacher, Project, Review, Course
from .serializers import (
    TeacherSerializer, ProjectSerializer, ReviewSerializer, SearchInputSerializer,
    CourseSerializer, CourseEnrollmentSerializer, UserProfileSerializer
)
from .permissions import IsOwnerOrReadOnly

User = get_user_model()

class ProjectListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def review_list_create(request):
    if request.method == 'GET':
        reviews = Review.objects.all().order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            Review.objects.create(
                teacher_id=request.data.get('teacher'),
                author=request.user,
                rating=request.data.get('rating'),
                text=request.data.get('text')
            )

            return Response({'message': 'Review created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def teacher_list(request):
    teachers = Teacher.objects.all()
    serializer = TeacherSerializer(teachers, many=True)
    return Response(serializer.data)

class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all().order_by('-created_at')
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return None

    def get(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def put(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def course_enroll(request):
    serializer = CourseEnrollmentSerializer(data=request.data)
    if serializer.is_valid():
        course_id = serializer.validated_data['course_id']
        course = Course.objects.get(id=course_id)
        course.students.add(request.user)
        return Response({"message": f"Successfully enrolled in {course.title}"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_view(request):
    serializer = SearchInputSerializer(data=request.data)
    if serializer.is_valid():
        query = serializer.validated_data['query']
        department = serializer.validated_data.get('department', '')
        
        # Search for teachers
        teacher_query = Q(name__icontains=query)
        if department:
            teacher_query &= Q(department__icontains=department)
        
        teachers = Teacher.objects.filter(teacher_query)
        teacher_serializer = TeacherSerializer(teachers, many=True)
        
        # Search for courses
        course_query = Q(title__icontains=query) | Q(code__icontains=query)
        if department:
            course_query &= Q(teacher__department__icontains=department)
        
        courses = Course.objects.filter(course_query)
        course_serializer = CourseSerializer(courses, many=True)
        
        return Response({
            "teachers": teacher_serializer.data,
            "courses": course_serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # Since JWT tokens are stateless, we don't need to invalidate them server-side
    # The client should delete the token
    return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)