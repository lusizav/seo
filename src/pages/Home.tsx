import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Loader2 } from 'lucide-react';
import { DomainCard } from '../components/DomainCard';
import { Layout } from '../components/Layout';
import {
    generateVariations,
    checkAvailability,
    calculateValue,
    BRADY_PRESETS
} from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';

export function Home() {
    const [input, setInput] = useState('');
    const [marketMode, setMarketMode] = useState<'global' | 'usa' | 'europe' | 'arab'>('global');
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [results, setResults] = useState<DomainData[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const { saveDomain, isSaved } = useDomainStorage();
    const queueRef = useRef<string[]>([]);
    const processingRef = useRef(false);

    const togglePreset = (preset: string) => {
        setSelectedPresets(prev =>
            prev.includes(preset) ? prev.filter(p => p !== preset) : [...prev, preset]
        );
    };

    const handleSearch = () => {
        if (!input) return;

        const variations = generateVariations(input, marketMode, selectedPresets);
        const initialData: DomainData[] = variations.map(name => ({
            name,
            status: 'unknown',
            ...calculateValue(name),
            length: name.length,
            tld: name.split('.').pop() || ''
        }));

        if (showAvailableOnly) {
            // Queue mode: Clear results, add to queue
            setResults([]);
            queueRef.current = variations;
            setIsScanning(true);
            processQueue();
        } else {
            // Instant mode: Show all, check availability in background
            setResults(initialData);
            // Optional: Trigger background checks if needed, but for now just show them
        }
    };

    const processQueue = async () => {
        if (processingRef.current || queueRef.current.length === 0) {
            if (queueRef.current.length === 0) setIsScanning(false);
            return;
        }

        processingRef.current = true;
        const batch = queueRef.current.splice(0, 1)[0]; // Process 1 at a time

        try {
            const status = await checkAvailability(batch);
            if (status === 'available') {
                const data: DomainData = {
                    name: batch,
                    status: 'available',
                    ...calculateValue(batch),
                    length: batch.length,
                    tld: batch.split('.').pop() || ''
                };
                setResults(prev => [...prev, data]);
            }
        } catch (e) {
            console.error(e);
        }

        processingRef.current = false;

        // Schedule next check
        if (queueRef.current.length > 0) {
            setTimeout(processQueue, 1000); // 1 second delay
        } else {
            setIsScanning(false);
        }
    };

    // Stop scanning if component unmounts or toggle changes
    useEffect(() => {
        return () => {
            queueRef.current = [];
        };
    }, []);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Find Your Next <span className="text-blue-700">Unicorn Domain</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    The ultimate tool for domain flippers. Generate, analyze, and secure premium assets.
                </p>

                <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter a keyword (e.g. 'flow', 'agent')..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-2">
                        <div className="relative group">
                            <button className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 font-medium">
                                <Globe size={20} />
                                <span className="capitalize hidden sm:inline">{marketMode}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-10">
                                {(['global', 'usa', 'europe', 'arab'] as const).map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setMarketMode(mode)}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${marketMode === mode ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        {mode === 'global' ? '🌎 Global' : mode === 'usa' ? '🇺🇸 USA' : mode === 'europe' ? '🇪🇺 Europe' : '🇲🇦 Arab/Gulf'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Controls Row */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {BRADY_PRESETS.map(preset => (
                            <button
                                key={preset}
                                onClick={() => togglePreset(preset)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedPresets.includes(preset)
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-sm font-medium text-slate-600">Show Available Only</span>
                        <button
                            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${showAvailableOnly ? 'bg-green-500' : 'bg-slate-300'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showAvailableOnly ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="space-y-4">
                {isScanning && (
                    <div className="flex items-center justify-center gap-3 py-8 text-blue-600 animate-pulse">
                        <Loader2 className="animate-spin" />
                        <span className="font-medium">Scanning availability (1/sec to avoid rate limits)... Found: {results.length}</span>
                    </div>
                )}

                {results.length > 0 ? (
                    <div className="grid gap-4">
                        {results.map((domain) => (
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
                        <div className="text-center py-12 text-slate-400">
                            <p>No domains found. Try a different keyword or check "Show Available Only".</p>
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
}
