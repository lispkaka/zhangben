import type { Expense } from '../types/Expense';

const CSV_HEADER = ['ID', '金额', '分类', '备注', '日期'];

const escapeValue = (value: string | number) => {
  const stringified = typeof value === 'number' ? value.toString() : value;
  if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
    return `"${stringified.replace(/"/g, '""')}"`;
  }
  return stringified;
};

export const exportExpensesToCsv = (expenses: Expense[]) => {
  const rows = expenses.map((expense) => [
    expense.id,
    expense.amount.toFixed(2),
    expense.category,
    expense.note,
    new Date(expense.date).toLocaleString()
  ]);

  const csvContent = [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeValue).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

