import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-container">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary" *ngIf="authService.isAuthenticated()">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <i class="fas fa-credit-card me-2"></i>
            信用卡管理系統
          </a>
          <div class="navbar-nav ms-auto">
            <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
              <i class="fas fa-tachometer-alt me-1"></i>
              儀表板
            </a>
            <a class="nav-link" routerLink="/transactions" routerLinkActive="active">
              <i class="fas fa-list me-1"></i>
              交易記錄
            </a>
            <a class="nav-link" href="#" (click)="logout()">
              <i class="fas fa-sign-out-alt me-1"></i>
              登出
            </a>
          </div>
        </div>
      </nav>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .main-content {
      padding: 20px 0;
    }
    
    .navbar-brand {
      font-weight: 600;
      font-size: 1.25rem;
    }
    
    .nav-link {
      font-weight: 500;
      margin: 0 0.5rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class AppComponent {
  title = 'Credit Card Management System';

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}