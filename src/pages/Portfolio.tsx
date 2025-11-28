import { Layout } from '../components/Layout';
import { DomainCard } from '../components/DomainCard';
import { StatCard } from '../components/StatCard';
import { ToastContainer } from '../components/Toast';
import { useDomainStorage } from '../hooks/useDomainStorage';
import { useToast } from '../hooks/useToast';
import { exportToCSV, exportToJSON } from '../utils/domainUtils';
import { Download, FileJson, Briefcase, DollarSign, TrendingUp, Target } from 'lucide-react';

export function Portfolio() {
    const { savedDomains, saveDomain } = useDomainStorage();
    const { toasts, addToast, removeToast } = useToast();

    const totalValue = savedDomains.reduce((sum, d) => sum + (d.price || 0), 0);
    const avgValue = savedDomains.length > 0 ? Math.round(totalValue / savedDomains.length) : 0;
    const availableCount = savedDomains.filter(d => d.status === 'available').length;

    const handleExportCSV = () => {
        if (savedDomains.length === 0) {
            addToast('No domains to export', 'error');
            return;
        }
        exportToCSV(savedDomains);
        addToast('Portfolio exported to CSV!', 'success');
    };

    const handleExportJSON = () => {
        if (savedDomains.length === 0) {
            addToast('No domains to export', 'error');
            return;
        }
        exportToJSON(savedDomains);
        addToast('Portfolio exported to JSON!', 'success');
    };

    return (
        <Layout>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Briefcase className="text-primary-600 dark:text-primary-400" size={36} />
                        <h1 className="text-4xl font-display font-bold">
                            <span className="gradient-text">My</span>{' '}
                            <span className="text-slate-900 dark:text-white">Portfolio</span>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Manage your saved domains and track their value.
                    </p>
                </div>

                {savedDomains.length > 0 ? (
                    <>
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={Target}
                                label="Total Domains"
                                value={savedDomains.length}
                                color="green"
                            />
                            <StatCard
                                icon={DollarSign}
                                label="Total Value"
                                value={totalValue.toLocaleString()}
                                valuePrefix="$"
                                color="blue"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Average Value"
                                value={avgValue.toLocaleString()}
                                valuePrefix="$"
                                color="purple"
                            />
                            <StatCard
                                icon={Briefcase}
                                label="Available"
                                value={availableCount}
                                color="orange"
                            />
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 glass-strong p-4 rounded-xl">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {savedDomains.length} domains in portfolio
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                                >
                                    <Download size={16} />
                                    Export CSV
                                </button>
                                <button
                                    onClick={handleExportJSON}
                                    className="flex items-center gap-2 px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
                                >
                                    <FileJson size={16} />
                                    Export JSON
                                </button>
                            </div>
                        </div>

                        {/* Domains List */}
                        <div className="space-y-4">
                            {savedDomains.map((domain) => (
                                <DomainCard
                                    key={domain.name}
                                    data={domain}
                                    isSaved={true}
                                    onToggleSave={() => {
                                        saveDomain(domain);
                                        addToast('Removed from portfolio', 'success');
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 glass-strong rounded-2xl">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb6 animate-float">
                            <Briefcase className="text-slate-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No saved domains yet</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Start building your portfolio by saving domains from the generator!
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 btn-primary"
                        >
                            <Target size={20} />
                            Go to Generator
                        </a>
                    </div>
                )}
            </div>
        </Layout>
    );
}
