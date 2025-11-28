import { useState } from 'react';
import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { ToastContainer } from '../components/Toast';
import { checkAvailability, calculateValue, calculateSEOScore } from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { useToast } from '../hooks/useToast';
import { Zap, Sparkles } from 'lucide-react';

export function CreativeMixer() {
    const [prefix, setPrefix] = useState('');
    const [keyword, setKeyword] = useState('');
    const [suffix, setSuffix] = useState('');
    const [results, setResults] = useState<DomainData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { saveDomain, isSaved } = useDomainStorage();
    const { toasts, addToast, removeToast } = useToast();

    const suggestedPrefixes = ['Get', 'My', 'The', 'Go', 'Try', 'Find', 'Use'];
    const suggestedSuffixes = ['Hub', 'Lab', 'HQ', 'Pro', 'App', 'Tech', 'AI'];

    const handleMix = async () => {
        if (!keyword) {
            addToast('Please enter a keyword', 'error');
            return;
        }

        setIsLoading(true);
        const combinations: string[] = [];

        // Generate combinations
        if (prefix && keyword) combinations.push(`${prefix}${keyword}.com`);
        if (keyword && suffix) combinations.push(`${keyword}${suffix}.com`);
        if (prefix && keyword && suffix) combinations.push(`${prefix}${keyword}${suffix}.com`);
        if (prefix && keyword) combinations.push(`${keyword}${prefix}.com`);
        if (keyword) combinations.push(`${keyword}.com`, `${keyword}.io`, `${keyword}.ai`);

        const data: DomainData[] = combinations.map(name => ({
            name,
            status: 'unknown',
            ...calculateValue(name),
            seoScore: calculateSEOScore(name),
            length: name.length,
            tld: name.split('.').pop() || ''
        }));

        setResults(data);

        // Check availability
        const checked = await Promise.all(data.map(async d => ({
            ...d,
            status: await checkAvailability(d.name)
        })));

        setResults(checked);
        setIsLoading(false);
        addToast(`Generated ${checked.length} domain combinations!`, 'success');
    };

    return (
        <Layout>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Zap className="text-primary-600 dark:text-primary-400" size={36} />
                        <h1 className="text-4xl font-display font-bold">
                            <span className="gradient-text">Creative</span>{' '}
                            <span className="text-slate-900 dark:text-white">Mixer</span>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Combine words creatively to discover unique domain gems.
                    </p>
                </div>

                {/* Mixer Card */}
                <div className="glass-strong p-8 rounded-2xl shadow-glow-sm mb-10">
                    {/* Word Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prefix (Optional)</label>
                            <input
                                type="text"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                placeholder="Get, My, The..."
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none text-slate-900 dark:text-white"
                            />
                            <div className="flex flex-wrap gap-1 mt-2">
                                {suggestedPrefixes.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPrefix(p)}
                                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-all"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Keyword *</label>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Flow, Agent..."
                                className="w-full p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 focus:border-primary-500 outline-none font-bold text-primary-900 dark:text-primary-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Suffix (Optional)</label>
                            <input
                                type="text"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                placeholder="Hub, Lab, HQ..."
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none text-slate-900 dark:text-white"
                            />
                            <div className="flex flex-wrap gap-1 mt-2">
                                {suggestedSuffixes.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSuffix(s)}
                                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleMix}
                        disabled={!keyword || isLoading}
                        className="w-full btn-primary p-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={20} />
                        {isLoading ? 'Mixing...' : 'Generate Combinations'}
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {results.map((domain) => (
                        <DomainCard
                            key={domain.name}
                            data={domain}
                            isSaved={isSaved(domain.name)}
                            onToggleSave={() => saveDomain(domain)}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
