import { useState } from 'react'

import { sanitizeRichText } from '@shared/utils/sanitize-markup'
import { getLocalizedText } from '@shared/utils/config-parser'

import { IBlockRendererProps } from '../renderer-block.interface'
import classes from './cards-block.module.css'

export const CardsBlockRenderer = ({
    blocks,
    currentLang,
    renderBlockButtons
}: IBlockRendererProps) => {
    const [openSteps, setOpenSteps] = useState<number[]>([0, 1])

    return <div className={classes.steps}>
        {blocks.map((block, index) => (
            <details
                className={classes.step}
                key={index}
                onToggle={(event) => {
                    const opened = event.currentTarget.open
                    setOpenSteps((current) => {
                        if (!opened) return current.filter((item) => item !== index)
                        return current.includes(index) ? current : [...current, index]
                    })
                }}
                open={openSteps.includes(index)}
            >
                <summary className={classes.summary}>
                    <span className={classes.number}>{String(index + 1).padStart(2, '0')}</span>
                    <span
                        className={classes.title}
                        dangerouslySetInnerHTML={{ __html: sanitizeRichText(getLocalizedText(block.title, currentLang)) }}
                    />
                    <span aria-hidden="true" className={classes.chevron} />
                </summary>
                <div className={classes.content}>
                    <div
                        className={classes.description}
                        dangerouslySetInnerHTML={{ __html: sanitizeRichText(getLocalizedText(block.description, currentLang)) }}
                    />
                    {renderBlockButtons(block.buttons, 'light')}
                </div>
            </details>
        ))}
    </div>
}
