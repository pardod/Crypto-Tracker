import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "@/types/portfolio";

export const usePortfolioMutations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: any) => {
      if (!user) throw new Error("User not authenticated");

      // Check if transaction is from today
      const isToday = new Date(newTransaction.timestamp).toDateString() === new Date().toDateString();
      let priceAtTime;

      if (isToday) {
        // Get current price
        const response = await fetch(`https://api.coincap.io/v2/assets/${newTransaction.coinId}`);
        if (!response.ok) throw new Error('Failed to fetch current price');
        const data = await response.json();
        priceAtTime = data.data.priceUsd;
      } else {
        // Get historical price
        const timestamp = new Date(newTransaction.timestamp).getTime();
        const response = await fetch(
          `https://api.coincap.io/v2/assets/${newTransaction.coinId}/history?interval=h1&start=${timestamp}&end=${timestamp + 3600000}`
        );
        if (!response.ok) throw new Error('Failed to fetch price data');
        const data = await response.json();
        priceAtTime = data.data[0]?.priceUsd || "0";
      }

      const { data: transactionData, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            coin_id: newTransaction.coinId,
            amount: newTransaction.amount,
            type: newTransaction.type,
            timestamp: newTransaction.timestamp,
            price_at_time: priceAtTime,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return transactionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editTransactionMutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (!user) throw new Error("User not authenticated");

      console.log("Attempting to update transaction:", {
        id: transaction.id,
        user_id: user.id,
        amount: transaction.amount,
        type: transaction.type,
        timestamp: transaction.timestamp
      });

      const { data, error } = await supabase
        .from("transactions")
        .update({
          amount: transaction.amount.toString(),
          type: transaction.type,
          timestamp: new Date(transaction.timestamp).toISOString()
        })
        .eq("id", transaction.id)
        .eq("user_id", user.id)
        .select();


      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from update operation");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addTransactionMutation,
    editTransactionMutation,
    deleteTransactionMutation,
  };
};