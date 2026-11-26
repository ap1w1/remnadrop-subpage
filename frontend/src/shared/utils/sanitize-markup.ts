import DOMPurify from 'dompurify'

export function sanitizeRichText(value: string): string {
    return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['a', 'b', 'br', 'code', 'em', 'i', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul'],
        ALLOWED_ATTR: ['href', 'title'],
        ALLOW_DATA_ATTR: false
    })
}

export function sanitizeSvg(value: string): string {
    return DOMPurify.sanitize(value, {
        USE_PROFILES: { svg: true },
        FORBID_TAGS: ['foreignObject', 'image', 'script', 'use'],
        FORBID_ATTR: ['href', 'xlink:href', 'style'],
        ALLOW_DATA_ATTR: false
    })
}
