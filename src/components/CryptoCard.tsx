import { cn } from "@/lib/utils";

interface CryptoCardProps {
  title: string;
  value: string;
  className?: string;
}

const CryptoCard = ({ title, value, className }: CryptoCardProps) => {
  return (
    <div className={cn("brutal-border brutal-hover bg-brutal-white p-4", className)}>
      <h3 className="text-sm font-mono uppercase mb-2">{title}</h3>
      <p className="text-2xl font-bold font-space">{value}</p>
    </div>
  );
};

export default CryptoCard;