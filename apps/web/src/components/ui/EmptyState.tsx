import type { ReactNode } from 'react'
import { cn } from '../../utils/index.ts'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}
