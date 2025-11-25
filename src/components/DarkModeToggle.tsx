interface DarkModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ enabled, onToggle }: DarkModeToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
    >
      <span
        aria-hidden
        className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
      >
        {enabled ? '🌙' : '☀️'}
      </span>
      {enabled ? '暗色模式' : '浅色模式'}
    </button>
  );
};

export default DarkModeToggle;

