import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
}

interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

interface CardContentProps {
    children: React.ReactNode
    className?: string
}

interface CardFooterProps {
    children: React.ReactNode
    className?: string
}

interface CardTitleProps {
    children: React.ReactNode
    className?: string
}

interface CardDescriptionProps {
    children: React.ReactNode
    className?: string
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-slate-200 ${className}`}>
            {children}
        </div>
    )
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-slate-200 bg-slate-50 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return (
        <p className={`text-sm text-slate-600 ${className}`}>
            {children}
        </p>
    )
}

export default Card
