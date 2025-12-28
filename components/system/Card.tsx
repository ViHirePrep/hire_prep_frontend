import { ReactNode } from 'react';

import {
    CARD_VARIANTS,
    PADDING,
    CardVariant,
    PaddingVariant,
} from '@/lib/ui-constants';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: CardVariant;
    padding?: PaddingVariant;
}

export default function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
}: CardProps) {
    return (
        <div
            className={`
        rounded-lg
        ${CARD_VARIANTS[variant]}
        ${PADDING[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
