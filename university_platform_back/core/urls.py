
from django.urls import path
from .views import (
    ProjectListCreate, ProjectDetail,
    review_list_create, teacher_list
)

urlpatterns = [
    path('projects/', ProjectListCreate.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project-detail'),

    path('reviews/', review_list_create, name='review-list-create'),

    path('teachers/', teacher_list, name='teacher-list'),

    # path('search/', search_view, name='search'),
]