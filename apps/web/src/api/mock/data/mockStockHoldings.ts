import type { StockHolding } from '../../../types/index.ts'

export const mockStockHoldings: StockHolding[] = [
  {
    id: 'h1',
    userId: 'user1',
    accountId: '5',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    quantity: 50,
    purchasePrice: 150.00,
    purchaseDate: new Date('2024-01-15'),
    currentPrice: 182.50,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'h2',
    userId: 'user1',
    accountId: '5',
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    quantity: 30,
    purchasePrice: 120.00,
    purchaseDate: new Date('2024-03-10'),
    currentPrice: 138.75,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'h3',
    userId: 'user1',
    accountId: '5',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    quantity: 25,
    purchasePrice: 280.00,
    purchaseDate: new Date('2024-02-20'),
    currentPrice: 365.00,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'h4',
    userId: 'user1',
    accountId: '5',
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    quantity: 40,
    purchasePrice: 200.00,
    purchaseDate: new Date('2024-04-05'),
    currentPrice: 245.00,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-04-05'),
  },
  {
    id: 'h5',
    userId: 'user1',
    accountId: '5',
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    quantity: 20,
    purchasePrice: 145.00,
    purchaseDate: new Date('2024-05-12'),
    currentPrice: 172.25,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-05-12'),
  },
  {
    id: 'h6',
    userId: 'user1',
    accountId: '5',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    quantity: 15,
    purchasePrice: 450.00,
    purchaseDate: new Date('2024-06-01'),
    currentPrice: 485.00,
    lastPriceUpdate: new Date('2025-11-22T16:00:00'),
    createdAt: new Date('2024-06-01'),
  },
]

export const calculateHoldingValue = (holding: StockHolding) => {
  const marketValue = holding.quantity * holding.currentPrice
  const costBasis = holding.quantity * holding.purchasePrice
  const gainLoss = marketValue - costBasis
  const gainLossPercent = (gainLoss / costBasis) * 100

  return {
    marketValue,
    costBasis,
    gainLoss,
    gainLossPercent,
  }
}

export const calculatePortfolioStats = () => {
  let totalValue = 0
  let totalCost = 0

  mockStockHoldings.forEach(holding => {
    const { marketValue, costBasis } = calculateHoldingValue(holding)
    totalValue += marketValue
    totalCost += costBasis
  })

  const totalGainLoss = totalValue - totalCost
  const returnPercentage = (totalGainLoss / totalCost) * 100

  // Mock today's change (would come from API in real app)
  const todayChange = 2.35

  return {
    totalValue,
    totalGainLoss,
    returnPercentage,
    todayChange,
  }
}
