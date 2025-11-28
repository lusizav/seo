import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? (
                <Sun className="text-yellow-500 group-hover:rotate-180 transition-transform duration-500" size={20} />
            ) : (
                <Moon className="text-slate-600 group-hover:rotate-12 transition-transform duration-300" size={20} />
            )}
        </button>
    );
}
