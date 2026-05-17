import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { aiService } from '../../../services/aiService'
import type { ChatMessage } from '../../../types'

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI financial assistant. I can help you analyze your spending, check account balances, review budget status, and answer questions about your investments. What would you like to know?',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            const response = await aiService.processQuery(userMessage.content, messages)

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                metadata: response.metadata
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error processing AI query:', error)
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-slate-100 rounded-lg px-4 py-3 max-w-[70%]">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-sm text-slate-500">AI is typing...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4">
                <div className="flex items-end space-x-3">
                    <div className="flex-1">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me about your finances..."
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows={1}
                            disabled={isTyping}
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = 'auto'
                                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}