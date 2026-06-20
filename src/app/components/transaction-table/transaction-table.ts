import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../../models/transaction';

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

  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.http.get<Transaction[]>(this.apiUrl).subscribe((data) => {
      this.transactions = data;
      this.cdr.detectChanges();
    });
  }

  addTransaction(): void {
    if (!this.newTransaction.description || !this.newTransaction.amount) {
      return;
    }
    this.http.post<Transaction>(this.apiUrl, this.newTransaction).subscribe((saved) => {
      this.transactions = [...this.transactions, saved];
      this.newTransaction = { date: '', description: '', category: '', amount: 0, type: 'debit' };
      this.cdr.detectChanges();
    });
  }

  deleteTransaction(id: number): void {
    this.http.delete<void>(this.apiUrl + '/' + id).subscribe(() => {
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