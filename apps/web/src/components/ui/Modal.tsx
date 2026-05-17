import React, { useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    className?: string
}

export default function Modal({ isOpen, onClose, children, title, className = '' }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
