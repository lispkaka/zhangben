export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
}

export interface ExpenseFilters {
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  keyword: string;
}

