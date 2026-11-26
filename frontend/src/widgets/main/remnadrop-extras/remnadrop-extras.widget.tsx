import { IconBrandTelegram, IconHeadset, IconWorld } from '@tabler/icons-react'
import { Box } from '@mantine/core'

import { useSubscription } from '@entities/subscription-info-store'
import { useCurrentLang } from '@entities/app-config-store'

import classes from './remnadrop-extras.module.css'

type PageLinks = Partial<Record<'supportUrl' | 'telegramChannel' | 'telegramBot' | 'webPage', string>>

const copy = {
    ru: { support: 'Поддержка', channel: 'Канал', bot: 'Бот', site: 'Сайт', links: 'Ссылки' },
    en: { support: 'Support', channel: 'Channel', bot: 'Bot', site: 'Website', links: 'Links' },
    fr: { support: 'Assistance', channel: 'Canal', bot: 'Bot', site: 'Site', links: 'Liens' },
    zh: { support: '支持', channel: '频道', bot: '机器人', site: '网站', links: '链接' },
    fa: { support: 'پشتیبانی', channel: 'کانال', bot: 'ربات', site: 'وب‌سایت', links: 'پیوندها' }
} as const

export function RemnadropExtrasWidget() {
    const subscription = useSubscription() as ReturnType<typeof useSubscription> & { pageLinks?: PageLinks | null }
    const language = useCurrentLang()
    const labels = copy[language as keyof typeof copy] ?? copy.en
    const candidates = [
        { key: 'supportUrl', label: labels.support, Icon: IconHeadset },
        { key: 'telegramChannel', label: labels.channel, Icon: IconBrandTelegram },
        { key: 'telegramBot', label: labels.bot, Icon: IconBrandTelegram },
        { key: 'webPage', label: labels.site, Icon: IconWorld }
    ] as const
    const links = candidates.flatMap(item => {
        const href = subscription.pageLinks?.[item.key]
        if (!href) return []
        try {
            const url = new URL(href)
            if (url.protocol !== 'https:' && url.protocol !== 'http:') return []
            return [{ ...item, href: url.href }]
        } catch { return [] }
    })

    if (!links.length) return null

    return <nav className={classes.links} aria-label={labels.links}>
        {links.map(({ key, label, Icon, href }) => <Box component="a" href={href} key={key} className={classes.link} rel="noopener noreferrer" target="_blank">
            <Icon size={17} /><span>{label}</span>
        </Box>)}
    </nav>
}
