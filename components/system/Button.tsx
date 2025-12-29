import { ButtonHTMLAttributes, ReactNode } from 'react';

import {
    BUTTON_SIZES,
    BUTTON_VARIANTS,
    ButtonSize,
    ButtonVariant,
} from '@/lib/ui-constants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
    isLoading?: boolean;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    disabled,
    isLoading,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        rounded-lg font-medium transition-colors duration-200
        ${BUTTON_VARIANTS[variant]}
        ${BUTTON_SIZES[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        ${isLoading ? 'relative bg-gray-500 pointer-events-none' : ' '}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {children}
        </button>
    );
}
