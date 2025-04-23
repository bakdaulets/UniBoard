from django.contrib import admin
from .models import Teacher, Project, Review, Course

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name', 'department']
    search_fields = ['name', 'department']
    list_filter = ['department']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at']
    search_fields = ['title', 'description', 'author__username']
    list_filter = ['created_at']
    date_hierarchy = 'created_at'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'author', 'rating', 'created_at']
    search_fields = ['teacher__name', 'author__username', 'text']
    list_filter = ['rating', 'created_at', 'teacher']
    date_hierarchy = 'created_at'

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'teacher', 'created_at']
    search_fields = ['code', 'title', 'description', 'teacher__name']
    list_filter = ['teacher', 'created_at']
    date_hierarchy = 'created_at'
    filter_horizontal = ['students']