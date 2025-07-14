import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>信用卡管理系统</h2>
            <button class="btn btn-outline-danger" (click)="logout()">登出</button>
          </div>
          
          <div class="row">
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h5 class="card-title">交易查询</h5>
                  <p class="card-text">查看和筛选信用卡交易记录</p>
                  <button class="btn btn-primary" (click)="goToTransactions()">查看交易</button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h5 class="card-title">账户信息</h5>
                  <p class="card-text">查看账户详细信息</p>
                  <button class="btn btn-secondary" disabled>即将推出</button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h5 class="card-title">报表统计</h5>
                  <p class="card-text">查看交易统计报表</p>
                  <button class="btn btn-secondary" disabled>即将推出</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 20px;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
    
    .card-body {
      padding: 2rem;
    }
    
    .btn {
      margin-top: 1rem;
    }
  `]
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }

  logout() {
    this.authService.logout();
  }
}