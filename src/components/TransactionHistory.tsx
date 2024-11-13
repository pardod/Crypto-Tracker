import { formatLargeNumber } from "@/lib/formatNumber";
import { Transaction } from "@/types/portfolio";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditTransactionDialog from "./EditTransactionDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionHistory = ({ 
  transactions, 
  onDeleteTransaction,
  onEditTransaction 
}: TransactionHistoryProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  // Fetch crypto data for all unique coin IDs
  const uniqueCoinIds = [...new Set(transactions.map(t => t.coin_id))];
  const { data: cryptoData } = useQuery({
    queryKey: ["cryptoDetails", uniqueCoinIds],
    queryFn: async () => {
      const responses = await Promise.all(
        uniqueCoinIds.map(async (coinId) => {
          const response = await fetch(`https://api.coincap.io/v2/assets/${coinId}`);
          if (!response.ok) throw new Error('Failed to fetch crypto data');
          const data = await response.json();
          return data.data;
        })
      );
      return responses.reduce((acc, curr) => {
        acc[curr.id] = { name: curr.name, symbol: curr.symbol };
        return acc;
      }, {} as Record<string, { name: string; symbol: string }>);
    },
    enabled: uniqueCoinIds.length > 0,
  });

  const handleEditSubmit = (transaction: Transaction) => {
    onEditTransaction(transaction);
    setEditingTransaction(null);
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    });
  };

  const getCryptoDisplay = (coinId: string) => {
    if (!cryptoData || !cryptoData[coinId]) return coinId;
    return `${cryptoData[coinId].name} (${cryptoData[coinId].symbol.toUpperCase()})`;
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No transactions yet
        </p>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 bg-muted rounded-lg group"
            >
              <div className="space-y-1">
                <p className="font-medium">{getCryptoDisplay(transaction.coin_id)}</p>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{new Date(transaction.timestamp).toLocaleDateString()}</p>
                  <p>Price: {formatLargeNumber(parseFloat(transaction.price_at_time))}/coin</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={transaction.type === "buy" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "buy" ? "+" : "-"}
                    {transaction.amount} {transaction.coin_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: {formatLargeNumber(parseFloat(transaction.price_at_time) * parseFloat(transaction.amount))}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTransaction(transaction)}
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTransaction && (
        <EditTransactionDialog
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          transaction={editingTransaction}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default TransactionHistory;