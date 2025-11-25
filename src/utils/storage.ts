import type { Expense } from '../types/Expense';

const STORAGE_KEY = 'zhangben.expenses';

export const loadExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Expense[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => ({
      ...item,
      amount: Number(item.amount),
      note: typeof item.note === 'string' ? item.note : '',
      date: new Date(item.date).toISOString()
    }));
  } catch (error) {
    console.error('Failed to load expenses from storage', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses to storage', error);
  }
};

