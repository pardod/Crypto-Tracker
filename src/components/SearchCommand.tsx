import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (open && cryptos.length === 0) {
      fetchAllCryptos();
    }
  }, [open]);

  const fetchAllCryptos = async () => {
    try {
      const response = await fetch(
        `https://api.coincap.io/v2/assets?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_COINCAP_API_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cryptocurrencies");

      const data = await response.json();
      setCryptos(data.data || []);
      setFilteredCryptos(data.data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch cryptocurrencies",
      });
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCryptos(cryptos);
      return;
    }

    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCryptos(filtered);
  };

  return (
    <>
      <button
        data-search-trigger
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors brutal-border brutal-hover"
      >
        <Search className="h-4 w-4" />
        <span>Search assets...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cryptocurrencies..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Cryptocurrencies">
            {filteredCryptos.map((crypto) => (
              <CommandItem
                key={crypto.id}
                onSelect={() => {
                  navigate(`/crypto/${crypto.id}`);
                  setOpen(false);
                }}
                className="flex items-center justify-between w-full p-2 cursor-pointer hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{crypto.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {crypto.symbol}
                  </span>
                </div>
                <span className="text-sm">
                  ${parseFloat(crypto.priceUsd).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}