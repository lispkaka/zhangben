import { useMemo, useState } from 'react';
import type { Expense, ExpenseFilters } from '../types/Expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onExport: () => void;
}

const initialFilters: ExpenseFilters = {
  category: '全部',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  keyword: ''
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(amount);

const matchesFilters = (expense: Expense, filters: ExpenseFilters) => {
  const date = new Date(expense.date);

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    if (date < start) return false;
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    if (date > end) return false;
  }

  if (filters.category !== '全部' && expense.category !== filters.category) {
    return false;
  }

  if (filters.minAmount) {
    const min = Number(filters.minAmount);
    if (!Number.isNaN(min) && expense.amount < min) {
      return false;
    }
  }

  if (filters.maxAmount) {
    const max = Number(filters.maxAmount);
    if (!Number.isNaN(max) && expense.amount > max) {
      return false;
    }
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    if (!(expense.note || '').toLowerCase().includes(keyword)) {
      return false;
    }
  }

  return true;
};

const ExpenseList = ({ expenses, onDelete, onEdit, onExport }: ExpenseListProps) => {
  const [filters, setFilters] = useState<ExpenseFilters>(initialFilters);

  const filteredExpenses = useMemo(
    () => expenses.filter((expense) => matchesFilters(expense, filters)),
    [expenses, filters]
  );

  if (expenses.length === 0) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 text-center text-slate-500 dark:text-slate-300">
        目前还没有记录，先添加一笔吧～
      </section>
    );
  }

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            消费记录
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            共 {filteredExpenses.length} 条记录
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExport}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-200"
          >
            导出 CSV
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-200"
          >
            重置筛选
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3 dark:text-slate-200">
        <label className="flex flex-col">
          起始日期
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col">
          截止日期
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col">
          分类
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {['全部', '餐饮', '交通', '娱乐', '购物', '其他'].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          最低金额
          <input
            type="number"
            name="minAmount"
            min="0"
            value={filters.minAmount}
            onChange={handleFilterChange}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col">
          最高金额
          <input
            type="number"
            name="maxAmount"
            min="0"
            value={filters.maxAmount}
            onChange={handleFilterChange}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col sm:col-span-2 lg:col-span-1">
          备注关键词
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="如：午餐"
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
          没有符合条件的记录，尝试调整筛选条件。
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-200">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="py-2">日期</th>
                  <th className="py-2">分类</th>
                  <th className="py-2 text-right">金额</th>
                  <th className="py-2">备注</th>
                  <th className="py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-slate-100 last:border-none dark:border-slate-700"
                  >
                    <td className="py-3">{formatDate(expense.date)}</td>
                    <td className="py-3">{expense.category}</td>
                    <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-300">
                      {expense.note || '-'}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="text-sm text-indigo-500 hover:text-indigo-600 transition"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        className="text-sm text-rose-500 hover:text-rose-600 transition"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {filteredExpenses.map((expense) => (
              <li
                key={expense.id}
                className="rounded-lg border border-slate-100 p-4 shadow-sm dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{formatDate(expense.date)}</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {expense.category}
                    </p>
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                {expense.note && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    {expense.note}
                  </p>
                )}
                <div className="mt-3 flex gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => onEdit(expense)}
                    className="text-indigo-500 hover:text-indigo-600 transition"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="text-rose-500 hover:text-rose-600 transition"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default ExpenseList;

