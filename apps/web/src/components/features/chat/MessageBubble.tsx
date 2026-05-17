
import type { ChatMessage } from '../../../types'

interface MessageBubbleProps {
    message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${isUser
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-900'
                    }`}
            >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${isUser ? 'text-primary-100' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    )
}