import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    valuePrefix?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'green' | 'blue' | 'purple' | 'orange';
}

export function StatCard({ icon: Icon, label, value, valuePrefix = '', trend, color = 'green' }: StatCardProps) {
    const colors = {
        green: 'from-primary-500 to-emerald-500',
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        orange: 'from-orange-500 to-red-500',
    };

    const iconBg = {
        green: 'bg-gradient-to-br from-primary-500 to-emerald-500',
        blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
        orange: 'bg-gradient-to-br from-orange-500 to-red-500',
    };

    return (
        <div className="glass-strong rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${iconBg[color]} text-white shadow-lg`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
                        {valuePrefix}{value}
                    </p>
                    {trend && (
                        <span className={`text-xs ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
