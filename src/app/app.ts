import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionTable } from './components/transaction-table/transaction-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, TransactionTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'ledger-frontend';
}