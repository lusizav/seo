export interface DomainData {
    name: string;
    status: 'available' | 'taken' | 'unknown' | 'scanning';
    price: number;
    radioScore: 'A' | 'B' | 'C';
    length: number;
    tld: string;
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
