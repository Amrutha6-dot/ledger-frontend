import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1,  date: '2025-03-01', description: 'Salary Deposit',        category: 'Income',        amount: 4200.00, type: 'credit' },
  { id: 2,  date: '2025-03-02', description: 'Rent Payment',          category: 'Housing',       amount: 1100.00, type: 'debit'  },
  { id: 3,  date: '2025-03-04', description: 'Grocery Store',         category: 'Food',          amount:   87.45, type: 'debit'  },
  { id: 4,  date: '2025-03-05', description: 'Netflix Subscription',  category: 'Entertainment', amount:   15.99, type: 'debit'  },
  { id: 5,  date: '2025-03-06', description: 'Freelance Payment',     category: 'Income',        amount:  650.00, type: 'credit' },
  { id: 6,  date: '2025-03-08', description: 'Electric Bill',         category: 'Utilities',     amount:   92.30, type: 'debit'  },
  { id: 7,  date: '2025-03-10', description: 'Restaurant - Dinner',   category: 'Food',          amount:   43.20, type: 'debit'  },
  { id: 8,  date: '2025-03-12', description: 'Amazon Purchase',       category: 'Shopping',      amount:   67.89, type: 'debit'  },
  { id: 9,  date: '2025-03-14', description: 'Gas Station',           category: 'Transport',     amount:   55.00, type: 'debit'  },
  { id: 10, date: '2025-03-15', description: 'Interest Earned',       category: 'Income',        amount:   12.50, type: 'credit' },
  { id: 11, date: '2025-03-18', description: 'Gym Membership',        category: 'Health',        amount:   40.00, type: 'debit'  },
  { id: 12, date: '2025-03-20', description: 'Online Course',         category: 'Education',     amount:   29.99, type: 'debit'  },
  { id: 13, date: '2025-03-22', description: 'Coffee Shop',           category: 'Food',          amount:   18.75, type: 'debit'  },
  { id: 14, date: '2025-03-25', description: 'Phone Bill',            category: 'Utilities',     amount:   55.00, type: 'debit'  },
  { id: 15, date: '2025-03-28', description: 'Bonus Payment',         category: 'Income',        amount:  500.00, type: 'credit' },
];

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = 'https://ledgerbackend-pwc4.onrender.com/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      catchError(() => of(MOCK_TRANSACTIONS))   // ← fallback when Render is down
    );
  }

  addTransaction(t: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, t).pipe(
      catchError(() => of({ ...t, id: Date.now() }))
    );
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined as any))
    );
  }
}