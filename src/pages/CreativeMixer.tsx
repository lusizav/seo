import { useState } from 'react';
import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { checkAvailability, calculateValue } from '../utils/domainUtils';
import type { DomainData } from '../utils/domainUtils';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { Zap } from 'lucide-react';

export function CreativeMixer() {
    const [prefix, setPrefix] = useState('');
    const [keyword, setKeyword] = useState('');
    const [suffix, setSuffix] = useState('');
    const [results, setResults] = useState<DomainData[]>([]);

    const { saveDomain, isSaved } = useDomainStorage();

    const handleMix = async () => {
        const combinations = [];
        if (prefix && keyword) combinations.push(`${prefix}${keyword}.com`);
        if (keyword && suffix) combinations.push(`${keyword}${suffix}.com`);
        if (prefix && keyword && suffix) combinations.push(`${prefix}${keyword}${suffix}.com`);

        // Also try swapping
        if (prefix && keyword) combinations.push(`${keyword}${prefix}.com`);

        const data: DomainData[] = combinations.map(name => ({
            name,
            status: 'unknown',
            ...calculateValue(name),
            length: name.length,
            tld: 'com'
        }));

        setResults(data);

        // Check availability for all (small batch, so okay to do parallel or sequential)
        // For better UX, let's just check them all
        const checked = await Promise.all(data.map(async d => ({
            ...d,
            status: await checkAvailability(d.name)
        })));

        setResults(checked);
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Creative Mixer</h1>
                    <p className="text-slate-600">Combine words to discover hidden gems.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prefix</label>
                            <input
                                type="text"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                placeholder="e.g. Get, Go, My"
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Keyword</label>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g. Flow, Agent"
                                className="w-full p-3 rounded-lg bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Suffix</label>
                            <input
                                type="text"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                placeholder="e.g. Hub, Lab, HQ"
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleMix}
                        disabled={!keyword}
                        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white p-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Zap size={20} />
                        Generate Combinations
                    </button>
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
