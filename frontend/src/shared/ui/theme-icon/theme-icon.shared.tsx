import { ThemeIcon } from '@mantine/core'

interface IProps {
    getIconFromLibrary: (iconKey: string) => string
    isMobile: boolean
    svgIconKey: string
}
export const ThemeIconShared = (props: IProps) => {
    const { isMobile, svgIconKey, getIconFromLibrary } = props

    return (
        <ThemeIcon
            radius="xl"
            size={isMobile ? 36 : 44}
            style={{
                color: 'var(--page-accent, #22c7d9)',
                background: 'color-mix(in srgb, var(--page-accent, #22c7d9) 15%, var(--page-surface, #161b22))',
                border: '1px solid color-mix(in srgb, var(--page-accent, #22c7d9) 45%, transparent)',
                boxShadow: '0 0 0 3px color-mix(in srgb, var(--page-accent, #22c7d9) 8%, transparent)',
                flexShrink: 0
            }}
            variant="light"
        >
            <span
                dangerouslySetInnerHTML={{
                    __html: getIconFromLibrary(svgIconKey)
                }}
                style={{ display: 'flex', alignItems: 'center' }}
            />
        </ThemeIcon>
    )
}
