import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { Download, Trash2 } from 'lucide-react';

export function Portfolio() {
    const { savedDomains, saveDomain } = useDomainStorage();

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Domain,Status,Est. Value,Radio Score\n"
            + savedDomains.map(d => `${d.name},${d.status},${d.price},${d.radioScore}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_domains.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
                        <p className="text-slate-600">Manage your saved domains and export for outreach.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={savedDomains.length === 0}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                {savedDomains.length > 0 ? (
                    <div className="space-y-4">
                        {savedDomains.map((domain) => (
                            <DomainCard
                                key={domain.name}
                                data={domain}
                                isSaved={true}
                                onToggleSave={() => saveDomain(domain)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No saved domains yet</h3>
                        <p className="text-slate-500">Star domains from the generator to add them here.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
