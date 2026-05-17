import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
        outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-primary-500',
        ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-500'
    }

    const sizeClasses = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
