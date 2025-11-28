import { useState } from 'react';
import { ShoppingCart, Search, Mail, Share2, History, TrendingUp, ShieldCheck, Heart, Star } from 'lucide-react';
import type { DomainData } from '../utils/domainUtils';
import { EmailWizard } from './EmailWizard';

interface DomainCardProps {
    data: DomainData;
    isSaved: boolean;
    onToggleSave: () => void;
}

export function DomainCard({ data, isSaved, onToggleSave }: DomainCardProps) {
    const [showEmailWizard, setShowEmailWizard] = useState(false);

    const handleBuy = () => {
        window.open(`https://www.namecheap.com/domains/registration/results/?domain=${data.name}`, '_blank');
    };

    const handleFindBuyers = () => {
        const query = `site:linkedin.com/in/ OR site:facebook.com "CEO" OR "Founder" "${data.name.split('.')[0]}"`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    const handleFBPost = () => {
        const post = `🔥 Premium Domain for Sale: ${data.name} 🔥\n\n💎 Est. Value: $${(data.price || 0).toLocaleString()}\n🚀 Perfect for: Tech, AI, Startups\n\nDM for price! #domainflipping #business`;
        navigator.clipboard.writeText(post);
        alert('Facebook post copied to clipboard!');
    };

    return (
        <>
            <div className="glass-strong rounded-xl hover:shadow-glow-md transition-all duration-300 p-4 sm:p-5 flex flex-col gap-4 group hover:scale-[1.02] animate-fadeIn">

                {/* Domain Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-all">{data.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${data.status === 'available' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' :
                                data.status === 'taken' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                            {data.status === 'available' ? '✓ Available' : data.status === 'taken' ? '✗ Taken' : '? Unknown'}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                            <span className="font-bold gradient-text text-base sm:text-lg">${(data.price || 0).toLocaleString()}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-xs">Value</span>
                        </span>
                        <span className="flex items-center gap-1" title="Radio Test Score">
                            📻 <span className={`font-bold ${data.radioScore === 'A' ? 'text-primary-600 dark:text-primary-400' :
                                    data.radioScore === 'B' ? 'text-yellow-600 dark:text-yellow-400' :
                                        'text-red-600 dark:text-red-400'
                                }`}>{data.radioScore}</span>
                        </span>
                        {data.seoScore !== undefined && (
                            <span className="flex items-center gap-1" title="SEO Score">
                                <Star className="text-primary-500" size={14} fill="currentColor" />
                                <span className="font-bold text-primary-600 dark:text-primary-400">{data.seoScore}/100</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons - Mobile friendly */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Actions */}
                    <button
                        onClick={handleBuy}
                        className="min-w-10 min-h-10 p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all active:scale-95"
                        title="Buy Domain"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={handleFindBuyers}
                        className="min-w-10 min-h-10 p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all active:scale-95"
                        title="Find Buyers"
                    >
                        <Search size={20} />
                    </button>
                    <button
                        onClick={() => setShowEmailWizard(true)}
                        className="min-w-10 min-h-10 p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all active:scale-95"
                        title="Email Templates"
                    >
                        <Mail size={20} />
                    </button>
                    <button
                        onClick={handleFBPost}
                        className="min-w-10 min-h-10 p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all active:scale-95"
                        title="Copy FB Post"
                    >
                        <Share2 size={20} />
                    </button>

                    {/* Divider - hidden on small screens */}
                    <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    {/* Secondary Actions */}
                    <a
                        href={`https://web.archive.org/web/*/${data.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-10 min-h-10 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        title="Wayback Machine"
                    >
                        <History size={16} />
                    </a>
                    <a
                        href={`https://trends.google.com/trends/explore?q=${data.name.split('.')[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-10 min-h-10 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        title="Google Trends"
                    >
                        <TrendingUp size={16} />
                    </a>
                    <a
                        href={`https://tmsearch.uspto.gov/search/search-results?search=${data.name.split('.')[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-10 min-h-10 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        title="Trademark Check"
                    >
                        <ShieldCheck size={16} />
                    </a>

                    {/* Save Button - Prominent */}
                    <button
                        onClick={onToggleSave}
                        className={`min-w-10 min-h-10 p-2 rounded-lg transition-all ml-auto sm:ml-2 active:scale-95 ${isSaved
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                        title="Save to Portfolio"
                    >
                        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {showEmailWizard && <EmailWizard domain={data.name} onClose={() => setShowEmailWizard(false)} />}
        </>
    );
}
