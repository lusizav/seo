import { Link, useLocation } from 'react-router-dom';
import { Search, Layers, Zap, Briefcase } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Generator', icon: Search },
        { path: '/bulk', label: 'Bulk Sniper', icon: Layers },
        { path: '/mixer', label: 'Creative Mixer', icon: Zap },
        { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">D</div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">Domain<span className="text-blue-700">Hunter</span></span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Ultimate Domain Hunter. All rights reserved.</p>
                    <p className="mt-2 text-xs text-slate-400">AI-Powered Valuation Model (Beta) - Not financial advice.</p>
                </div>
            </footer>
        </div>
    );
}
