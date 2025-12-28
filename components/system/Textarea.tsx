import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
            w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-black/10
            ${error ? 'border-red-500' : 'border-zinc-300'}
            ${props.disabled ? 'bg-zinc-50 cursor-not-allowed' : 'bg-white'}
            text-zinc-900
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-xs text-zinc-500">{helperText}</p>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export default Textarea;
