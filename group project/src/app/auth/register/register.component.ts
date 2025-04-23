import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <h2>Регистрация</h2>
      <div *ngIf="error" class="error-message">{{ error }}</div>
      <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input 
            type="text" 
            id="username" 
            [(ngModel)]="userData.username" 
            name="username" 
            required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            [(ngModel)]="userData.email" 
            name="email" 
            required>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            type="password" 
            id="password" 
            [(ngModel)]="userData.password" 
            name="password" 
            required>
          <small class="password-hint">Минимум 8 символов</small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Подтверждение пароля</label>
          <input 
            type="password" 
            id="confirmPassword" 
            [(ngModel)]="confirmPassword" 
            name="confirmPassword" 
            required>
        </div>
        <button type="submit" [disabled]="!registerForm.form.valid || loading || userData.password !== confirmPassword">
          {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
        </button>
      </form>
      <div class="login-link">
        Уже есть аккаунт? <a routerLink="/login">Войти</a>
      </div>
      <div class="back-link">
        <a routerLink="/">Вернуться на главную</a>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 25px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
    }
    
    input:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .password-hint {
      display: block;
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    
    button {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    button:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #dc3545;
      background-color: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    
    .login-link, .back-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
    
    .login-link a, .back-link a {
      color: #007bff;
      text-decoration: none;
    }
    
    .login-link a:hover, .back-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: ''
  };
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.userData.password !== this.confirmPassword) {
      this.error = 'Пароли не совпадают';
      return;
    }

    if (this.userData.password.length < 8) {
      this.error = 'Пароль должен содержать минимум 8 символов';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.userData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          
          // Более детальная обработка ошибок
          if (err.status === 400) {
            // Обрабатываем ошибки валидации
            const errorData = err.error;
            
            if (errorData.username) {
              this.error = `Имя пользователя: ${errorData.username[0]}`;
            } else if (errorData.email) {
              this.error = `Email: ${errorData.email[0]}`;
            } else if (errorData.password) {
              this.error = `Пароль: ${errorData.password[0]}`;
            } else if (errorData.non_field_errors) {
              this.error = errorData.non_field_errors[0];
            } else {
              this.error = 'Ошибка в данных регистрации';
            }
          } else if (err.status === 0) {
            this.error = 'Сервер недоступен. Проверьте подключение к интернету.';
          } else {
            this.error = `Ошибка при регистрации (${err.status}): ${err.message}`;
          }
          
          console.error('Registration error:', err);
        }
      });
  }
} 