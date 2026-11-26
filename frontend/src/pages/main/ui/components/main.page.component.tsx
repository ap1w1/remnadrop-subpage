import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'
import { Box, Container, Image, Stack } from '@mantine/core'

import {
    AccordionBlockRenderer,
    CardsBlockRenderer,
    InstallationGuideConnector,
    MinimalBlockRenderer,
    RawKeysWidget,
    SubscriptionLinkWidget,
    TimelineBlockRenderer
} from '@widgets/main'
import { RemnadropOverviewWidget } from '@widgets/main/remnadrop-overview/remnadrop-overview.widget'
import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { RemnadropExtrasWidget } from '@widgets/main/remnadrop-extras/remnadrop-extras.widget'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { parsePageColors } from '@shared/utils/page-colors'
import { Page, RemnawaveLogo } from '@shared/ui'

import classes from './main.page.module.css'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const BLOCK_RENDERERS = {
    cards: CardsBlockRenderer,
    timeline: TimelineBlockRenderer,
    accordion: AccordionBlockRenderer,
    minimal: MinimalBlockRenderer
} as const

export const MainPageComponent = ({ isMobile, platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()

    const brandName = config.brandingSettings.title
    const { accent } = parsePageColors(
        (config.brandingSettings as { pageColors?: unknown }).pageColors
    )
    let hasCustomLogo = !!config.brandingSettings.logoUrl

    if (hasCustomLogo) {
        if (config.brandingSettings.logoUrl.includes('docs.rw')) {
            hasCustomLogo = false
        }
    }

    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(config.platforms.ios?.apps.length),
        android: Boolean(config.platforms.android?.apps.length),
        linux: Boolean(config.platforms.linux?.apps.length),
        macos: Boolean(config.platforms.macos?.apps.length),
        windows: Boolean(config.platforms.windows?.apps.length),
        androidTV: Boolean(config.platforms.androidTV?.apps.length),
        appleTV: Boolean(config.platforms.appleTV?.apps.length)
    }

    const atLeastOnePlatformApp = Object.values(hasPlatformApps).some((value) => value)

    const brandCaption =
        (
            {
                ru: 'Личный доступ',
                en: 'Your private access',
                fr: 'Votre accès privé',
                zh: '专属访问',
                fa: 'دسترسی شخصی'
            } as Record<string, string>
        )[currentLang] ?? 'Your private access'

    return (
        <Page>
            <Box className={classes.headerOuter}>
                <Container maw={860} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <header className={classes.header}>
                        <div aria-hidden="true" className={classes.headerGlow} />
                        <div className={classes.brand}>
                            <span className={classes.brandLogo}>
                                {hasCustomLogo ? (
                                    <Image
                                        alt=""
                                        className={classes.brandImage}
                                        fit="cover"
                                        src={config.brandingSettings.logoUrl}
                                    />
                                ) : (
                                    <RemnawaveLogo c={accent} size={32} />
                                )}
                            </span>
                            <span className={classes.brandCopy}>
                                <span className={classes.brandCaption}>{brandCaption}</span>
                                <span className={classes.brandName}>{brandName}</span>
                            </span>
                        </div>

                        <div className={classes.headerActions}>
                            {config.uiConfig.subscriptionInfoBlockType === 'hidden' && (
                                <SubscriptionLinkWidget
                                    hideGetLink={config.baseSettings.hideGetLinkButton}
                                    mode="icon"
                                />
                            )}
                            <LanguagePicker
                                currentLang={currentLang}
                                locales={config.locales}
                                onLanguageChange={setLanguage}
                            />
                        </div>
                    </header>
                </Container>
            </Box>

            <Container
                maw={860}
                px={{ base: 'md', sm: 'lg', md: 'xl' }}
                py="xl"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap="lg">
                    {config.uiConfig.subscriptionInfoBlockType !== 'hidden' && (
                        <RemnadropOverviewWidget
                            hideGetLink={config.baseSettings.hideGetLinkButton}
                            variant={config.uiConfig.subscriptionInfoBlockType}
                        />
                    )}

                    <RemnadropExtrasWidget />

                    {atLeastOnePlatformApp && (
                        <InstallationGuideConnector
                            BlockRenderer={
                                BLOCK_RENDERERS[config.uiConfig.installationGuidesBlockType]
                            }
                            hasPlatformApps={hasPlatformApps}
                            isMobile={isMobile}
                            platform={platform}
                        />
                    )}

                    <RawKeysWidget isMobile={isMobile} />
                </Stack>
            </Container>
        </Page>
    )
}
