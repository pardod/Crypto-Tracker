import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchTopCryptos } from "@/services/api";
import { AddTransactionInput } from "@/types/portfolio";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: AddTransactionInput) => void;
}

const AddTransactionDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddTransactionDialogProps) => {
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [openCombobox, setOpenCombobox] = useState(false);

  const { data: coins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchTopCryptos,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      coinId,
      amount,
      type,
      timestamp,
    });
    // Reset form
    setCoinId("");
    setAmount("");
    setType("buy");
    setTimestamp(new Date().toISOString().slice(0, 16));
  };

  const selectedCoin = coins.find((coin: any) => coin.id === coinId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new cryptocurrency transaction to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Coin</label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedCoin ? `${selectedCoin.name} (${selectedCoin.symbol})` : "Select a coin..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search coin..." />
                  <CommandList>
                    <CommandEmpty>No coin found.</CommandEmpty>
                    <CommandGroup>
                      {coins.map((coin: any) => (
                        <CommandItem
                          key={coin.id}
                          value={coin.id}
                          onSelect={(currentValue) => {
                            setCoinId(currentValue);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              coinId === coin.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {coin.name} ({coin.symbol})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value: "buy" | "sell") => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <Input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;