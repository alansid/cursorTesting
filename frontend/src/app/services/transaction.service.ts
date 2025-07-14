import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  cardNumber: string;
  transactionDate: string;
  amount: number;
  merchantName: string;
  merchantLocation: string;
  currency: string;
  status: string;
  transactionType: string;
  referenceNumber: string;
  description: string;
}

export interface TransactionPage {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TransactionQueryRequest {
  cardNumber?: string;
  merchantName?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  currency?: string;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getAllTransactions(page: number = 0, size: number = 10, sortBy: string = 'transactionDate', sortDirection: string = 'desc'): Observable<TransactionPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<TransactionPage>(this.baseUrl, { params });
  }

  searchTransactions(queryRequest: TransactionQueryRequest): Observable<TransactionPage> {
    return this.http.post<TransactionPage>(`${this.baseUrl}/search`, queryRequest);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  getTransactionsByCardNumber(cardNumber: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/card/${cardNumber}`);
  }

  getTotalAmountByDateRange(startDate: string, endDate: string): Observable<number> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<number>(`${this.baseUrl}/stats/total-amount`, { params });
  }

  getTransactionCountByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/count/${status}`);
  }
}