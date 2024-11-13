export interface Transaction {
  id: string;
  user_id: string;
  coin_id: string;
  amount: string;
  type: "buy" | "sell";
  timestamp: string;
  price_at_time: string;
}

export interface AddTransactionInput {
  coinId: string;
  amount: string;
  type: "buy" | "sell";
  timestamp: string;
}