import { Component } from '@angular/core';
import { HeadingComponent } from '../home/heading/heading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

interface SearchResponse {
  teachers: any[];
  courses: any[];
  students?: any[];
}

@Component({
  selector: 'app-directory',
  imports: [HeadingComponent, FormsModule, CommonModule],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.css'
})
export class DirectoryComponent {
  searchCategory: 'people' | 'courses' | 'professors' = 'people';
  
  searchParams = {
    query: '',
    department: '',
    interests: ''
  };
  
  searchResults: any[] = [];
  
  isLoading = false;
  
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  getBtnText(): string {
    switch(this.searchCategory) {
      case 'people':
        return 'людей';
      case 'courses':
        return 'курсы';
      case 'professors':
        return 'преподавателей';
      default:
        return '';
    }
  }

  setCategory(category: 'people' | 'courses' | 'professors'): void {
    this.searchCategory = category;
    this.searchResults = [];
    this.errorMessage = '';
  }

  onSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];
    
    if (!this.searchParams.query && !this.searchParams.department && !this.searchParams.interests) {
      this.isLoading = false;
      this.errorMessage = 'Пожалуйста, укажите хотя бы один критерий поиска';
      return;
    }
    
    const query = this.searchParams.query || '';
    
    this.apiService.search({
      query: query,
      department: this.searchParams.department,
      interests: this.searchParams.interests
    }).subscribe({
      next: (response: SearchResponse) => {
        this.isLoading = false;
        
        if (this.searchCategory === 'people') {
          this.searchResults = response.students || [];
        } else if (this.searchCategory === 'courses') {
          this.searchResults = response.courses || [];
        } else if (this.searchCategory === 'professors') {
          this.searchResults = response.teachers || [];
        }
        
        console.log('Результаты поиска:', this.searchResults);
        
        if (this.searchResults.length === 0) {
          this.errorMessage = 'Ничего не найдено. Попробуйте изменить параметры поиска.';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.errorMessage = 'Сервер недоступен. Проверьте соединение с интернетом или обратитесь к администратору.';
          } else if (error.status === 404) {
            this.errorMessage = 'API поиска не найден. Обратитесь к администратору.';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'У вас нет прав для выполнения этого действия. Пожалуйста, войдите в систему снова.';
          } else {
            this.errorMessage = `Ошибка сервера: ${error.status}. ${error.message || 'Пожалуйста, попробуйте позже.'}`;
          }
        } else {
          this.errorMessage = 'Произошла ошибка при поиске. Пожалуйста, попробуйте позже.';
        }
        
        console.error('Search error:', error);
      }
    });
  }
}
