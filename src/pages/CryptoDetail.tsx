import { useParams } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchCryptoDetails, fetchCryptoHistory, TimeInterval } from "@/services/api";
import CryptoCard from "@/components/CryptoCard";
import PriceChart from "@/components/PriceChart";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatLargeNumber } from "@/lib/formatNumber";

const TIME_INTERVALS: TimeInterval[] = ["d1", "d5", "m1", "m3", "y1", "y5", "all"];

const CryptoDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [interval, setInterval] = useState<TimeInterval>("d1");

  const { data: crypto, error: cryptoError } = useQuery({
    queryKey: ["crypto", id],
    queryFn: () => fetchCryptoDetails(id!),
  });

  const historyQueries = useQueries({
    queries: TIME_INTERVALS.map((intervalValue) => ({
      queryKey: ["cryptoHistory", id, intervalValue],
      queryFn: () => fetchCryptoHistory(id!, intervalValue),
    })),
  });

  const currentHistoryQuery = historyQueries[TIME_INTERVALS.indexOf(interval)];

  if (cryptoError || historyQueries.some((q) => q.error)) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch cryptocurrency data",
    });
  }

  if (!crypto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="brutal-border bg-brutal-yellow p-8 animate-shake">
          <p className="font-mono text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  const formatSupply = (value: number, symbol: string) => {
    const formattedNumber = formatLargeNumber(value).replace('$', '');
    return `${formattedNumber} ${symbol}`;
  };

  return (
    <div className="container py-8 space-y-8">
      <Link
        to="/"
        className="inline-block brutal-border brutal-hover bg-brutal-yellow px-4 py-2 font-mono"
      >
        ← Back to List
      </Link>

      <header className="space-y-4">
        <div className="flex items-baseline gap-4">
          <h1 className="text-6xl font-bold">{crypto.name}</h1>
          <span className="text-2xl font-mono text-gray-600">
            {crypto.symbol}
          </span>
        </div>
        <p className="text-4xl font-mono">
          ${parseFloat(crypto.priceUsd).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span
            className={`ml-4 text-2xl ${
              parseFloat(crypto.changePercent24Hr) >= 0
                ? "text-green-600"
                : "text-brutal-red"
            }`}
          >
            {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
          </span>
        </p>
      </header>

      <PriceChart 
        data={currentHistoryQuery?.data || []} 
        interval={interval} 
        onIntervalChange={setInterval}
        isLoading={currentHistoryQuery?.isLoading || false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CryptoCard
          title="Market Cap"
          value={formatLargeNumber(parseFloat(crypto.marketCapUsd))}
        />
        <CryptoCard
          title="24h Volume"
          value={formatLargeNumber(parseFloat(crypto.volumeUsd24Hr))}
        />
        <CryptoCard
          title="Supply"
          value={formatSupply(parseFloat(crypto.supply), crypto.symbol)}
        />
        <CryptoCard
          title="Max Supply"
          value={
            crypto.maxSupply
              ? formatSupply(parseFloat(crypto.maxSupply), crypto.symbol)
              : "∞"
          }
        />
      </div>
    </div>
  );
};

export default CryptoDetail;