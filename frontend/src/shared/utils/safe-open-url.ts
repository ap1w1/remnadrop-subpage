const APP_SCHEMES = new Set([
    'clash:', 'clashmeta:', 'exclave:', 'flclashx:', 'happ:', 'hiddify:',
    'koala-clash:', 'obtainium:', 'prizrak-box:', 'stash:', 'streisand:',
    'sub:', 'v2rayng:', 'v2raytun:'
])

export function getSafeOpenUrl(value: string, allowAppScheme = false): null | string {
    if (!value || [...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || value.trim() !== value) return null

    try {
        const url = new URL(value)
        if (url.protocol === 'https:' || url.protocol === 'http:') {
            return url.hostname ? url.href : null
        }
        return allowAppScheme && APP_SCHEMES.has(url.protocol) ? value : null
    } catch {
        return null
    }
}
