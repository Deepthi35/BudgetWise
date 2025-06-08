import type { ExpenseCategoryValue } from '@/config/categories';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategoryValue;
  date: string; // ISO string for date
}
