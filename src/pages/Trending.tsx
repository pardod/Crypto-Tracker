import { useQuery } from "@tanstack/react-query";
import { fetchTrendingCryptos } from "@/services/api";
import CryptoTable from "@/components/CryptoTable";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrendingUp, TrendingDown } from "lucide-react";

const Trending = () => {
  const { toast } = useToast();
  const [showLosers, setShowLosers] = useState(false);
  
  // Query for gainers
  const { data: gainers, error: gainersError } = useQuery({
    queryKey: ["trending-cryptos-gainers"],
    queryFn: () => fetchTrendingCryptos(false),
  });

  // Query for losers
  const { data: losers, error: losersError } = useQuery({
    queryKey: ["trending-cryptos-losers"],
    queryFn: () => fetchTrendingCryptos(true),
  });

  if (gainersError || losersError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch trending cryptocurrencies",
    });
  }

  const cryptos = showLosers ? losers : gainers;

  if (!cryptos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="brutal-border bg-brutal-yellow p-8 animate-shake">
          <p className="font-mono text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-6xl font-bold mb-8">Trending Crypto Assets</h1>
      <div className="flex items-center gap-4 mb-8">
        <ToggleGroup type="single" value={showLosers ? "losers" : "gainers"} onValueChange={(value) => setShowLosers(value === "losers")}>
          <ToggleGroupItem value="gainers" aria-label="Show top gainers" className="brutal-border data-[state=on]:bg-brutal-yellow">
            <TrendingUp className="h-4 w-4 mr-2" />
            Top Gainers
          </ToggleGroupItem>
          <ToggleGroupItem value="losers" aria-label="Show top losers" className="brutal-border data-[state=on]:bg-brutal-yellow">
            <TrendingDown className="h-4 w-4 mr-2" />
            Top Losers
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <p className="text-lg mb-8 text-gray-600">
        Top 50 cryptocurrencies by 24-hour price {showLosers ? "decrease" : "increase"}
      </p>
      <CryptoTable data={cryptos} />
    </div>
  );
};

export default Trending;