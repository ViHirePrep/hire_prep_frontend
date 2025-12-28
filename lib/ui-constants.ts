export const PADDING = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
    xl: 'p-10',
} as const;

export const SPACING = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
} as const;

export const RADIUS = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
} as const;

export const SHADOW = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
} as const;

export const FONT_SIZE = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
} as const;

export const FONT_WEIGHT = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
} as const;

export const TRANSITION = {
    none: 'transition-none',
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    transform: 'transition-transform',
} as const;

export const DURATION = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
} as const;

export const BUTTON_VARIANTS = {
    primary:
        'bg-primary text-primary-foreground hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]',
    secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]',
    outline:
        'border-2 border-primary text-primary hover:bg-primary/10 bg-transparent transition-all duration-300 hover:scale-[1.02]',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300',
    danger: 'bg-danger text-white hover:bg-danger-dark shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]',
} as const;

export const BUTTON_SIZES = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
} as const;

export const CARD_VARIANTS = {
    default:
        'bg-card border border-border hover:border-primary/30 transition-all duration-300',
    outlined:
        'bg-transparent border border-border hover:border-primary/50 transition-all duration-300',
    elevated:
        'bg-card border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300',
} as const;

export const INPUT_VARIANTS = {
    default:
        'border border-border bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary',
    error: 'border-danger focus:border-danger focus:ring-1 focus:ring-danger',
} as const;

// Type exports for TypeScript
export type PaddingVariant = keyof typeof PADDING;
export type SpacingVariant = keyof typeof SPACING;
export type RadiusVariant = keyof typeof RADIUS;
export type ShadowVariant = keyof typeof SHADOW;
export type FontSizeVariant = keyof typeof FONT_SIZE;
export type FontWeightVariant = keyof typeof FONT_WEIGHT;
export type TransitionVariant = keyof typeof TRANSITION;
export type DurationVariant = keyof typeof DURATION;
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;
export type CardVariant = keyof typeof CARD_VARIANTS;
export type InputVariant = keyof typeof INPUT_VARIANTS;
