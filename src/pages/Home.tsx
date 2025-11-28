import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Loader2, Sparkles, Download, FileJson } from 'lucide-react';
import { DomainCard } from '../components/DomainCard';
import { Layout } from '../components/Layout';
import { SkeletonCard } from '../components/SkeletonCard';
import { FilterPanel, type FilterOptions } from '../components/FilterPanel';
import { ToastContainer } from '../components/Toast';
import {
    generateVariations,
    checkAvailability,
    calculateValue,
    calculateSEOScore,
    BRADY_PRESETS,
    exportToCSV,
    exportToJSON
} from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { useToast } from '../hooks/useToast';

export function Home() {
    const [input, setInput] = useState('');
    const [marketMode, setMarketMode] = useState<'global' | 'usa' | 'europe' | 'arab'>('global');
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [results, setResults] = useState<DomainData[]>([]);
    const [filteredResults, setFilteredResults] = useState<DomainData[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const { saveDomain, isSaved } = useDomainStorage();
    const { toasts, addToast, removeToast } = useToast();
    const queueRef = useRef<string[]>([]);
    const processingRef = useRef(false);

    // Filter state
    const [filters, setFilters] = useState<FilterOptions>({
        tlds: ['com', 'io', 'ai', 'co', 'net', 'org', 'app'],
        priceRange: [0, 1000000],
        radioScores: ['A', 'B', 'C'],
        availability: ['available', 'taken', 'unknown', 'scanning'],
        minSeoScore: 0,
    });

    // Apply filters
    useEffect(() => {
        let filtered = results.filter(domain => {
            if (!filters.tlds.includes(domain.tld)) return false;
            if (!filters.radioScores.includes(domain.radioScore)) return false;
            if (!filters.availability.includes(domain.status)) return false;
            if (domain.seoScore && domain.seoScore < filters.minSeoScore) return false;
            return true;
        });
        setFilteredResults(filtered);
    }, [results, filters]);

    const togglePreset = (preset: string) => {
        setSelectedPresets(prev =>
            prev.includes(preset) ? prev.filter(p => p !== preset) : [...prev, preset]
        );
    };

    const handleSearch = () => {
        if (!input) {
            addToast('Please enter a keyword', 'error');
            return;
        }

        const variations = generateVariations(input, marketMode, selectedPresets);
        const initialData: DomainData[] = variations.map(name => ({
            name,
            status: 'unknown',
            ...calculateValue(name),
            seoScore: calculateSEOScore(name),
            length: name.length,
            tld: name.split('.').pop() || ''
        }));

        if (showAvailableOnly) {
            // Queue mode: Clear results, add to queue
            setResults([]);
            queueRef.current = variations;
            setIsScanning(true);
            addToast(`Scanning ${variations.length} domains...`, 'info');
            processQueue();
        } else {
            // Instant mode: Show all
            setResults(initialData);
            addToast(`Generated ${initialData.length} domains!`, 'success');
        }
    };

    const processQueue = async () => {
        if (processingRef.current || queueRef.current.length === 0) {
            if (queueRef.current.length === 0) {
                setIsScanning(false);
                if (results.length > 0) {
                    addToast(`Scan complete! Found ${results.length} available domains`, 'success');
                } else {
                    addToast('No available domains found', 'info');
                }
            }
            return;
        }

        processingRef.current = true;
        const batch = queueRef.current.splice(0, 1)[0];

        try {
            const status = await checkAvailability(batch);
            if (status === 'available') {
                const data: DomainData = {
                    name: batch,
                    status: 'available',
                    ...calculateValue(batch),
                    seoScore: calculateSEOScore(batch),
                    length: batch.length,
                    tld: batch.split('.').pop() || ''
                };
                setResults(prev => [...prev, data]);
            }
        } catch (e) {
            console.error(e);
        }

        processingRef.current = false;

        if (queueRef.current.length > 0) {
            setTimeout(processQueue, 1000);
        } else {
            setIsScanning(false);
        }
    };

    useEffect(() => {
        return () => {
            queueRef.current = [];
        };
    }, []);

    const handleExportCSV = () => {
        if (filteredResults.length === 0) {
            addToast('No results to export', 'error');
            return;
        }
        exportToCSV(filteredResults);
        addToast('Exported to CSV!', 'success');
    };

    const handleExportJSON = () => {
        if (filteredResults.length === 0) {
            addToast('No results to export', 'error');
            return;
        }
        exportToJSON(filteredResults);
        addToast('Exported to JSON!', 'success');
    };

    return (
        <Layout>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="max-w-4xl mx-auto mb-12">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-4 tracking-tight">
                        <span className="gradient-text">Find Your Next</span>
                        <br />
                        <span className="text-slate-900 dark:text-white">Killer Domain</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        The ultimate tool for domain hunters. Generate, analyze, and secure premium assets with AI-powered insights.
                    </p>
                </div>

                {/* Search Box */}
                <div className="glass-strong p-3 rounded-2xl shadow-glow-sm mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Enter a keyword (e.g. 'flow', 'agent')..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Market Mode */}
                            <div className="relative group">
                                <button className="p-4 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 font-medium">
                                    <Globe size={20} />
                                    <span className="capitalize hidden sm:inline text-slate-700 dark:text-slate-300">{marketMode}</span>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-xl p-2 hidden group-hover:block z-10 shadow-xl">
                                    {(['global', 'usa', 'europe', 'arab'] as const).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setMarketMode(mode)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${marketMode === mode
                                                ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {mode === 'global' ? '🌎 Global' : mode === 'usa' ? '🇺🇸 USA' : mode === 'europe' ? '🇪🇺 Europe' : '🇲🇦 Arab/Gulf'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={isScanning}
                                className="btn-primary px-8 py-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Sparkles size={20} />
                                Generate
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Presets */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {BRADY_PRESETS.map(preset => (
                            <button
                                key={preset}
                                onClick={() => togglePreset(preset)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${selectedPresets.includes(preset)
                                    ? 'bg-primary-500 text-white border-primary-500 shadow-glow-sm'
                                    : 'glass border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>

                    {/* Scanner Toggle */}
                    <div className="flex items-center gap-3 glass px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Available Only</span>
                        <button
                            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${showAvailableOnly ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showAvailableOnly ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            {results.length > 0 && (
                <div className="flex items-center justify-between mb-6 glass-strong p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {filteredResults.length} results
                            {filteredResults.length !== results.length && ` (${results.length} total)`}
                        </span>
                        <FilterPanel filters={filters} onChange={setFilters} />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                        >
                            <Download size={16} />
                            CSV
                        </button>
                        <button
                            onClick={handleExportJSON}
                            className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                        >
                            <FileJson size={16} />
                            JSON
                        </button>
                    </div>
                </div>
            )}

            {/* Results Area */}
            <div className="space-y-4">
                {isScanning && (
                    <>
                        <div className="flex items-center justify-center gap-3 py-8 text-primary-600 dark:text-primary-400">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="font-semibold">
                                Scanning availability... Found: {results.length}
                            </span>
                        </div>
                        {[...Array(3)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </>
                )}

                {filteredResults.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredResults.map((domain) => (
                            <DomainCard
                                key={domain.name}
                                data={domain}
                                isSaved={isSaved(domain.name)}
                                onToggleSave={() => saveDomain(domain)}
                            />
                        ))}
                    </div>
                ) : (
                    !isScanning && input && (
                        <div className="text-center py-20 glass-strong rounded-2xl">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No domains found</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Try a different keyword, market mode, or adjust your filters.
                            </p>
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
}
