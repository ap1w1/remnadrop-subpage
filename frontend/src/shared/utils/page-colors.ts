export interface PageColors {
    background: string
    surface: string
    accent: string
    text: string
}

export const defaultPageColors: PageColors = {
    background: '#0D1117',
    surface: '#161B22',
    accent: '#22C7D9',
    text: '#E6EDF3'
}

export function parsePageColors(value: unknown): PageColors {
    if (!value || typeof value !== 'object') return defaultPageColors
    const input = value as Record<string, unknown>
    const result = { ...defaultPageColors }
    for (const key of Object.keys(result) as (keyof PageColors)[]) {
        const candidate = input[key]
        if (typeof candidate === 'string' && /^#[0-9a-fA-F]{6}$/.test(candidate)) {
            result[key] = candidate
        }
    }
    return result
}
