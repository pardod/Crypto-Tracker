import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import TransactionHistory from "@/components/TransactionHistory";
import PortfolioHoldings from "@/components/PortfolioHoldings";
import PortfolioValueChart from "./PortfolioValueChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, History, LineChart } from "lucide-react";
import { Transaction } from "@/types/portfolio";
import { usePortfolioMutations } from "./PortfolioMutations";

interface PortfolioContentProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  transactions: Transaction[];
}

export const PortfolioContent = ({
  isDialogOpen,
  setIsDialogOpen,
  transactions,
}: PortfolioContentProps) => {
  const { addTransactionMutation, editTransactionMutation, deleteTransactionMutation } = usePortfolioMutations();

  // Preload all components by rendering them initially
  const chartComponent = <PortfolioValueChart transactions={transactions} />;
  const holdingsComponent = <PortfolioHoldings transactions={transactions} />;
  const historyComponent = (
    <TransactionHistory 
      transactions={transactions} 
      onDeleteTransaction={deleteTransactionMutation.mutate}
      onEditTransaction={editTransactionMutation.mutate}
    />
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
      </div>

      <Card className="p-6">
        {chartComponent}
      </Card>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Holdings
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Chart
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="holdings">
          <Card className="p-6">
            {holdingsComponent}
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card className="p-6">
            {chartComponent}
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="p-6">
            {historyComponent}
          </Card>
        </TabsContent>
      </Tabs>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(transaction) => addTransactionMutation.mutate(transaction)}
      />
    </div>
  );
};