import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ToastContainer } from '../components/Toast';
import { checkAvailability, calculateValue, calculateSEOScore, exportToCSV, exportToJSON } from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { useToast } from '../hooks/useToast';
import { Loader2, Play, Download, FileJson, Target } from 'lucide-react';

export function BulkSniper() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<DomainData[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ available: 0, taken: 0, total: 0 });

    const { saveDomain, isSaved } = useDomainStorage();
    const { toasts, addToast, removeToast } = useToast();
    const queueRef = useRef<string[]>([]);

    const handleStart = () => {
        const domains = input.split(/[\n,]+/).map(d => d.trim()).filter(d => d.length > 0);
        if (domains.length === 0) {
            addToast('Please enter at least one domain', 'error');
            return;
        }

        setResults([]);
        setStats({ available: 0, taken: 0, total: domains.length });
        queueRef.current = domains;
        setIsProcessing(true);
        setProgress(0);
        addToast(`Starting scan of ${domains.length} domains...`, 'info');
        processQueue(domains.length);
    };

    const processQueue = async (total: number) => {
        if (queueRef.current.length === 0) {
            setIsProcessing(false);
            addToast(`Scan complete! ${stats.available} available, ${stats.taken} taken`, 'success');
            return;
        }

        const domain = queueRef.current.shift();
        if (!domain) return;

        try {
            const status = await checkAvailability(domain);
            const data: DomainData = {
                name: domain,
                status,
                ...calculateValue(domain),
                seoScore: calculateSEOScore(domain),
                length: domain.length,
                tld: domain.split('.').pop() || ''
            };
            setResults(prev => [...prev, data]);

            setStats(prev => ({
                ...prev,
                available: prev.available + (status === 'available' ? 1 : 0),
                taken: prev.taken + (status === 'taken' ? 1 : 0)
            }));
        } catch (e) {
            console.error(e);
        }

        setProgress(((total - queueRef.current.length) / total) * 100);

        if (queueRef.current.length > 0) {
            setTimeout(() => processQueue(total), 1000);
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-xl flex items-center justify-center animate-pulse">
                            <Target className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-display font-bold">
                            <span className="gradient-text">Bulk</span>{' '}
                            <span className="text-slate-900 dark:text-white">Domain Sniper</span>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Paste a list of domains and instantly check availability & value.
                    </p>
                </div>

                {/* Input Card */}
                <div className="glass-strong p-6 rounded-2xl shadow-glow-sm mb-8">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="example.com&#10;test.io&#10;startup.ai&#10;domkiller.com"
                        disabled={isProcessing}
                        className="w-full h-56 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none font-mono text-sm mb-4 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50 transition-all"
                    />

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                                {input.split('\n').filter(l => l.trim()).length}
                            </span> domains detected
                        </div>
                        <button
                            onClick={handleStart}
                            disabled={isProcessing || !input.trim()}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                            {isProcessing ? 'Processing...' : 'Start Sniper'}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    {isProcessing && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Progress: {Math.round(progress)}%
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {stats.available} available · {stats.taken} taken
                                </span>
                            </div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-600 to-emerald-600 transition-all duration-500 shadow-glow-sm"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                {results.length > 0 && !isProcessing && (
                    <div className="flex items-center justify-between mb-6 glass-strong p-4 rounded-xl">
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {results.length} results
                            </span>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                                    ✓ {stats.available} Available
                                </span>
                                <span className="text-red-600 dark:text-red-400 font-semibold">
                                    ✗ {stats.taken} Taken
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    exportToCSV(results);
                                    addToast('Exported to CSV!', 'success');
                                }}
                                className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                            >
                                <Download size={16} />
                                CSV
                            </button>
                            <button
                                onClick={() => {
                                    exportToJSON(results);
                                    addToast('Exported to JSON!', 'success');
                                }}
                                className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                            >
                                <FileJson size={16} />
                                JSON
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="space-y-4">
                    {isProcessing && [...Array(2)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}

                    {results.map((domain) => (
                        <DomainCard
                            key={domain.name}
                            data={domain}
                            isSaved={isSaved(domain.name)}
                            onToggleSave={() => {
                                saveDomain(domain);
                                addToast(isSaved(domain.name) ? 'Removed from portfolio' : 'Added to portfolio!', 'success');
                            }}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
