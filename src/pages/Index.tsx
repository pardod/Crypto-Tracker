import { useQuery } from "@tanstack/react-query";
import { fetchTopCryptos } from "@/services/api";
import CryptoTable from "@/components/CryptoTable";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const { data: cryptos, error } = useQuery({
    queryKey: ["cryptos"],
    queryFn: fetchTopCryptos,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch cryptocurrencies",
    });
  }

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
      <h1 className="text-6xl font-bold mb-8">Crypto Assets</h1>
      <CryptoTable data={cryptos} />
    </div>
  );
};

export default Index;