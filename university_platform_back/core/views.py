
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Teacher, Project, Review
from .serializers import TeacherSerializer, ProjectSerializer, ReviewSerializer, SearchInputSerializer
from .permissions import IsOwnerOrReadOnly

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

# @api_view(['POST'])
# def search_view(request):
#     serializer = SearchInputSerializer(data=request.data)
#     if serializer.is_valid():
#         query = serializer.validated_data['query']
#         return Response({"result": f"Searching for: {query}"})
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)