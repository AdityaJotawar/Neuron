export interface WebSocketMessage {
    type: string
    payload: any
    timestamp: Date
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void

export class MockWebSocket {
    private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map()
    private isConnected = false
    private reconnectAttempts = 0
    private maxReconnectAttempts = 3
    private reconnectInterval = 1000

    constructor(_url: string) {
        // url stored for future reconnection logic
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Simulate connection delay
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    this.isConnected = true
                    this.emit('open', { type: 'open', payload: {}, timestamp: new Date() })
                    resolve()
                } else {
                    reject(new Error('Connection failed'))
                }
            }, 500 + Math.random() * 1000)
        })
    }

    disconnect(): void {
        this.isConnected = false
        this.emit('close', { type: 'close', payload: {}, timestamp: new Date() })
    }

    send(message: WebSocketMessage): void {
        if (!this.isConnected) {
            throw new Error('WebSocket is not connected')
        }

        // Simulate server response delay
        setTimeout(() => {
            this.handleIncomingMessage(message)
        }, 100 + Math.random() * 500)
    }

    on(event: string, handler: WebSocketEventHandler): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, [])
        }
        this.eventHandlers.get(event)!.push(handler)
    }

    off(event: string, handler: WebSocketEventHandler): void {
        const handlers = this.eventHandlers.get(event)
        if (handlers) {
            const index = handlers.indexOf(handler)
            if (index > -1) {
                handlers.splice(index, 1)
            }
        }
    }

    private emit(event: string, message: WebSocketMessage): void {
        const handlers = this.eventHandlers.get(event)
        if (handlers) {
            handlers.forEach(handler => handler(message))
        }
    }

    private handleIncomingMessage(outgoingMessage: WebSocketMessage): void {
        // Simulate different response types based on message type
        switch (outgoingMessage.type) {
            case 'chat_message':
                this.simulateChatResponse(outgoingMessage)
                break
            case 'ping':
                this.emit('message', {
                    type: 'pong',
                    payload: { originalTimestamp: outgoingMessage.timestamp },
                    timestamp: new Date()
                })
                break
            default:
                // Echo back with acknowledgment
                this.emit('message', {
                    type: 'ack',
                    payload: { received: outgoingMessage },
                    timestamp: new Date()
                })
        }
    }

    private simulateChatResponse(message: WebSocketMessage): void {
        const responses = [
            "I've received your message and am processing it.",
            "Let me analyze your financial data...",
            "Here's what I found in your accounts:",
            "Based on your transaction history:",
            "Your budget status shows:"
        ]

        // Send multiple chunks to simulate streaming
        const fullResponse = responses[Math.floor(Math.random() * responses.length)]
        const chunks = fullResponse.split(' ')

        chunks.forEach((chunk, index) => {
            setTimeout(() => {
                this.emit('message', {
                    type: 'chat_chunk',
                    payload: {
                        chunk: chunk + ' ',
                        isComplete: index === chunks.length - 1,
                        messageId: message.payload.id
                    },
                    timestamp: new Date()
                })
            }, index * 200)
        })
    }

    getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'error' {
        if (this.isConnected) return 'connected'
        return 'disconnected'
    }

    // Auto-reconnect functionality
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.emit('error', {
                type: 'error',
                payload: { message: 'Max reconnection attempts reached' },
                timestamp: new Date()
            })
            return
        }

        this.reconnectAttempts++
        setTimeout(() => {
            this.connect().catch(() => {
                this.attemptReconnect()
            })
        }, this.reconnectInterval * this.reconnectAttempts)
    }
}

// Factory function to create mock WebSocket instances
export const createMockWebSocket = (url: string): MockWebSocket => {
    return new MockWebSocket(url)
}

// Connection manager for managing multiple WebSocket connections
export class WebSocketManager {
    private connections: Map<string, MockWebSocket> = new Map()

    createConnection(id: string, url: string): MockWebSocket {
        const ws = createMockWebSocket(url)
        this.connections.set(id, ws)
        return ws
    }

    getConnection(id: string): MockWebSocket | undefined {
        return this.connections.get(id)
    }

    closeConnection(id: string): void {
        const ws = this.connections.get(id)
        if (ws) {
            ws.disconnect()
            this.connections.delete(id)
        }
    }

    closeAll(): void {
        this.connections.forEach((ws, id) => {
            ws.disconnect()
            this.connections.delete(id)
        })
    }
}

export const webSocketManager = new WebSocketManager()