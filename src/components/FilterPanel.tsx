import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterOptions {
    tlds: string[];
    priceRange: [number, number];
    radioScores: ('A' | 'B' | 'C')[];
    availability: ('available' | 'taken' | 'unknown' | 'scanning')[];
    minSeoScore: number;
}

interface FilterPanelProps {
    filters: FilterOptions;
    onChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    const allTlds = ['com', 'io', 'ai', 'co', 'net', 'org', 'app'];
    const allScores: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    const allStatuses: ('available' | 'taken' | 'unknown' | 'scanning')[] = ['available', 'taken', 'unknown'];

    const toggleTld = (tld: string) => {
        const newTlds = filters.tlds.includes(tld)
            ? filters.tlds.filter(t => t !== tld)
            : [...filters.tlds, tld];
        onChange({ ...filters, tlds: newTlds });
    };

    const toggleScore = (score: 'A' | 'B' | 'C') => {
        const newScores = filters.radioScores.includes(score)
            ? filters.radioScores.filter(s => s !== score)
            : [...filters.radioScores, score];
        onChange({ ...filters, radioScores: newScores });
    };

    const toggleStatus = (status: 'available' | 'taken' | 'unknown' | 'scanning') => {
        const newStatuses = filters.availability.includes(status)
            ? filters.availability.filter(s => s !== status)
            : [...filters.availability, status];
        onChange({ ...filters, availability: newStatuses });
    };

    const resetFilters = () => {
        onChange({
            tlds: allTlds,
            priceRange: [0, 1000000],
            radioScores: allScores,
            availability: allStatuses,
            minSeoScore: 0,
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
                {(filters.tlds.length < allTlds.length || filters.radioScores.length < 3) && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-96 glass-strong rounded-xl p-6 shadow-xl z-10 animate-slideUp">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Filter Results</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X size={20} />
                        </button>
                    </div>

                    {/* TLD Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Top-Level Domains
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {allTlds.map(tld => (
                                <button
                                    key={tld}
                                    onClick={() => toggleTld(tld)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.tlds.includes(tld)
                                        ? 'bg-primary-500 text-white shadow-glow-sm'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    .{tld}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Radio Score */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Radio Test Score
                        </label>
                        <div className="flex gap-2">
                            {allScores.map(score => (
                                <button
                                    key={score}
                                    onClick={() => toggleScore(score)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-all ${filters.radioScores.includes(score)
                                        ? score === 'A' ? 'bg-green-500 text-white' : score === 'B' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Availability
                        </label>
                        <div className="flex gap-2">
                            {allStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filters.availability.includes(status)
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SEO Score */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Minimum SEO Score: {filters.minSeoScore}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={filters.minSeoScore}
                            onChange={(e) => onChange({ ...filters, minSeoScore: parseInt(e.target.value) })}
                            className="w-full accent-primary-500"
                        />
                    </div>

                    <button
                        onClick={resetFilters}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}
