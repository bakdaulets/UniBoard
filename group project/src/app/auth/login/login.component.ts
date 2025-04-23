import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <h2>Войти в систему</h2>
      <div *ngIf="error" class="error-message">{{ error }}</div>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input 
            type="text" 
            id="username" 
            [(ngModel)]="username" 
            name="username" 
            required>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            type="password" 
            id="password" 
            [(ngModel)]="password" 
            name="password" 
            required>
        </div>
        <button type="submit" [disabled]="!loginForm.form.valid || loading">
          {{ loading ? 'Загрузка...' : 'Войти' }}
        </button>
      </form>
      <div class="register-link">
        Нет аккаунта? <a routerLink="/register">Зарегистрироваться</a>
      </div>
      <div class="back-link">
        <a routerLink="/">Вернуться на главную</a>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
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
    
    .register-link, .back-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
    
    .register-link a, .back-link a {
      color: #007bff;
      text-decoration: none;
    }
    
    .register-link a:hover, .back-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          
          // Более детальная обработка ошибок
          if (err.status === 400 || err.status === 401) {
            // Обрабатываем ошибки аутентификации
            const errorData = err.error;
            
            if (errorData.detail) {
              this.error = errorData.detail;
            } else if (errorData.non_field_errors) {
              this.error = errorData.non_field_errors[0];
            } else {
              this.error = 'Неверное имя пользователя или пароль';
            }
          } else if (err.status === 0) {
            this.error = 'Сервер недоступен. Проверьте подключение к интернету.';
          } else {
            this.error = `Ошибка при входе (${err.status}): ${err.message}`;
          }
          
          console.error('Login error:', err);
        }
      });
  }
} 