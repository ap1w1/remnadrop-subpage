import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageLocalizedText,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import dayjs from 'dayjs'

const lineIcon = (paths: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

const baseIcons: Record<string, string> = {
    Gear: lineIcon(
        '<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.6 2.3 2 .8 2.1-1.2 2.8 2.8-1.2 2.1.8 2L23 11v4l-2.3.6-.8 2 1.2 2.1-2.8 2.8-2.1-1.2-2 .8L14 23h-4l-.6-2.3-2-.8-2.1 1.2-2.8-2.8 1.2-2.1-.8-2L1 14v-4l2.3-.6.8-2-1.2-2.1 2.8-2.8 2.1 1.2 2-.8z" transform="translate(0 -1) scale(.92) translate(1 1)"/>'
    ),
    Plus: lineIcon('<path d="M12 5v14M5 12h14"/>'),
    Check: lineIcon('<path d="m5 12 4.5 4.5L19 7"/>'),
    DownloadIcon: lineIcon('<path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/>'),
    CloudDownload: lineIcon(
        '<path d="M7 18H6a4 4 0 0 1-.7-7.9 6.5 6.5 0 0 1 12.4-1.5A4.5 4.5 0 0 1 19 18h-1M12 13v8m-3-3 3 3 3-3"/>'
    ),
    ExternalLink: lineIcon(
        '<path d="M13 5h6v6m0-6-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'
    ),
    AppleIcon: lineIcon(
        '<path d="M13.2 5.2c.3-1.8 1.4-2.7 3-3.2-.1 1.8-1 2.9-3 3.2ZM12 7.7c1.6 0 2.2-.8 3.8-.7 1.6.1 2.8.9 3.4 2.1-1.6.9-2 3.1-.1 4.3-.5 1.5-1.3 3-2.3 4.3-.7 1-1.4 2-2.6 2-1.1 0-1.5-.7-2.8-.7s-1.8.7-2.8.7c-1.2 0-2-1.1-2.7-2.1-1.8-2.6-3.1-6.2-1.3-9.2.9-1.5 2.4-2.4 4-2.4 1.2 0 2.2.7 3 .7Z"/>'
    ),
    Windows: lineIcon(
        '<path d="M3 5.5 10.5 4v7H3V5.5Zm9-1.8L21 2v9h-9V3.7ZM3 13h7.5v7L3 18.5V13Zm9 0h9v9l-9-1.7V13Z"/>'
    ),
    Android: lineIcon(
        '<path d="M7 9h10v9H7V9Zm2-4-2-2m8 2 2-2M7 8a5 5 0 0 1 10 0M4 10v6m16-6v6M9 18v3m6-3v3"/><path d="M10 7h.01M14 7h.01"/>'
    ),
    Ubuntu: lineIcon(
        '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="3" r="1"/><circle cx="4.5" cy="17" r="1"/><circle cx="19.5" cy="17" r="1"/>'
    ),
    macOS: lineIcon(
        '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M8 22h8M12 19v3M8 9h.01M16 9h.01M9 14c2 1.5 4 1.5 6 0"/>'
    ),
    TV: lineIcon('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 3l4 3 4-3M9 22h6"/>')
}

export function getIconFromLibrary(iconKey: string, svgLibrary: Record<string, string>) {
    return baseIcons[iconKey] ?? svgLibrary[iconKey]
}

export function getLocalizedText(
    textObj: TSubscriptionPageLocalizedText,
    lang: TSubscriptionPageLanguageCode
): string {
    if (!textObj) return ''
    return textObj[lang]
}

export function getExpirationTextUtil(
    expireAt: Date | null | string,
    currentLang: TSubscriptionPageLanguageCode,
    baseTranslations: TSubscriptionPageRawConfig['baseTranslations']
): string {
    if (!expireAt) {
        return getLocalizedText(baseTranslations.unknown, currentLang)
    }

    const expiration = dayjs(expireAt).locale(currentLang)
    const now = dayjs()

    if (expiration.isBefore(now)) {
        return `${getLocalizedText(baseTranslations.expired, currentLang)} ${expiration.fromNow(false)}`
    }

    if (expiration.year() === 2099) {
        return getLocalizedText(baseTranslations.indefinitely, currentLang)
    }

    return `${getLocalizedText(baseTranslations.expiresIn, currentLang)} ${expiration.fromNow(false)}`
}

export const formatDate = (
    dateStr: Date | string,
    currentLang: TSubscriptionPageLanguageCode,
    baseTranslations: TSubscriptionPageRawConfig['baseTranslations']
) => {
    if (dayjs(dateStr).year() === 2099) {
        return getLocalizedText(baseTranslations.indefinitely, currentLang)
    }
    if (currentLang === 'fa') {
        return Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: undefined,
            minute: undefined
        }).format(new Date(dateStr))
    }
    return dayjs(dateStr).locale(currentLang).format('DD MMMM, YYYY')
}
