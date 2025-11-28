import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Layers, Zap, Briefcase, Target, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Generator', icon: Search },
        { path: '/bulk', label: 'Bulk Sniper', icon: Layers },
        { path: '/mixer', label: 'Creative Mixer', icon: Zap },
        { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    ];

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-strong border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobileMenu}>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow-sm group-hover:shadow-glow-md transition-all group-hover:scale-110">
                            <Target className="animate-pulse" size={24} />
                        </div>
                        <span className="font-display font-bold text-2xl tracking-tight">
                            <span className="gradient-text">Dom</span>
                            <span className="text-slate-900 dark:text-white">Killer</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                            ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-glow-md scale-105'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side - Theme Toggle + Mobile Menu */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-lg glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass-strong border-t border-slate-200/50 dark:border-slate-700/50 animate-slideUp">
                        <nav className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${isActive
                                                ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-glow-md'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="glass-strong border-t border-slate-200/50 dark:border-slate-700/50 py-6 sm:py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Target className="text-white" size={16} />
                        </div>
                        <span className="font-display font-bold text-base sm:text-lg">
                            <span className="gradient-text">Dom</span>
                            <span className="text-slate-900 dark:text-white">Killer</span>
                        </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                        © {new Date().getFullYear()} DomKiller. Hunt Premium Domains Like a Pro.
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        AI-Powered Valuation Model (Beta) - Not financial advice.
                    </p>
                </div>
            </footer>
        </div>
    );
}
