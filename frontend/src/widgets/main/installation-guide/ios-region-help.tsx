import { IconInfoCircle } from '@tabler/icons-react'

import classes from './installation-guide.module.css'

const copy = {
    ru: {
        title: 'Приложение недоступно в App Store?',
        description: 'Если приложения нет в вашем App Store, смените регион Apple Account или создайте второй аккаунт с нужным регионом.',
        how: 'Как сменить регион Apple Account',
        create: 'Как создать второй Apple Account',
        createSteps: [
            'Создайте новый Apple Account с отдельной почтой и выберите нужную страну или регион.',
            'Подтвердите почту и номер телефона, затем войдите с новым аккаунтом в App Store.',
            'Установите приложение и при необходимости вернитесь к основному аккаунту.'
        ],
        example: 'Пример формата адреса для США',
        exampleNote: 'Это только пример заполнения полей. Для оплаты и проверки аккаунта указывайте свои действительные данные.',
        createLink: 'Создание Apple Account — инструкция Apple',
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
        description: 'If the app is missing from your App Store, change your Apple Account region or create a second account for the required region.',
        how: 'How to change your Apple Account region',
        create: 'How to create a second Apple Account',
        createSteps: [
            'Create a new Apple Account with another email address and choose the required country or region.',
            'Verify your email and phone number, then sign in to the App Store with the new account.',
            'Install the app and return to your main account if needed.'
        ],
        example: 'Example US address format',
        exampleNote: 'This only shows the field format. Use your real details for payments and account verification.',
        createLink: 'Apple’s account creation guide',
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
            'Si l’application est absente de l’App Store, changez la région de votre compte Apple ou créez un second compte dans la région voulue.',
        how: 'Changer la région du compte Apple',
        create: 'Créer un second compte Apple',
        createSteps: [
            'Créez un compte Apple avec une autre adresse e-mail et choisissez le pays ou la région voulu.',
            'Confirmez l’e-mail et le numéro de téléphone, puis connectez-vous à l’App Store avec ce compte.',
            'Installez l’application et revenez à votre compte principal si nécessaire.'
        ],
        example: 'Exemple de format d’adresse aux États-Unis',
        exampleNote: 'Cet exemple montre seulement le format. Utilisez vos vraies coordonnées pour le paiement et la vérification.',
        createLink: 'Guide Apple de création de compte',
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
        description: '如果您的 App Store 中没有此应用，请更改 Apple 账户地区，或为所需地区创建第二个账户。',
        how: '如何更改 Apple 账户地区',
        create: '如何创建第二个 Apple 账户',
        createSteps: [
            '使用另一个电子邮箱创建 Apple 账户，并选择所需国家或地区。',
            '验证电子邮箱和电话号码，然后用新账户登录 App Store。',
            '安装应用；如有需要，再切换回主要账户。'
        ],
        example: '美国地址字段示例',
        exampleNote: '此示例仅展示字段格式。付款和账户验证时请填写您自己的真实信息。',
        createLink: 'Apple 创建账户指南',
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
        description: 'اگر برنامه در App Store شما نیست، منطقه حساب Apple را تغییر دهید یا حساب دومی برای منطقه موردنظر بسازید.',
        how: 'روش تغییر منطقه حساب Apple',
        create: 'روش ساخت حساب دوم Apple',
        createSteps: [
            'با ایمیل دیگری حساب Apple بسازید و کشور یا منطقه موردنظر را انتخاب کنید.',
            'ایمیل و شماره تلفن را تأیید کنید و با حساب جدید وارد App Store شوید.',
            'برنامه را نصب کنید و در صورت نیاز به حساب اصلی برگردید.'
        ],
        example: 'نمونه قالب نشانی آمریکا',
        exampleNote: 'این فقط نمونه قالب فیلدها است. برای پرداخت و تأیید حساب، اطلاعات واقعی خود را وارد کنید.',
        createLink: 'راهنمای ساخت حساب Apple',
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
                <details className={classes.regionDetails}>
                    <summary>{text.create}</summary>
                    <ol>
                        {text.createSteps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <div className={classes.addressExample}>
                        <strong>{text.example}</strong>
                        <dl>
                            <div><dt>Street</dt><dd>One Apple Park Way</dd></div>
                            <div><dt>City</dt><dd>Cupertino</dd></div>
                            <div><dt>State</dt><dd>California (CA)</dd></div>
                            <div><dt>ZIP Code</dt><dd>95014</dd></div>
                            <div><dt>Phone · Code</dt><dd>408</dd></div>
                            <div><dt>Phone · Number</dt><dd>996 1010</dd></div>
                        </dl>
                        <p>{text.exampleNote}</p>
                    </div>
                    <a
                        href="https://support.apple.com/108647"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {text.createLink}
                    </a>
                </details>
            </div>
        </aside>
    )
}
