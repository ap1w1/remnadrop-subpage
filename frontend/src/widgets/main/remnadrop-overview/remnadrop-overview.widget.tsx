import { IconCalendar, IconCircleCheck, IconCircleX, IconCreditCard, IconWifi } from '@tabler/icons-react'
import { Badge, Group, Progress } from '@mantine/core'

import { useSubscription } from '@entities/subscription-info-store'
import { useCurrentLang } from '@entities/app-config-store'
import { formatDate } from '@shared/utils/config-parser'
import { useTranslation } from '@shared/hooks'
import { SubscriptionLinkWidget } from '@widgets/main'

import classes from './remnadrop-overview.module.css'

type Variant = 'cards' | 'collapsed' | 'expanded'

const copy = {
    ru: { heading: 'Ваша подписка', active: 'Активна', inactive: 'Недоступна', expires: 'Действует до', used: 'Использовано', remaining: 'Осталось', unlimited: 'Без лимита', renew: 'Продлить подписку' },
    en: { heading: 'Your subscription', active: 'Active', inactive: 'Unavailable', expires: 'Valid until', used: 'Used', remaining: 'Remaining', unlimited: 'Unlimited', renew: 'Renew subscription' },
    fr: { heading: 'Votre abonnement', active: 'Actif', inactive: 'Indisponible', expires: 'Valable jusqu’au', used: 'Utilisé', remaining: 'Restant', unlimited: 'Illimité', renew: 'Renouveler' },
    zh: { heading: '您的订阅', active: '有效', inactive: '不可用', expires: '有效期至', used: '已使用', remaining: '剩余', unlimited: '无限制', renew: '续订' },
    fa: { heading: 'اشتراک شما', active: 'فعال', inactive: 'غیرفعال', expires: 'معتبر تا', used: 'مصرف‌شده', remaining: 'باقی‌مانده', unlimited: 'نامحدود', renew: 'تمدید اشتراک' }
} as const

function formatBytes(value: number, locale: string): string {
    const units = locale === 'ru' ? ['Б', 'КиБ', 'МиБ', 'ГиБ', 'ТиБ'] : ['B', 'KiB', 'MiB', 'GiB', 'TiB']
    let amount = Math.max(0, value)
    let unit = 0
    while (amount >= 1024 && unit < units.length - 1) { amount /= 1024; unit++ }
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: unit ? 1 : 0 }).format(amount)} ${units[unit]}`
}

function safeUrl(value: unknown): string | null {
    if (typeof value !== 'string' || !value) return null
    try {
        const url = new URL(value)
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
    } catch { return null }
}

interface Props { variant: Variant; hideGetLink: boolean }

export function RemnadropOverviewWidget({ variant, hideGetLink }: Props) {
    const subscription = useSubscription()
    const language = useCurrentLang()
    const { currentLang, baseTranslations } = useTranslation()
    const labels = copy[language as keyof typeof copy] ?? copy.en
    const { user } = subscription
    const active = user.userStatus === 'ACTIVE'
    const limit = Number(user.trafficLimitBytes)
    const used = Number(user.trafficUsedBytes)
    const unlimited = !Number.isFinite(limit) || limit <= 0
    const percent = !unlimited && Number.isFinite(used) ? Math.min(100, Math.max(0, used / limit * 100)) : 0
    const remaining = unlimited ? labels.unlimited : formatBytes(limit - used, currentLang)
    const renewUrl = safeUrl((subscription as typeof subscription & { pageLinks?: { webPageStub?: string } }).pageLinks?.webPageStub)

    return <section className={classes.card} aria-label={labels.heading}>
        <div className={classes.headingRow}>
            <div>
                <div className={classes.eyebrow}><IconWifi size={16} />{labels.heading}</div>
                <h1 className={classes.username}>{user.username}</h1>
            </div>
            <Badge className={classes.status} variant="light" color={active ? 'teal' : 'red'} leftSection={active ? <IconCircleCheck size={14} /> : <IconCircleX size={14} />}>
                {active ? labels.active : labels.inactive}
            </Badge>
        </div>

        <div className={classes.details}>
            <div className={classes.detail}><IconCalendar size={18} /><span>{labels.expires}</span><strong>{formatDate(user.expiresAt, currentLang, baseTranslations)}</strong></div>
            {variant !== 'collapsed' && <div className={classes.detail}><span className={classes.dot} /><span>{labels.remaining}</span><strong>{remaining}</strong></div>}
        </div>

        {variant !== 'collapsed' && <div className={classes.traffic}>
            <Group justify="space-between" gap="xs" mb={8}>
                <span>{labels.used} <strong>{user.trafficUsed}</strong></span>
                <span>{unlimited ? labels.unlimited : user.trafficLimit}</span>
            </Group>
            <Progress value={unlimited ? 0 : percent} size={8} radius="xl" color="cyan" aria-label={`${labels.used}: ${Math.round(percent)}%`} />
        </div>}

        {(!hideGetLink || renewUrl) && <div className={classes.actions}>
            <SubscriptionLinkWidget hideGetLink={hideGetLink} mode="hero" />
            {renewUrl && <a className={classes.renew} href={renewUrl} rel="noopener noreferrer" target="_blank"><IconCreditCard size={18} />{labels.renew}</a>}
        </div>}
    </section>
}
