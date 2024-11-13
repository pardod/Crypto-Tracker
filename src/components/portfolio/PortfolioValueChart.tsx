import { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchCryptoHistory, TimeInterval } from "@/services/api";
import PriceChart from "@/components/PriceChart";
import { Transaction } from "@/types/portfolio";

interface PortfolioValueChartProps {
  transactions: Transaction[];
}

const PortfolioValueChart = ({ transactions }: PortfolioValueChartProps) => {
  const [interval, setInterval] = useState<TimeInterval>("d1");

  // Get unique coin IDs and earliest date - moved before early return
  const { uniqueCoinIds, earliestDate } = useMemo(() => {
    if (transactions.length === 0) {
      return { uniqueCoinIds: [], earliestDate: new Date() };
    }
    return {
      uniqueCoinIds: [...new Set(transactions.map(t => t.coin_id))],
      earliestDate: transactions.reduce((earliest, transaction) => {
        const date = new Date(transaction.timestamp);
        return date < earliest ? date : earliest;
      }, new Date())
    };
  }, [transactions]);

  // Fetch historical data for each coin
  const historyQueries = useQueries({
    queries: uniqueCoinIds.map((coinId) => ({
      queryKey: ["cryptoHistory", coinId, interval],
      queryFn: () => fetchCryptoHistory(coinId, interval),
      enabled: uniqueCoinIds.length > 0,
    })),
  });

  const isLoading = historyQueries.some(query => query.isLoading);
  const hasAllData = historyQueries.every(query => query.data && query.data.length > 0);

  // Calculate portfolio value at each timestamp
  const portfolioHistory = useMemo(() => {
    if (!hasAllData || !historyQueries[0]?.data) return [];

    return historyQueries[0].data.map((timePoint) => {
      const timestamp = timePoint.time;
      let totalValue = 0;

      // For each coin
      uniqueCoinIds.forEach((coinId, index) => {
        const coinData = historyQueries[index].data;
        const priceAtTime = coinData?.find(d => d.time === timestamp)?.priceUsd || "0";

        // Calculate holdings at this time
        const relevantTransactions = transactions
          .filter(t => t.coin_id === coinId && new Date(t.timestamp) <= new Date(timestamp));

        const holdings = relevantTransactions.reduce((sum, t) => {
          return t.type === "buy" 
            ? sum + parseFloat(t.amount)
            : sum - parseFloat(t.amount);
        }, 0);

        totalValue += holdings * parseFloat(priceAtTime);
      });

      return {
        time: timestamp,
        priceUsd: totalValue.toString(),
      };
    });
  }, [hasAllData, historyQueries, uniqueCoinIds, transactions]);

  // If there are no transactions, return early
  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Portfolio Performance</h2>
        <div className="text-muted-foreground text-center py-4">
          No transactions yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Portfolio Performance</h2>
      <PriceChart
        data={portfolioHistory}
        interval={interval}
        onIntervalChange={setInterval}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PortfolioValueChart;