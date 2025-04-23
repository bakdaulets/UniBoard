import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo">
        <h1>UniBoard</h1>
      </div>
      <nav class="navigation">
        <ul>
          <li><a routerLink="/Home" routerLinkActive="active">Главная</a></li>
          <li><a routerLink="/Directory" routerLinkActive="active">Справочник</a></li>
        </ul>
      </nav>
      <div class="auth-buttons">
        <ng-container *ngIf="isLoggedIn; else loginButtons">
          <button class="btn btn-logout" (click)="logout()">Выйти</button>
        </ng-container>
        <ng-template #loginButtons>
          <a routerLink="/login" class="btn btn-login">Войти</a>
          <a routerLink="/register" class="btn btn-register">Регистрация</a>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #007bff;
      font-weight: bold;
    }
    
    .navigation ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .navigation li {
      margin: 0 10px;
    }
    
    .navigation a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .navigation a:hover, .navigation a.active {
      color: #007bff;
      background-color: rgba(0,123,255,0.1);
    }
    
    .auth-buttons {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .btn-login {
      background-color: transparent;
      color: #007bff;
      border: 1px solid #007bff;
    }
    
    .btn-register, .btn-logout {
      background-color: #007bff;
      color: white;
      border: none;
    }
    
    .btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `]
})
export class HeadingComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
