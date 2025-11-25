import { useEffect, useState } from 'react';
import type { Expense } from '../types/Expense';

interface EditExpenseModalProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

const categories = ['餐饮', '交通', '娱乐', '购物', '其他'];

const toDateInputValue = (isoDate: string) =>
  new Date(isoDate).toISOString().split('T')[0];

const EditExpenseModal = ({
  open,
  expense,
  onClose,
  onSave
}: EditExpenseModalProps) => {
  const [form, setForm] = useState({
    amount: '',
    category: categories[0],
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount.toString(),
        category: expense.category,
        note: expense.note,
        date: toDateInputValue(expense.date)
      });
    }
  }, [expense]);

  if (!open || !expense) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      return;
    }
    onSave({
      ...expense,
      amount: Number(amount.toFixed(2)),
      category: form.category,
      note: form.note.trim(),
      date: new Date(form.date).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            编辑账单
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
          >
            关闭
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col text-sm text-slate-600 dark:text-slate-200">
            金额 (¥)
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={handleChange}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600 dark:text-slate-200">
            分类
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm text-slate-600 dark:text-slate-200">
            日期
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600 dark:text-slate-200">
            备注
            <input
              type="text"
              name="note"
              maxLength={80}
              value={form.note}
              onChange={handleChange}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            保存修改
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;

