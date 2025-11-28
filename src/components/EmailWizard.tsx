import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface EmailWizardProps {
    domain: string;
    onClose: () => void;
}

const TEMPLATES = {
    direct: (domain: string) => ({
        subject: `Domain Inquiry: ${domain}`,
        body: `Hi there,\n\nI'm interested in acquiring ${domain}. Is it currently for sale?\n\nBest,\n[Your Name]`
    }),
    upgrade: (domain: string) => ({
        subject: `Upgrade for your brand: ${domain}`,
        body: `Hello,\n\nI noticed you're operating in a related niche. ${domain} would be a powerful asset for your brand authority.\n\nOpen to discussing?\n\nBest,\n[Your Name]`
    }),
    acquisition: (domain: string) => ({
        subject: `Acquisition Proposal: ${domain}`,
        body: `Hi,\n\nWe are looking to acquire premium assets in this vertical. ${domain} fits our criteria.\n\nPlease let me know if you are the decision maker.\n\nRegards,\n[Your Name]`
    })
};

export function EmailWizard({ domain, onClose }: EmailWizardProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="bg-blue-700 p-4 flex justify-between items-center text-white">
                    <h2 className="font-bold text-lg">Cold Email Wizard: {domain}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="p-6 grid gap-6">
                    {Object.entries(TEMPLATES).map(([key, getTemplate]) => {
                        const template = getTemplate(domain);
                        return (
                            <div key={key} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold capitalize text-gray-800">{key} Approach</h3>
                                    <button
                                        onClick={() => copyToClipboard(`${template.subject}\n\n${template.body}`, key)}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {copied === key ? <Check size={16} /> : <Copy size={16} />}
                                        {copied === key ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-3 rounded text-sm text-gray-600 whitespace-pre-wrap font-mono">
                                    <div className="font-bold mb-2">Subject: {template.subject}</div>
                                    {template.body}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
