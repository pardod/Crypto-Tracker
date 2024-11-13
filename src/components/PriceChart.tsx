import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CryptoHistory } from "@/types/crypto";
import { TimeInterval } from "@/services/api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PriceChartProps {
  data: CryptoHistory[];
  interval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
  isLoading?: boolean;
}

const TIME_OPTIONS: { value: TimeInterval; label: string }[] = [
  { value: "d1", label: "1D" },
  { value: "d5", label: "5D" },
  { value: "m1", label: "1M" },
  { value: "m3", label: "3M" },
  { value: "y1", label: "1Y" },
  { value: "y5", label: "5Y" },
  { value: "all", label: "ALL" },
];

const PriceChart = ({ data, interval, onIntervalChange, isLoading = false }: PriceChartProps) => {
  // Find min and max values for the domain
  const minPrice = Math.min(...data.map(d => parseFloat(d.priceUsd)));
  const maxPrice = Math.max(...data.map(d => parseFloat(d.priceUsd)));
  const minTime = data.length > 0 ? Math.min(...data.map(d => d.time)) : Date.now() - 24 * 60 * 60 * 1000;
  const maxTime = data.length > 0 ? Math.max(...data.map(d => d.time)) : Date.now();

  // Get rounded domain based on price range
  const getRoundedDomain = (min: number, max: number) => {
    const range = max - min;
    let step: number;

    // Adjust step size based on price range
    if (max <= 50) {
      if (range <= 1) step = 0.1;
      else if (range <= 5) step = 0.5;
      else if (range <= 10) step = 1;
      else step = 5;
    } else {
      if (range > 100000) step = 100000;
      else if (range > 10000) step = 10000;
      else if (range > 1000) step = 1000;
      else if (range > 100) step = 100;
      else step = 50;
    }

    const roundedMin = Math.floor(min / step) * step;
    const roundedMax = Math.ceil(max / step) * step;

    return [roundedMin, roundedMax];
  };

  const [yMin, yMax] = getRoundedDomain(minPrice, maxPrice);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={interval}
          onValueChange={(value) => value && onIntervalChange(value as TimeInterval)}
          className="brutal-border bg-brutal-white p-1"
        >
          {TIME_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="brutal-hover px-3 py-1 data-[state=on]:bg-brutal-yellow"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="h-[400px] w-full brutal-border bg-brutal-white p-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              domain={[minTime, maxTime]}
              tickFormatter={(time: number) => {
                const date = new Date(time);
                if (interval === "d1") {
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                if (interval === "d5") {
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
                }
                if (interval === "m1" || interval === "m3") {
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }
                return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
              }}
              stroke="#000"
              type="number"
            />
            <YAxis
              domain={[yMin, yMax]}
              tickFormatter={(num: number) => {
                if (num >= 1000) {
                  return `$${num.toLocaleString()}`;
                }
                // For values under 1000, show more decimal places for better precision
                return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
              }}
              stroke="#000"
              width={75}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = parseFloat(payload[0].value as string);
                  const time = payload[0].payload.time as number;
                  return (
                    <div className="brutal-border bg-brutal-white p-2">
                      <p className="font-mono">
                        ${value.toLocaleString(undefined, {
                          minimumFractionDigits: value < 1000 ? 2 : 0,
                          maximumFractionDigits: value < 1000 ? 4 : 2
                        })}
                      </p>
                      <p className="font-mono text-sm">
                        {new Date(time).toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="priceUsd"
              stroke="#000"
              fill="#EFD81D"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-brutal-white bg-opacity-80">
            <div className="w-12 h-12 border-4 border-brutal-black border-t-brutal-yellow rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;