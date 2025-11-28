import { useState, useEffect } from 'react';
import type { DomainData } from '../utils/domainUtils';

export function useDomainStorage() {
    const [savedDomains, setSavedDomains] = useState<DomainData[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('savedDomains');
        if (stored) {
            try {
                setSavedDomains(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse saved domains", e);
            }
        }
    }, []);

    const saveDomain = (domain: DomainData) => {
        setSavedDomains(prev => {
            const exists = prev.some(d => d.name === domain.name);
            if (exists) return prev.filter(d => d.name !== domain.name); // Toggle off
            const newSaved = [...prev, domain];
            localStorage.setItem('savedDomains', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    const isSaved = (name: string) => savedDomains.some(d => d.name === name);

    return { savedDomains, saveDomain, isSaved };
}
