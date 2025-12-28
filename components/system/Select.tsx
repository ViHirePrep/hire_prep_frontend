import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: SelectOption[];
    children?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, children, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                        {label}
                    </label>
                )}
                <select
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
                >
                    {options
                        ? options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                  {option.label}
                              </option>
                          ))
                        : children}
                </select>
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';

export default Select;
