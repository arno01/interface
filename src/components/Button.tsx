import { CircularProgress } from '@material-ui/core'
import { ReactNode } from 'react'

import { ButtonStyleOverride } from '../types/components'
import styles from './Button.module.scss'

interface Props {
    className?: any
    color?: 'primary' | 'secondary' | 'tertiary'
    disabled?: boolean
    externalLink?: string
    id?: string
    suffix?: ReactNode
    prefix?: ReactNode
    showProgressIndicator?: boolean
    size?: 'small' | 'medium' | 'large'
    styleOverride?: ButtonStyleOverride
    text?: string | ReactNode
    variant?: 'solid' | 'transparent' | 'round'
    onClick?: (e: any) => void
}

const Button = ({
    className = '',
    color = 'primary',
    disabled,
    externalLink,
    id = '',
    suffix,
    prefix,
    showProgressIndicator,
    size = 'small',
    styleOverride,
    text,
    variant = 'solid',
    onClick,
}: Props) => {
    const Button = () => (
        <button
            id={id}
            onClick={disabled ? () => {} : onClick}
            style={styleOverride}
            className={`${styles.button} ${styles[size]} ${styles[color]} ${
                styles[variant]
            } ${className} ${disabled ? `${styles.disabled}` : ''}`}
        >
            {prefix && !showProgressIndicator && (
                <div className={styles.prefix}>{prefix}</div>
            )}
            {text && (
                <div className={styles.text}>
                    {showProgressIndicator ? (
                        <CircularProgress
                            color='inherit'
                            size={
                                size === 'small'
                                    ? '10px'
                                    : size === 'medium'
                                    ? '12px'
                                    : '18px'
                            }
                        />
                    ) : (
                        text
                    )}
                </div>
            )}
            {suffix && !showProgressIndicator && (
                <div className={styles.suffix}>{suffix}</div>
            )}
        </button>
    )

    return externalLink ? (
        <a
            href={externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.link}
        >
            {Button()}
        </a>
    ) : (
        Button()
    )
}

export default Button
