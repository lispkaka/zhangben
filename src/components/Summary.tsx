import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';
import type { Expense } from '../types/Expense';

interface SummaryProps {
  expenses: Expense[];
}

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#22c55e', '#f43f5e'];

const currentMonthMeta = () => {
  const now = new Date();
  return {
    key: `${now.getFullYear()}-${now.getMonth()}`,
    year: now.getFullYear(),
    month: now.getMonth()
  };
};

const Summary = ({ expenses }: SummaryProps) => {
  const { key: monthKey, year, month } = currentMonthMeta();

  const monthlyExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    return `${date.getFullYear()}-${date.getMonth()}` === monthKey;
  });

  const monthlyTotal = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = monthlyExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {}
  );

  const tooltipStyle = {
    borderRadius: '0.75rem',
    border: 'none',
    backgroundColor: 'var(--tooltip-bg)',
    color: 'var(--tooltip-color)'
  };

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .filter((entry) => entry.value > 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyTotals: Record<string, number> = {};
  monthlyExpenses.forEach((expense) => {
    const date = new Date(expense.date);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    dailyTotals[label] = (dailyTotals[label] || 0) + expense.amount;
  });

  const lineData = Array.from({ length: daysInMonth }, (_, index) => {
    const label = `${month + 1}/${index + 1}`;
    return {
      label,
      value: Number((dailyTotals[label] || 0).toFixed(2))
    };
  });

  const hasLineData = lineData.some((item) => item.value > 0);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-400 dark:text-slate-300">本月合计</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          ¥{monthlyTotal.toFixed(2)}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          {Object.entries(categoryTotals).length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">
              暂无分类统计
            </p>
          )}
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div
              key={category}
              className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-200"
            >
              <span>{category}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ¥{total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-48">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-300">
              暂无图表数据
            </div>
          )}
        </div>
      </div>

      <div className="h-60">
        {hasLineData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(value) => `¥${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`¥${value.toFixed(2)}`, '金额']}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-300">
            暂无趋势数据
          </div>
        )}
      </div>
    </section>
  );
};

export default Summary;

