import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import TransactionHistory from "@/components/TransactionHistory";
import PortfolioHoldings from "@/components/PortfolioHoldings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "@/types/portfolio";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { usePortfolioMutations } from "@/components/portfolio/PortfolioMutations"; // Corrected import
import { PortfolioContent } from "@/components/portfolio/PortfolioContent";

const Portfolio = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold">Track Your Crypto Portfolio</h1>
          <p className="text-muted-foreground">
            Sign in or create an account to start tracking your cryptocurrency portfolio
          </p>
          <div className="flex justify-center">
            <AuthDialog />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PortfolioContent
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      transactions={transactions}
    />
  );
};

export default Portfolio;