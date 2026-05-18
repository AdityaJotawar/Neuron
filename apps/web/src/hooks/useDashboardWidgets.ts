import { useState } from 'react';

type WidgetKey = 'stats' | 'quickActions' | 'healthScore' | 'alerts' | 'accounts' | 'netWorth' | 'allocation' | 'expenses' | 'portfolio' | 'savingsGoals' | 'cashFlow';

export function useDashboardWidgets() {
  const [visibleWidgets, setVisibleWidgets] = useState<Record<WidgetKey, boolean>>({
    stats: true,
    quickActions: true,
    healthScore: true,
    alerts: true,
    accounts: true,
    netWorth: true,
    allocation: true,
    expenses: true,
    portfolio: true,
    savingsGoals: true,
    cashFlow: true,
  });

  const [showCustomizeMenu, setShowCustomizeMenu] = useState(false);

  const toggleWidget = (name: WidgetKey) => {
    setVisibleWidgets((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return {
    visibleWidgets,
    toggleWidget,
    showCustomizeMenu,
    setShowCustomizeMenu,
  };
}
