import { Component } from '@angular/core';
import { HeadingComponent } from '../home/heading/heading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

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
  // Категория поиска
  searchCategory: 'people' | 'courses' | 'professors' = 'people';
  
  // Параметры поиска
  searchParams = {
    query: '',
    department: '',
    interests: ''
  };
  
  // Результаты поиска
  searchResults: any[] = [];
  
  // Статус загрузки
  isLoading = false;
  
  // Сообщение об ошибке
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  // Метод для получения текста кнопки поиска
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
    // При смене категории обновляем текст кнопки и очищаем результаты
    this.searchResults = [];
    this.errorMessage = '';
  }

  onSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];
    
    // Проверяем наличие хотя бы одного критерия поиска
    if (!this.searchParams.query && !this.searchParams.department && !this.searchParams.interests) {
      this.isLoading = false;
      this.errorMessage = 'Пожалуйста, укажите хотя бы один критерий поиска';
      return;
    }
    
    // Формируем запрос на основе введенных значений
    const query = this.searchParams.query || '';
    
    // Вызываем метод поиска из ApiService
    this.apiService.search({
      query: query,
      department: this.searchParams.department,
      interests: this.searchParams.interests
    }).subscribe({
      next: (response: SearchResponse) => {
        this.isLoading = false;
        
        // Обрабатываем результаты в зависимости от категории
        if (this.searchCategory === 'people') {
          this.searchResults = response.students || [];
        } else if (this.searchCategory === 'courses') {
          this.searchResults = response.courses || [];
        } else if (this.searchCategory === 'professors') {
          this.searchResults = response.teachers || [];
        }
        
        console.log('Результаты поиска:', this.searchResults);
        
        // Если ничего не найдено
        if (this.searchResults.length === 0) {
          this.errorMessage = 'Ничего не найдено. Попробуйте изменить параметры поиска.';
        }
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = 'Произошла ошибка при поиске. Пожалуйста, попробуйте позже.';
        console.error('Search error:', error);
      }
    });
  }
}
