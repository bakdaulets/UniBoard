import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface SearchParams {
  query: string;
  department?: string;
  interests?: string;
}

interface SearchResponse {
  teachers: any[];
  courses: any[];
  students?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Course related API calls
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/`);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}/`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/`, courseData);
  }

  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${id}/`, courseData);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${id}/`);
  }

  // User related API calls
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/`, profileData);
  }

  // Search API - сначала используем имитацию данных для демонстрации работы поиска
  search(params: SearchParams): Observable<SearchResponse> {
    console.log('Поиск с параметрами:', params);
    
    // Приводим параметры к нижнему регистру для более точного поиска
    const query = params.query ? params.query.toLowerCase() : '';
    const department = params.department ? params.department.toLowerCase() : '';
    const interests = params.interests ? params.interests.toLowerCase() : '';
    
    // Попытка выполнить запрос к бэкенду
    return this.http.post<SearchResponse>(`${this.apiUrl}/search/`, params)
      .pipe(
        catchError(error => {
          console.error('Ошибка при запросе к API:', error);
          
          // Если бэкенд недоступен или возвращает ошибку, используем тестовые данные
          return of(this.getMockSearchResults({
            query,
            department,
            interests
          }));
        })
      );
  }

  // Метод для создания тестовых данных поиска
  private getMockSearchResults(params: SearchParams): SearchResponse {
    const { query, department, interests } = params;
    const mockResponse: SearchResponse = {
      teachers: [],
      courses: [],
      students: []
    };

    // Имитация поиска людей
    mockResponse.students = [
      {
        username: 'amanov',
        name: 'Аманов Руслан',
        email: 'amanov@university.edu',
        department: 'IT',
        skills: 'программирование, разработка, IT'
      },
      {
        username: 'ivanov',
        name: 'Иванов Иван',
        email: 'ivanov@university.edu',
        department: 'Информатика',
        skills: 'математика, программирование'
      },
      {
        username: 'petrov',
        name: 'Петров Петр',
        email: 'petrov@university.edu',
        department: 'Математика',
        skills: 'статистика, анализ данных'
      }
    ].filter(student => {
      if (!query && !department && !interests) return false;
      
      const nameMatch = student.name.toLowerCase().includes(query) || 
                        student.username.toLowerCase().includes(query);
      const deptMatch = !department || student.department.toLowerCase().includes(department);
      const skillsMatch = !interests || student.skills.toLowerCase().includes(interests);
      
      return (query ? nameMatch : true) && deptMatch && skillsMatch;
    });

    // Имитация поиска курсов
    mockResponse.courses = [
      {
        id: 1,
        title: 'Введение в программирование',
        code: 'CS101',
        teacher_name: 'Петров А.И.',
        description: 'Базовый курс по программированию',
        department: 'IT'
      },
      {
        id: 2,
        title: 'Алгоритмы и структуры данных',
        code: 'CS201',
        teacher_name: 'Сидоров В.П.',
        description: 'Изучение алгоритмов и структур данных',
        department: 'Информатика'
      },
      {
        id: 3,
        title: 'Web-разработка',
        code: 'IT305',
        teacher_name: 'Кузнецова О.С.',
        description: 'Разработка веб-приложений',
        department: 'IT'
      },
      {
        id: 4,
        title: 'Машинное обучение',
        code: 'ML101',
        teacher_name: 'Иванов И.И.',
        description: 'Основы и методы машинного обучения',
        department: 'Информатика'
      },
      {
        id: 5,
        title: 'Базы данных',
        code: 'DB202',
        teacher_name: 'Сергеев С.С.',
        description: 'Проектирование и работа с базами данных',
        department: 'IT'
      }
    ].filter(course => {
      if (!query && !department && !interests) return false;
      
      // Проверяем совпадение по названию и коду курса
      const nameMatch = course.title.toLowerCase().includes(query) || 
                        course.code.toLowerCase().includes(query);
      
      // Проверяем совпадение по факультету
      const deptMatch = !department || 
                        course.department.toLowerCase().includes(department) ||
                        course.teacher_name.toLowerCase().includes(department);
      
      // Проверяем совпадение по навыкам/интересам в описании курса
      const interestsMatch = !interests || 
                             course.description.toLowerCase().includes(interests) ||
                             course.title.toLowerCase().includes(interests);
      
      return (query ? nameMatch : true) && deptMatch && interestsMatch;
    });

    // Имитация поиска преподавателей
    mockResponse.teachers = [
      {
        id: 1,
        name: 'Петров Алексей Иванович',
        department: 'Информатика',
        courses: ['Введение в программирование', 'Дискретная математика']
      },
      {
        id: 2,
        name: 'Сидоров Владимир Петрович',
        department: 'Математика',
        courses: ['Алгоритмы и структуры данных', 'Математический анализ']
      },
      {
        id: 3,
        name: 'Кузнецова Ольга Сергеевна',
        department: 'IT',
        courses: ['Web-разработка', 'Frontend разработка']
      },
      {
        id: 4,
        name: 'Иванов Игорь Иванович',
        department: 'Информатика',
        courses: ['Машинное обучение', 'Искусственный интеллект']
      }
    ].filter(teacher => {
      if (!query && !department && !interests) return false;
      
      const nameMatch = teacher.name.toLowerCase().includes(query);
      const deptMatch = !department || teacher.department.toLowerCase().includes(department);
      const coursesMatch = !interests || 
                           teacher.courses.some(course => course.toLowerCase().includes(interests));
      
      return (query ? nameMatch : true) && deptMatch && coursesMatch;
    });

    return mockResponse;
  }

  // Any other API calls your application needs
  // Example:
  // getStudents(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/students/`);
  // }
} 