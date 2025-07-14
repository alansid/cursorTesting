import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService, Transaction, TransactionPage, TransactionQueryRequest } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>交易记录</h2>
            <div>
              <button class="btn btn-outline-secondary me-2" (click)="goBack()">返回</button>
              <button class="btn btn-outline-danger" (click)="logout()">登出</button>
            </div>
          </div>

          <!-- 筛选条件 -->
          <div class="card mb-4">
            <div class="card-header">
              <h5>筛选条件</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label for="cardNumber" class="form-label">卡号</label>
                  <input type="text" id="cardNumber" class="form-control" 
                         [(ngModel)]="searchCriteria.cardNumber" placeholder="输入卡号">
                </div>
                <div class="col-md-3">
                  <label for="startDate" class="form-label">开始日期</label>
                  <input type="date" id="startDate" class="form-control" 
                         [(ngModel)]="searchCriteria.startDate">
                </div>
                <div class="col-md-3">
                  <label for="endDate" class="form-label">结束日期</label>
                  <input type="date" id="endDate" class="form-control" 
                         [(ngModel)]="searchCriteria.endDate">
                </div>
                                 <div class="col-md-3">
                   <label for="merchant" class="form-label">商户</label>
                   <input type="text" id="merchant" class="form-control" 
                          [(ngModel)]="searchCriteria.merchantName" placeholder="输入商户名称">
                 </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-3">
                  <label for="status" class="form-label">状态</label>
                  <select id="status" class="form-control" [(ngModel)]="searchCriteria.status">
                    <option value="">全部状态</option>
                    <option value="SUCCESS">成功</option>
                    <option value="FAILED">失败</option>
                    <option value="PENDING">待处理</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="minAmount" class="form-label">最小金额</label>
                  <input type="number" id="minAmount" class="form-control" 
                         [(ngModel)]="searchCriteria.minAmount" placeholder="0.00">
                </div>
                <div class="col-md-3">
                  <label for="maxAmount" class="form-label">最大金额</label>
                  <input type="number" id="maxAmount" class="form-control" 
                         [(ngModel)]="searchCriteria.maxAmount" placeholder="99999.99">
                </div>
                <div class="col-md-3 d-flex align-items-end">
                  <button class="btn btn-primary me-2" (click)="searchTransactions()">搜索</button>
                  <button class="btn btn-secondary" (click)="resetSearch()">重置</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 交易列表 -->
          <div class="card">
            <div class="card-header">
              <h5>交易记录 ({{totalElements}} 条)</h5>
            </div>
            <div class="card-body">
              <div *ngIf="loading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div *ngIf="!loading && transactions.length === 0" class="text-center text-muted">
                没有找到交易记录
              </div>

              <div *ngIf="!loading && transactions.length > 0">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>交易ID</th>
                        <th>卡号</th>
                        <th>交易时间</th>
                        <th>金额</th>
                        <th>商户</th>
                        <th>地点</th>
                        <th>状态</th>
                        <th>货币</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let transaction of transactions">
                        <td>{{transaction.id}}</td>
                        <td>{{maskCardNumber(transaction.cardNumber)}}</td>
                        <td>{{formatDate(transaction.transactionDate)}}</td>
                        <td class="text-end">{{transaction.amount | number:'1.2-2'}}</td>
                                                 <td>{{transaction.merchantName}}</td>
                                                 <td>{{transaction.merchantLocation}}</td>
                        <td>
                          <span class="badge" [ngClass]="getStatusClass(transaction.status)">
                            {{getStatusText(transaction.status)}}
                          </span>
                        </td>
                        <td>{{transaction.currency}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分页 -->
                <nav *ngIf="totalPages > 1">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" [class.disabled]="currentPage === 0">
                      <a class="page-link" (click)="goToPage(currentPage - 1)">上一页</a>
                    </li>
                    <li class="page-item" 
                        *ngFor="let page of getPages()" 
                        [class.active]="page === currentPage">
                      <a class="page-link" (click)="goToPage(page)">{{page + 1}}</a>
                    </li>
                    <li class="page-item" [class.disabled]="currentPage === totalPages - 1">
                      <a class="page-link" (click)="goToPage(currentPage + 1)">下一页</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge.bg-success { background-color: #198754 !important; }
    .badge.bg-danger { background-color: #dc3545 !important; }
    .badge.bg-warning { background-color: #ffc107 !important; color: #000; }
    
    .table th {
      background-color: #f8f9fa;
      border-top: none;
    }
    
    .pagination .page-link {
      cursor: pointer;
    }
    
    .pagination .page-item.disabled .page-link {
      cursor: not-allowed;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  searchCriteria = {
    cardNumber: '',
    startDate: '',
    endDate: '',
    merchantName: '',
    status: '',
    minAmount: null as number | null,
    maxAmount: null as number | null
  };

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    const queryRequest: TransactionQueryRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'transactionDate',
      sortDirection: 'desc'
    };

    // 添加搜索条件
    if (this.searchCriteria.cardNumber) {
      queryRequest.cardNumber = this.searchCriteria.cardNumber;
    }
    if (this.searchCriteria.startDate) {
      queryRequest.startDate = this.searchCriteria.startDate;
    }
    if (this.searchCriteria.endDate) {
      queryRequest.endDate = this.searchCriteria.endDate;
    }
    if (this.searchCriteria.merchantName) {
      queryRequest.merchantName = this.searchCriteria.merchantName;
    }
    if (this.searchCriteria.status) {
      queryRequest.status = this.searchCriteria.status;
    }
    if (this.searchCriteria.minAmount !== null) {
      queryRequest.minAmount = this.searchCriteria.minAmount;
    }
    if (this.searchCriteria.maxAmount !== null) {
      queryRequest.maxAmount = this.searchCriteria.maxAmount;
    }

    this.transactionService.searchTransactions(queryRequest).subscribe({
      next: (response: TransactionPage) => {
        this.transactions = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('加载交易记录失败:', error);
        this.loading = false;
      }
    });
  }

  searchTransactions() {
    this.currentPage = 0;
    this.loadTransactions();
  }

  resetSearch() {
    this.searchCriteria = {
      cardNumber: '',
      startDate: '',
      endDate: '',
      merchantName: '',
      status: '',
      minAmount: null,
      maxAmount: null
    };
    this.currentPage = 0;
    this.loadTransactions();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxPages = Math.min(5, this.totalPages);
    let start = Math.max(0, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxPages);
    
    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  maskCardNumber(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'bg-success';
      case 'FAILED':
        return 'bg-danger';
      case 'PENDING':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return '成功';
      case 'FAILED':
        return '失败';
      case 'PENDING':
        return '待处理';
      default:
        return status;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}