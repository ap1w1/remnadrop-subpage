import { IconInfoCircle } from '@tabler/icons-react'

import classes from './installation-guide.module.css'

const copy = {
    ru: {
        title: 'Приложение недоступно в App Store?',
        description: 'Если его нет в вашем регионе, проверьте другой регион App Store.',
        how: 'Как сменить регион Apple Account',
        steps: [
            'Откройте «Настройки» на iPhone и нажмите на своё имя.',
            'Перейдите в «Медиаматериалы и покупки» → «Страна/регион». При необходимости войдите в аккаунт.',
            'Выберите страну или регион, примите условия и укажите платёжные данные, если Apple их запросит.'
        ],
        note: 'Остаток средств, действующие подписки или незавершённые покупки могут помешать смене региона.',
        link: 'Подробная инструкция Apple'
    },
    en: {
        title: 'App unavailable in the App Store?',
        description: 'If it is not shown in your country, check another App Store region.',
        how: 'How to change your Apple Account region',
        steps: [
            'Open Settings on your iPhone and tap your name.',
            'Go to Media & Purchases → Country/Region. Sign in if asked.',
            'Choose a country or region, accept the terms and enter payment details if Apple requests them.'
        ],
        note: 'Remaining balance, active subscriptions or pending purchases may prevent a region change.',
        link: 'Apple’s full instructions'
    },
    fr: {
        title: 'Application indisponible dans l’App Store ?',
        description:
            'Si elle n’apparaît pas dans votre pays, vérifiez une autre région de l’App Store.',
        how: 'Changer la région du compte Apple',
        steps: [
            'Ouvrez Réglages sur l’iPhone et touchez votre nom.',
            'Ouvrez Contenu multimédia et achats → Pays/Région. Connectez-vous si nécessaire.',
            'Choisissez une région, acceptez les conditions et saisissez les informations de paiement demandées.'
        ],
        note: 'Un solde, des abonnements actifs ou des achats en attente peuvent bloquer le changement.',
        link: 'Instructions complètes d’Apple'
    },
    zh: {
        title: 'App Store 中找不到此应用？',
        description: '如果您所在地区无法显示，请检查其他 App Store 地区。',
        how: '如何更改 Apple 账户地区',
        steps: [
            '在 iPhone 上打开“设置”，轻点您的姓名。',
            '前往“媒体与购买项目”→“国家或地区”，必要时登录。',
            '选择地区，接受条款，并按 Apple 要求填写付款信息。'
        ],
        note: '账户余额、有效订阅或待处理的购买项目可能阻止更改地区。',
        link: 'Apple 完整说明'
    },
    fa: {
        title: 'برنامه در App Store در دسترس نیست؟',
        description: 'اگر در کشور شما نمایش داده نمی‌شود، منطقه دیگری را در App Store بررسی کنید.',
        how: 'روش تغییر منطقه حساب Apple',
        steps: [
            'در iPhone تنظیمات را باز کنید و روی نام خود بزنید.',
            'به Media & Purchases و سپس Country/Region بروید؛ در صورت نیاز وارد شوید.',
            'منطقه را انتخاب کنید، شرایط را بپذیرید و در صورت درخواست Apple اطلاعات پرداخت را وارد کنید.'
        ],
        note: 'موجودی حساب، اشتراک فعال یا خریدهای در انتظار ممکن است مانع تغییر منطقه شوند.',
        link: 'راهنمای کامل Apple'
    }
} as const

export function IosRegionHelp({ language }: { language: string }) {
    const text = copy[language as keyof typeof copy] ?? copy.en

    return (
        <aside className={classes.regionHelp}>
            <IconInfoCircle
                aria-hidden="true"
                className={classes.regionIcon}
                size={21}
                stroke={1.8}
            />
            <div className={classes.regionContent}>
                <strong>{text.title}</strong>
                <p>{text.description}</p>
                <details className={classes.regionDetails}>
                    <summary>{text.how}</summary>
                    <ol>
                        {text.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <p>{text.note}</p>
                    <a
                        href="https://support.apple.com/118283"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {text.link}
                    </a>
                </details>
            </div>
        </aside>
    )
}
