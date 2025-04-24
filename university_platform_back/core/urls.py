from django.urls import path
from .views import (
    ProjectListCreate, ProjectDetail,
    review_list_create, teacher_list,
    CourseListView, CourseDetailView,
    course_enroll, search_view, logout_view,
    register_user
)

urlpatterns = [
    path('projects/', ProjectListCreate.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project-detail'),

    path('reviews/', review_list_create, name='review-list-create'),

    path('teachers/', teacher_list, name='teacher-list'),

    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/enroll/', course_enroll, name='course-enroll'),

    path('search/', search_view, name='search'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_user, name='register'),
]