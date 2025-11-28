export interface DomainData {
    name: string;
    status: 'available' | 'taken' | 'unknown' | 'scanning';
    price: number;
    radioScore: 'A' | 'B' | 'C';
    length: number;
    tld: string;
    seoScore?: number; // 0-100
    trend?: 'up' | 'down' | 'stable';
}

export const GEO_PRESETS = {
    global: ['tech', 'app', 'net', 'io', 'ai', 'co', 'xyz'],
    usa: ['nyc', 'usa', 'austin', 'texas', 'vegas', 'miami'],
    europe: ['london', 'euro', 'berlin', 'uk', 'eu'],
    arab: ['dubai', 'saudi', 'qatar', 'casa', 'al', 'best', 'top'],
};

export const BRADY_PRESETS = ["Agent", "Flow", "Base", "Sync", "AI", "Hub", "Scale"];

export async function checkAvailability(domain: string): Promise<'available' | 'taken' | 'unknown'> {
    try {
        const response = await fetch(`https://rdap.org/domain/${domain}`);
        if (response.status === 404) return 'available';
        if (response.status === 200) return 'taken';
        return 'unknown';
    } catch (error) {
        console.error(`Error checking ${domain}:`, error);
        return 'unknown';
    }
}

export function calculateValue(domain: string): { price: number; radioScore: 'A' | 'B' | 'C' } {
    let price = 10;
    const lower = domain.toLowerCase();
    const tld = lower.split('.').pop() || '';
    const name = lower.split('.')[0];

    // Multipliers
    if (tld === 'com') price *= 15;
    if (tld === 'io') price *= 10;
    if (name.length === 4) price *= 500;

    // Keyword multipliers (simplified check)
    const keywords = ['app', 'tech', 'ai', 'shop', 'store', 'bet', 'win'];
    if (keywords.some(k => name.includes(k))) price *= 200;

    // Radio Test Score
    let radioScore: 'A' | 'B' | 'C' = 'A';
    if (/[0-9-]/.test(name)) {
        price *= 0.5; // Penalty
        radioScore = 'C';
    } else if (name.length > 12) {
        radioScore = 'B';
    }

    return { price: Math.round(price), radioScore };
}

export function generateVariations(
    base: string,
    mode: 'global' | 'usa' | 'europe' | 'arab',
    selectedPresets: string[]
): string[] {
    const variations: Set<string> = new Set();
    const cleanBase = base.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suffixes = GEO_PRESETS[mode];

    // 1. Basic TLDs
    ['.com', '.io', '.co', '.ai'].forEach(tld => {
        variations.add(`${cleanBase}${tld}`);
    });

    // 2. Geo Suffixes
    suffixes.forEach(suffix => {
        variations.add(`${cleanBase}${suffix}.com`);
        variations.add(`${cleanBase}-${suffix}.com`);
    });

    // 3. Brady Presets
    selectedPresets.forEach(preset => {
        const p = preset.toLowerCase();
        variations.add(`${cleanBase}${p}.com`);
        variations.add(`${p}${cleanBase}.com`);
    });

    return Array.from(variations);
}

// SEO Score Calculator (0-100)
export function calculateSEOScore(domain: string): number {
    let score = 50;
    const lower = domain.toLowerCase();
    const name = lower.split('.')[0];
    const tld = lower.split('.').pop() || '';

    // Length bonus
    if (name.length <= 8) score += 15;
    else if (name.length <= 12) score += 10;
    else score -= 5;

    // TLD bonus
    if (tld === 'com') score += 15;
    else if (['io', 'ai', 'co'].includes(tld)) score += 10;
    else if (['org', 'net'].includes(tld)) score += 5;

    // Keyword relevance
    const seoKeywords = ['app', 'tech', 'ai', 'web', 'digital', 'smart', 'cloud', 'hub', 'pro', 'best', 'top'];
    if (seoKeywords.some(k => name.includes(k))) score += 15;

    // No numbers/hyphens bonus
    if (!/[0-9-]/.test(name)) score += 10;

    return Math.min(100, Math.max(0, score));
}

// Get similar domain suggestions
export function getSimilarDomains(domain: string): string[] {
    const base = domain.split('.')[0];
    const tld = domain.split('.').pop() || 'com';

    const similar: string[] = [];
    const variations = ['get', 'my', 'the', 'app', 'hub', 'hq', 'pro', 'go'];

    variations.forEach(v => {
        similar.push(`${v}${base}.${tld}`);
        similar.push(`${base}${v}.${tld}`);
    });

    // Different TLDs
    ['io', 'ai', 'co', 'app'].forEach(altTld => {
        if (altTld !== tld) similar.push(`${base}.${altTld}`);
    });

    return similar.slice(0, 6);
}

// Export utilities
export function exportToCSV(domains: DomainData[]): void {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Domain,Status,Est. Value,Radio Score,SEO Score,Length,TLD\n"
        + domains.map(d =>
            `${d.name},${d.status},$${d.price},${d.radioScore},${d.seoScore || 'N/A'},${d.length},${d.tld}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `domkiller_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToJSON(domains: DomainData[]): void {
    const dataStr = JSON.stringify(domains, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `domkiller_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
