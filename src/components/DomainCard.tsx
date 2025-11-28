import { useState } from 'react';
import { ShoppingCart, Search, Mail, Share2, History, TrendingUp, ShieldCheck, Heart } from 'lucide-react';
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group">

                {/* Left: Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900 truncate">{data.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${data.status === 'available' ? 'bg-green-100 text-green-700' :
                            data.status === 'taken' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {data.status === 'available' ? 'Available' : data.status === 'taken' ? 'Taken' : 'Unknown'}
                        </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <span className="font-semibold text-blue-600">${(data.price || 0).toLocaleString()}</span> Est. Value
                        </span>
                        <span className="flex items-center gap-1" title="Radio Test Score">
                            📻 Score: <span className={`font-bold ${data.radioScore === 'A' ? 'text-green-600' : data.radioScore === 'B' ? 'text-yellow-600' : 'text-red-600'}`}>{data.radioScore}</span>
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={handleBuy} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Buy Domain">
                        <ShoppingCart size={20} />
                    </button>
                    <button onClick={handleFindBuyers} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Find Buyers">
                        <Search size={20} />
                    </button>
                    <button onClick={() => setShowEmailWizard(true)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Email Templates">
                        <Mail size={20} />
                    </button>
                    <button onClick={handleFBPost} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Copy FB Post">
                        <Share2 size={20} />
                    </button>

                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                    <a href={`https://web.archive.org/web/*/${data.name}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Wayback Machine">
                        <History size={16} />
                    </a>
                    <a href={`https://trends.google.com/trends/explore?q=${data.name.split('.')[0]}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Google Trends">
                        <TrendingUp size={16} />
                    </a>
                    <a href={`https://tmsearch.uspto.gov/search/search-results?search=${data.name.split('.')[0]}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Trademark Check">
                        <ShieldCheck size={16} />
                    </a>

                    <button onClick={onToggleSave} className={`p-2 rounded-lg transition-colors ml-2 ${isSaved ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`} title="Save to Wishlist">
                        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {showEmailWizard && <EmailWizard domain={data.name} onClose={() => setShowEmailWizard(false)} />}
        </>
    );
}
