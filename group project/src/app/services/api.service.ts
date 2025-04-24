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

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/`, profileData);
  }

  search(params: SearchParams): Observable<SearchResponse> {
    console.log('Поиск с параметрами:', params);

    const query = params.query ? params.query.toLowerCase() : '';
    const department = params.department ? params.department.toLowerCase() : '';
    const interests = params.interests ? params.interests.toLowerCase() : '';

    return this.http.post<SearchResponse>(`${this.apiUrl}/search/`, params)
      .pipe(
        catchError(error => {
          console.error('Ошибка при запросе к API:', error);
          
          return of(this.getMockSearchResults({
            query,
            department,
            interests
          }));
        })
      );
  }

  private getMockSearchResults(params: SearchParams): SearchResponse {
    const { query, department, interests } = params;
    const mockResponse: SearchResponse = {
      teachers: [],
      courses: [],
      students: []
    };

    mockResponse.students = [
      {
        username: 'Amanov',
        name: 'Аманов Алимжан',
        email: 'a.amanov@kbtu.kz',
        department: 'IT',
        skills: 'программирование, разработка, IT'
      },
      {
        username: 'Nurmukan',
        name: 'Нурмукан Кастер',
        email: 'k.nurmukan@kbtu.kz',
        department: 'IT',
        skills: 'математика, программирование'
      },
      {
        username: 'Izbasar',
        name: 'Асылжан Избасар',
        email: 'a.izzbasar@kbtu.kz',
        department: 'IT',
        skills: 'программирование, разработка, IT'
      }
    ].filter(student => {
      if (!query && !department && !interests) return false;
      
      const nameMatch = student.name.toLowerCase().includes(query) || 
                        student.username.toLowerCase().includes(query);
      const deptMatch = !department || student.department.toLowerCase().includes(department);
      const skillsMatch = !interests || student.skills.toLowerCase().includes(interests);
      
      return (query ? nameMatch : true) && deptMatch && skillsMatch;
    });

    mockResponse.courses = [
      {
        id: 1,
        title: 'Введение в программирование',
        code: 'CS101',
        teacher_name: 'Нурмукан Кастер',
        description: 'Базовый курс по программированию',
        department: 'IT'
      },
      {
        id: 2,
        title: 'Алгоритмы и структуры данных',
        code: 'CS201',
        teacher_name: 'Аманов Алимжан',
        description: 'Изучение алгоритмов и структур данных',
        department: 'Информатика'
      },
      {
        id: 3,
        title: 'Web-разработка',
        code: 'IT305',
        teacher_name: 'Асылжан Избасар',
        description: 'Разработка веб-приложений',
        department: 'IT'
      },
      {
        id: 4,
        title: 'Машинное обучение',
        code: 'ML101',
        teacher_name: 'Куралбаев Айбек',
        description: 'Основы и методы машинного обучения',
        department: 'Информатика'
      },
      {
        id: 5,
        title: 'Базы данных',
        code: 'DB202',
        teacher_name: 'Кайдарова Назым',
        description: 'Проектирование и работа с базами данных',
        department: 'IT'
      }
    ].filter(course => {
      if (!query && !department && !interests) return false;
      
      const nameMatch = course.title.toLowerCase().includes(query) || 
                        course.code.toLowerCase().includes(query);
      
      const deptMatch = !department || 
                        course.department.toLowerCase().includes(department) ||
                        course.teacher_name.toLowerCase().includes(department);
      
      const interestsMatch = !interests || 
                             course.description.toLowerCase().includes(interests) ||
                             course.title.toLowerCase().includes(interests);
      
      return (query ? nameMatch : true) && deptMatch && interestsMatch;
    });

    mockResponse.teachers = [
      {
        id: 1,
        name: 'Нурмукан Кастер',
        department: 'Информатика',
        courses: ['Введение в программирование', 'Дискретная математика']
      },
      {
        id: 2,
        name: 'Аманов Алимжан',
        department: 'Математика',
        courses: ['Алгоритмы и структуры данных', 'Математический анализ']
      },
      {
        id: 3,
        name: 'Асылжан Избасар',
        department: 'IT',
        courses: ['Web-разработка', 'Frontend разработка']
      },
      {
        id: 4,
        name: 'Куралбаев Айбек',
        department: 'Информатика',
        courses: ['Машинное обучение', 'Анализ данных']
      },
      {
        id: 5,
        name: 'Кайдарова Назым',
        department: 'IT',
        courses: ['Базы данных', 'SQL и СУБД']
      }
    ].filter(teacher => {
      if (!query && !department && !interests) return false;
      
      const nameMatch = teacher.name.toLowerCase().includes(query);
      const deptMatch = !department || teacher.department.toLowerCase().includes(department);
      
      const coursesString = teacher.courses.join(' ').toLowerCase();
      const interestsMatch = !interests || coursesString.includes(interests);
      
      return (query ? nameMatch : true) && deptMatch && interestsMatch;
    });

    return mockResponse;
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students/`);
  }
} 