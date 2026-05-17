import type { ChatMessage } from '../types'

export interface AIResponse {
    content: string
    metadata?: Record<string, any>
}

export class AIService {
    private static instance: AIService

    private constructor() { }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService()
        }
        return AIService.instance
    }

    async processQuery(query: string, _context: ChatMessage[] = []): Promise<AIResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

        const lowerQuery = query.toLowerCase()

        // Analyze query intent
        if (lowerQuery.includes('spend') || lowerQuery.includes('expense') || lowerQuery.includes('spent')) {
            return this.generateSpendingAnalysis(query, context)
        } else if (lowerQuery.includes('balance') || lowerQuery.includes('account')) {
            return this.generateAccountBalanceResponse(query, context)
        } else if (lowerQuery.includes('budget')) {
            return this.generateBudgetStatusResponse(query, context)
        } else if (lowerQuery.includes('net worth') || lowerQuery.includes('worth')) {
            return this.generateNetWorthResponse(query, context)
        } else if (lowerQuery.includes('investment') || lowerQuery.includes('portfolio')) {
            return this.generateInvestmentResponse(query, context)
        } else {
            return this.generateGeneralResponse(query, context)
        }
    }

    private generateSpendingAnalysis(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "Based on your recent transactions, you've spent $2,450 on groceries and dining this month, which is 15% higher than last month. Your largest expense was at Whole Foods with $380 spent.",
            "Your monthly spending breakdown shows: Housing & Utilities: $1,200, Transportation: $450, Food & Dining: $680, Entertainment: $320, Healthcare: $180.",
            "This month you've spent $3,200 total, with your top categories being: Groceries (28%), Dining Out (22%), and Transportation (18%). You're on track with your $4,000 monthly budget."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'spending_analysis', query }
        }
    }

    private generateAccountBalanceResponse(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "Your current account balances are: Checking: $5,230, Savings: $12,450, Investment: $45,670. Total liquid assets: $17,680.",
            "You have $5,230 in your checking account, $12,450 in savings earning 2.5% APY, and $45,670 in your investment account with a 12% return this year.",
            "Account overview: Primary Checking ($5,230 available), High-Yield Savings ($12,450), Retirement Account ($45,670), Credit Card ($0 balance, $5,000 limit)."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'account_balance', query }
        }
    }

    private generateBudgetStatusResponse(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "Your budget status: Groceries ($680/$800 remaining), Dining ($320/$400 remaining), Entertainment ($180/$300 remaining). You're doing well on transportation with $120 left to spend.",
            "Budget progress: You've used 85% of your grocery budget, 80% of dining, and 60% of entertainment. You have $520 remaining across all categories this month.",
            "This month: $3,200 spent of $4,000 budget (80% used). Top categories over budget: Dining (+$120), Entertainment (+$20). Categories under budget: Transportation (-$80)."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'budget_status', query }
        }
    }

    private generateNetWorthResponse(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "Your current net worth is $78,350, up 8.5% from last month. Assets: $85,000, Liabilities: $6,650 (mortgage balance).",
            "Net worth summary: Total assets $85,000 (cash $17,680, investments $45,670, property $21,650), minus $6,650 mortgage = $78,350 net worth.",
            "Your financial position: $78,350 net worth with $8,500 increase this month. Your investment portfolio grew by $3,200 while property appreciated by $1,300."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'net_worth', query }
        }
    }

    private generateInvestmentResponse(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "Your investment portfolio: $45,670 total value with 12% YTD return. Top performers: AAPL (+25%), MSFT (+18%), GOOGL (+15%).",
            "Portfolio breakdown: Tech stocks (60%), Bonds (25%), ETFs (15%). Total gain/loss: +$4,890. Best performing holding: Apple with 25% return.",
            "Investment summary: $45,670 portfolio value, up $4,890 (12%) this year. Diversified across 15 holdings with average return of 8.5%."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'investment', query }
        }
    }

    private generateGeneralResponse(query: string, _context: ChatMessage[]): AIResponse {
        const responses = [
            "I'd be happy to help you with that financial question. Could you be more specific about what you'd like to know about your accounts, spending, or investments?",
            "I'm here to help with your financial data. You can ask me about spending patterns, account balances, budget status, or investment performance.",
            "Let me assist you with your finances. Try asking about your recent transactions, account balances, or how you're doing against your budget goals."
        ]

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            metadata: { type: 'general', query }
        }
    }
}

export const aiService = AIService.getInstance()