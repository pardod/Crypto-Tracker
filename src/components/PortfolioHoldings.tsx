import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopCryptos } from "@/services/api";
import { Transaction } from "@/types/portfolio";
import { formatLargeNumber } from "@/lib/formatNumber";

interface PortfolioHoldingsProps {
  transactions: Transaction[];
}

const PortfolioHoldings = ({ transactions }: PortfolioHoldingsProps) => {
  const { data: currentPrices = [] } = useQuery({
    queryKey: ["currentPrices"],
    queryFn: fetchTopCryptos,
  });

  const holdings = useMemo(() => {
    const holdingsMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      const currentAmount = holdingsMap.get(transaction.coin_id) || 0;
      const amount = parseFloat(transaction.amount);
      holdingsMap.set(
        transaction.coin_id,
        transaction.type === "buy"
          ? currentAmount + amount
          : currentAmount - amount
      );
    });

    return Array.from(holdingsMap.entries())
      .map(([coinId, amount]) => {
        const currentPrice = currentPrices.find((coin: any) => coin.id === coinId);
        return {
          coinId,
          amount,
          value: currentPrice ? amount * parseFloat(currentPrice.priceUsd) : 0,
          name: currentPrice ? `${currentPrice.name} (${currentPrice.symbol})` : coinId,
        };
      })
      .filter((holding) => holding.amount > 0);
  }, [transactions, currentPrices]);

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Total Value</p>
        <p className="text-2xl font-bold">{formatLargeNumber(totalValue)}</p>
      </div>

      {holdings.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No holdings yet
        </p>
      ) : (
        <div className="space-y-2">
          {holdings.map((holding) => (
            <div
              key={holding.coinId}
              className="flex justify-between items-center p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">{holding.name}</p>
                <p className="text-sm text-muted-foreground">
                  {holding.amount.toFixed(8)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatLargeNumber(holding.value)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {((holding.value / totalValue) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioHoldings;