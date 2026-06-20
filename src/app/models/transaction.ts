export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
}