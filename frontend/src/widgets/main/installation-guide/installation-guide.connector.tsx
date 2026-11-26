import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandUbuntu,
    IconBrandWindows,
    IconCheck,
    IconCopy,
    IconDeviceTv,
    IconDownload,
    IconPlus
} from '@tabler/icons-react'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import { Button, ButtonVariant, Card, UnstyledButton } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { useState } from 'react'
import clsx from 'clsx'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { getIconFromLibrary } from '@shared/utils/config-parser'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useAppConfig } from '@entities/app-config-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import { IBlockRendererProps } from './components/blocks/renderer-block.interface'
import classes from './installation-guide.module.css'
import { IosRegionHelp } from './ios-region-help'

export type TBlockVariant = 'accordion' | 'cards' | 'minimal' | 'timeline'

interface IProps {
    BlockRenderer: React.ComponentType<IBlockRendererProps>
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const PLATFORM_ICONS = {
    ios: IconBrandApple,
    android: IconBrandAndroid,
    linux: IconBrandUbuntu,
    macos: IconBrandApple,
    windows: IconBrandWindows,
    androidTV: IconDeviceTv,
    appleTV: IconDeviceTv
} as const

const guideLabels = {
    ru: {
        eyebrow: 'Быстрый старт',
        intro: 'Выберите устройство и приложение — дальше всего несколько шагов.',
        device: 'Устройство',
        app: 'Приложение',
        featured: 'Рекомендуем'
    },
    en: {
        eyebrow: 'Quick start',
        intro: 'Choose your device and app, then follow a few simple steps.',
        device: 'Device',
        app: 'App',
        featured: 'Recommended'
    },
    fr: {
        eyebrow: 'Démarrage rapide',
        intro: 'Choisissez votre appareil et votre application, puis suivez les étapes.',
        device: 'Appareil',
        app: 'Application',
        featured: 'Recommandé'
    },
    zh: {
        eyebrow: '快速开始',
        intro: '选择设备和应用，然后按照几个简单步骤操作。',
        device: '设备',
        app: '应用',
        featured: '推荐'
    },
    fa: {
        eyebrow: 'شروع سریع',
        intro: 'دستگاه و برنامه را انتخاب کنید و چند مرحله ساده را دنبال کنید.',
        device: 'دستگاه',
        app: 'برنامه',
        featured: 'پیشنهادی'
    }
} as const

export const InstallationGuideConnector = (props: IProps) => {
    const { isMobile, hasPlatformApps, BlockRenderer, platform } = props

    const { t, currentLang, baseTranslations } = useTranslation()

    const { platforms, svgLibrary } = useAppConfig()
    const { copy } = useClipboard({ timeout: 2_000 })
    const subscription = useSubscription()
    const labels = guideLabels[currentLang as keyof typeof guideLabels] ?? guideLabels.en

    const [selectedAppIndex, setSelectedAppIndex] = useState(0)
    const [selectedPlatform, setSelectedPlatform] = useState<TSubscriptionPagePlatformKey>(() => {
        if (platform && hasPlatformApps[platform]) {
            return platform
        }

        const firstAvailable = (
            Object.keys(hasPlatformApps) as TSubscriptionPagePlatformKey[]
        ).find((key) => hasPlatformApps[key])
        return firstAvailable!
    })

    const platformApps = platforms[selectedPlatform]!.apps
    const selectedApp = platformApps[selectedAppIndex] ?? platformApps[0]

    const availablePlatforms = (
        Object.entries(hasPlatformApps) as [TSubscriptionPagePlatformKey, boolean][]
    )
        .filter(([_, hasApps]) => hasApps)
        .map(([platform]) => {
            const platformConfig = platforms[platform]!
            return { value: platform, label: t(platformConfig.displayName) }
        })

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleButtonClick = (button: TSubscriptionPageButtonConfig) => {
        let formattedUrl: string | undefined

        if (button.type === 'subscriptionLink' || button.type === 'copyButton') {
            formattedUrl = TemplateEngine.formatWithMetaInfo(button.link, {
                username: subscription.user.username,
                subscriptionUrl
            })
        }

        switch (button.type) {
            case 'copyButton': {
                if (!formattedUrl) return

                copy(formattedUrl)
                notifications.show({
                    title: t(baseTranslations.linkCopied),
                    message: t(baseTranslations.linkCopiedToClipboard),
                    color: 'cyan'
                })
                break
            }
            case 'external': {
                window.open(button.link, '_blank', 'noopener,noreferrer')
                break
            }
            case 'subscriptionLink': {
                if (!formattedUrl) return

                window.open(formattedUrl, '_blank', 'noopener,noreferrer')
                break
            }
            default:
                break
        }
    }

    const renderBlockButtons = (
        buttons: TSubscriptionPageButtonConfig[],
        _variant: ButtonVariant
    ) => {
        if (buttons.length === 0) return null

        return (
            <div className={classes.actionGrid}>
                {buttons.map((button, index) => {
                    let ActionIcon = IconDownload
                    if (button.type === 'copyButton') ActionIcon = IconCopy
                    else if (button.type === 'subscriptionLink') ActionIcon = IconPlus
                    else if (button.link.includes('apps.apple.com')) ActionIcon = IconBrandApple

                    return (
                        <Button
                            className={clsx(
                                classes.actionButton,
                                button.type === 'subscriptionLink' && classes.actionButtonPrimary
                            )}
                            key={`${button.type}-${index}`}
                            leftSection={<ActionIcon size={18} stroke={1.8} />}
                            onClick={() => handleButtonClick(button)}
                            radius="md"
                            size="sm"
                            variant={button.type === 'subscriptionLink' ? 'filled' : 'default'}
                        >
                            {t(button.text)}
                        </Button>
                    )
                })}
            </div>
        )
    }

    const getIcon = (iconKey: string) => getIconFromLibrary(iconKey, svgLibrary)

    return (
        <Card className={classes.guide} p={0} radius="lg">
            <div className={classes.guideTop}>
                <div className={classes.guideHeading}>
                    <span className={classes.guideEyebrow}>{labels.eyebrow}</span>
                    <h2>{t(baseTranslations.installationGuideHeader)}</h2>
                    <p>{labels.intro}</p>
                </div>
                {availablePlatforms.length > 1 && (
                    <div className={classes.platformSection}>
                        <span className={classes.sectionLabel}>{labels.device}</span>
                        <div
                            aria-label={labels.device}
                            className={classes.platformList}
                            role="group"
                        >
                            {availablePlatforms.map(({ value, label }) => {
                                const PlatformIcon = PLATFORM_ICONS[value]
                                return (
                                    <UnstyledButton
                                        aria-pressed={selectedPlatform === value}
                                        className={clsx(
                                            classes.platformButton,
                                            selectedPlatform === value &&
                                                classes.platformButtonActive
                                        )}
                                        key={value}
                                        onClick={() => {
                                            vibrate([80])
                                            setSelectedPlatform(value)
                                            setSelectedAppIndex(0)
                                        }}
                                        type="button"
                                    >
                                        <PlatformIcon size={19} stroke={1.8} />
                                        <span>{label}</span>
                                    </UnstyledButton>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {platformApps.length > 0 && (
                <div className={classes.guideBody}>
                    <div className={classes.appSection}>
                        <span className={classes.sectionLabel}>{labels.app}</span>
                        <div className={classes.appsGrid}>
                            {platformApps.map((app: TSubscriptionPageAppConfig, index: number) => {
                                const isActive = index === selectedAppIndex
                                const iconMarkup = app.svgIconKey
                                    ? svgLibrary[app.svgIconKey]
                                    : undefined
                                const appVisual = iconMarkup ? (
                                    <span dangerouslySetInnerHTML={{ __html: iconMarkup }} />
                                ) : (
                                    <span>{app.name.slice(0, 1).toUpperCase()}</span>
                                )

                                return (
                                    <UnstyledButton
                                        aria-pressed={isActive}
                                        className={clsx(
                                            classes.appButton,
                                            isActive && classes.appButtonActive
                                        )}
                                        key={`${app.name}-${index}`}
                                        onClick={() => {
                                            vibrate('toggle')
                                            setSelectedAppIndex(index)
                                        }}
                                        type="button"
                                    >
                                        <span className={classes.appIcon}>{appVisual}</span>
                                        <span className={classes.appName}>{app.name}</span>
                                        {app.featured && (
                                            <span
                                                className={classes.featuredBadge}
                                                title={labels.featured}
                                            >
                                                <IconCheck size={12} stroke={3} />
                                            </span>
                                        )}
                                    </UnstyledButton>
                                )
                            })}
                        </div>
                    </div>

                    {selectedApp && (
                        <div className={classes.stepsSection}>
                            <BlockRenderer
                                blocks={selectedApp.blocks}
                                currentLang={currentLang}
                                getIconFromLibrary={getIcon}
                                isMobile={isMobile}
                                renderBlockButtons={renderBlockButtons}
                                svgLibrary={svgLibrary}
                            />
                        </div>
                    )}

                    {selectedPlatform === 'ios' && <IosRegionHelp language={currentLang} />}
                </div>
            )}
        </Card>
    )
}
