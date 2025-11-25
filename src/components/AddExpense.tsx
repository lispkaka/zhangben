import { useState } from 'react';
import type { Expense } from '../types/Expense';

interface AddExpenseProps {
  onAdd: (expense: Expense) => void;
}

const categories = ['餐饮', '交通', '娱乐', '购物', '其他'];
const todayISO = () => new Date().toISOString().split('T')[0];

const AddExpense = ({ onAdd }: AddExpenseProps) => {
  const [form, setForm] = useState({
    amount: '',
    category: categories[0],
    note: '',
    date: todayISO()
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAmount = Number(form.amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: Number(numericAmount.toFixed(2)),
      category: form.category,
      note: form.note.trim(),
      date: new Date(form.date).toISOString()
    };

    onAdd(expense);
    setForm({
      amount: '',
      category: categories[0],
      note: '',
      date: todayISO()
    });
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        添加消费
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              placeholder="请输入金额"
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
              max={todayISO()}
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
              placeholder="如：朋友聚餐"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          添加账单
        </button>
      </form>
    </section>
  );
};

export default AddExpense;

