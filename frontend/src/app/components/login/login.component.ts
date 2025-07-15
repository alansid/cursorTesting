import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="container-fluid h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <i class="fas fa-credit-card fa-3x text-primary mb-3"></i>
                  <h2 class="card-title fw-bold">信用卡管理系統</h2>
                  <p class="text-muted">請登入您的帳戶</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label for="username" class="form-label">帳號</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-user"></i>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="username"
                        formControlName="username"
                        [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                        placeholder="請輸入帳號">
                    </div>
                    <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                      請輸入帳號
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label">密碼</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        class="form-control" 
                        id="password"
                        formControlName="password"
                        [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                        placeholder="請輸入密碼">
                    </div>
                    <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                      請輸入密碼
                    </div>
                  </div>

                  <div class="alert alert-danger" *ngIf="errorMessage">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    {{ errorMessage }}
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary w-100 btn-lg"
                    [disabled]="loginForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="fas fa-sign-in-alt me-2"></i>
                    {{ loading ? '登入中...' : '登入' }}
                  </button>
                </form>

                <div class="mt-4 p-3 bg-light rounded">
                  <h6 class="mb-2">測試帳號:</h6>
                  <p class="mb-1"><strong>帳號:</strong> 00000</p>
                  <p class="mb-0"><strong>密碼:</strong> 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card {
      border-radius: 15px;
    }
    
    .input-group-text {
      border-radius: 8px 0 0 8px;
      background-color: #f8f9fa;
    }
    
    .form-control {
      border-radius: 0 8px 8px 0;
      border-left: none;
    }
    
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #667eea, #764ba2);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = '登入失敗，請檢查您的帳號密碼';
        console.error('Login error:', error);
      }
    });
  }
}