import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Transaction } from '../../models/transaction';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1,  date: '2025-03-01', description: 'Salary Deposit',       category: 'Income',        amount: 4200.00, type: 'credit' },
  { id: 2,  date: '2025-03-02', description: 'Rent Payment',         category: 'Housing',       amount: 1100.00, type: 'debit'  },
  { id: 3,  date: '2025-03-04', description: 'Grocery Store',        category: 'Food',          amount:   87.45, type: 'debit'  },
  { id: 4,  date: '2025-03-05', description: 'Netflix Subscription', category: 'Entertainment', amount:   15.99, type: 'debit'  },
  { id: 5,  date: '2025-03-06', description: 'Freelance Payment',    category: 'Income',        amount:  650.00, type: 'credit' },
  { id: 6,  date: '2025-03-08', description: 'Electric Bill',        category: 'Utilities',     amount:   92.30, type: 'debit'  },
  { id: 7,  date: '2025-03-10', description: 'Restaurant Dinner',    category: 'Food',          amount:   43.20, type: 'debit'  },
  { id: 8,  date: '2025-03-12', description: 'Amazon Purchase',      category: 'Shopping',      amount:   67.89, type: 'debit'  },
  { id: 9,  date: '2025-03-14', description: 'Gas Station',          category: 'Transport',     amount:   55.00, type: 'debit'  },
  { id: 10, date: '2025-03-15', description: 'Interest Earned',      category: 'Income',        amount:   12.50, type: 'credit' },
  { id: 11, date: '2025-03-18', description: 'Gym Membership',       category: 'Health',        amount:   40.00, type: 'debit'  },
  { id: 12, date: '2025-03-20', description: 'Online Course',        category: 'Education',     amount:   29.99, type: 'debit'  },
  { id: 13, date: '2025-03-22', description: 'Coffee Shop',          category: 'Food',          amount:   18.75, type: 'debit'  },
  { id: 14, date: '2025-03-25', description: 'Phone Bill',           category: 'Utilities',     amount:   55.00, type: 'debit'  },
  { id: 15, date: '2025-03-28', description: 'Bonus Payment',        category: 'Income',        amount:  500.00, type: 'credit' },
];

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-table.html',
  styleUrl: './transaction-table.css'
})
export class TransactionTable implements OnInit {

  selectedCategory: string = 'All';
  transactions: Transaction[] = [];
  newTransaction: Partial<Transaction> = {
    date: '', description: '', category: '', amount: 0, type: 'debit'
  };
  sortColumn: keyof Transaction = 'date';
  sortAscending = true;

  private apiUrl = 'https://ledgerbackend-pwc4.onrender.com/api/transactions';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.transactions = MOCK_TRANSACTIONS;
  this.cdr.detectChanges();
  // this.loadTransactions();   // comment this out temporarily
}

 loadTransactions(): void {
  this.http.get<Transaction[]>(this.apiUrl).pipe(
    catchError(() => of(MOCK_TRANSACTIONS))
  ).subscribe({
    next: (data) => {
      this.transactions = data && data.length > 0 ? data : MOCK_TRANSACTIONS;
      this.cdr.detectChanges();
    },
    error: () => {
      this.transactions = MOCK_TRANSACTIONS;
      this.cdr.detectChanges();
    }
  });
}

  addTransaction(): void {
    if (!this.newTransaction.description || !this.newTransaction.amount) {
      return;
    }
    this.http.post<Transaction>(this.apiUrl, this.newTransaction).pipe(
      catchError(() => of({ ...this.newTransaction, id: Date.now() } as Transaction))
    ).subscribe((saved) => {
      this.transactions = [...this.transactions, saved];
      this.newTransaction = { date: '', description: '', category: '', amount: 0, type: 'debit' };
      this.cdr.detectChanges();
    });
  }

  deleteTransaction(id: number): void {
    this.http.delete<void>(this.apiUrl + '/' + id).pipe(
      catchError(() => of(undefined))
    ).subscribe(() => {
      this.transactions = this.transactions.filter((t) => t.id !== id);
      this.cdr.detectChanges();
    });
  }

  get uniqueCategories(): string[] {
    const set = new Set<string>();
    for (const t of this.transactions) {
      set.add(t.category);
    }
    return Array.from(set);
  }

  get filteredTransactions(): Transaction[] {
    if (this.selectedCategory === 'All') {
      return this.transactions;
    }
    return this.transactions.filter((t) => t.category === this.selectedCategory);
  }

  get totalIncome(): number {
    let sum = 0;
    for (const t of this.filteredTransactions) {
      if (t.type === 'credit') sum += t.amount;
    }
    return sum;
  }

  get totalExpenses(): number {
    let sum = 0;
    for (const t of this.filteredTransactions) {
      if (t.type === 'debit') sum += t.amount;
    }
    return sum;
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  sortBy(column: keyof Transaction): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    const dir = this.sortAscending ? 1 : -1;
    this.transactions = [...this.transactions].sort((a, b) => {
      if (a[column] < b[column]) return -1 * dir;
      if (a[column] > b[column]) return 1 * dir;
      return 0;
    });
    this.cdr.detectChanges();
  }
}