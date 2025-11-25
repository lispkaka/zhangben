import { useEffect, useMemo, useState } from 'react';
import AddExpense from './components/AddExpense';
import DarkModeToggle from './components/DarkModeToggle';
import EditExpenseModal from './components/EditExpenseModal';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import type { Expense } from './types/Expense';
import { exportExpensesToCsv } from './utils/csv';
import { loadExpenses, saveExpenses } from './utils/storage';

const sortByDateDesc = (items: Expense[]) =>
  [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

const THEME_KEY = 'zhangben.theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    return stored === 'dark';
  }
  const mediaQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
  return mediaQuery?.matches ?? false;
};

const App = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    sortByDateDesc(loadExpenses())
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => {
      const updated = sortByDateDesc([...prev, expense]);
      saveExpenses(updated);
      return updated;
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => {
      const updated = prev.filter((expense) => expense.id !== id);
      saveExpenses(updated);
      return updated;
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditing(true);
  };

  const handleSaveEditedExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => {
      const updated = sortByDateDesc(
        prev.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
      saveExpenses(updated);
      return updated;
    });
    setIsEditing(false);
    setCurrentExpense(null);
  };

  const handleExportCsv = () => {
    exportExpensesToCsv(expenses);
  };

  const memoizedExpenses = useMemo(() => expenses, [expenses]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 transition-colors dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="text-center space-y-3">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-left sm:text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">
                简洁账本
              </p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                个人日常记账
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                记录、查看并洞察每一笔开支
              </p>
            </div>
            <DarkModeToggle
              enabled={isDarkMode}
              onToggle={() => setIsDarkMode((prev) => !prev)}
            />
          </div>
        </header>

        <AddExpense onAdd={handleAddExpense} />
        <Summary expenses={memoizedExpenses} />
        <ExpenseList
          expenses={memoizedExpenses}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
          onExport={handleExportCsv}
        />
      </div>

      <EditExpenseModal
        open={isEditing}
        expense={currentExpense}
        onClose={() => {
          setIsEditing(false);
          setCurrentExpense(null);
        }}
        onSave={handleSaveEditedExpense}
      />
    </main>
  );
};

export default App;

