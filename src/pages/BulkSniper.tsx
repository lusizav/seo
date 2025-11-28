import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { checkAvailability, calculateValue } from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { Loader2, Play } from 'lucide-react';

export function BulkSniper() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<DomainData[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const { saveDomain, isSaved } = useDomainStorage();
    const queueRef = useRef<string[]>([]);

    const handleStart = () => {
        const domains = input.split(/[\n,]+/).map(d => d.trim()).filter(d => d.length > 0);
        if (domains.length === 0) return;

        setResults([]);
        queueRef.current = domains;
        setIsProcessing(true);
        setProgress(0);
        processQueue(domains.length);
    };

    const processQueue = async (total: number) => {
        if (queueRef.current.length === 0) {
            setIsProcessing(false);
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
                length: domain.length,
                tld: domain.split('.').pop() || ''
            };
            setResults(prev => [...prev, data]);
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
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Bulk Domain Sniper</h1>
                    <p className="text-slate-600">Paste a list of domains (one per line) to instantly value and check availability.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="example.com&#10;test.io&#10;startup.ai"
                        className="w-full h-48 p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm mb-4"
                    />

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            {input.split('\n').filter(l => l.trim()).length} domains detected
                        </div>
                        <button
                            onClick={handleStart}
                            disabled={isProcessing || !input}
                            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                            {isProcessing ? 'Processing...' : 'Start Sniper'}
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>

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
