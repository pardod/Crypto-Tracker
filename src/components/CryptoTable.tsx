import { Link } from "react-router-dom";
import { CryptoAsset } from "@/types/crypto";
import { formatLargeNumber } from "@/lib/formatNumber";

export interface CryptoTableProps {
  data: CryptoAsset[];
}

const CryptoTable = ({ data }: CryptoTableProps) => {
  return (
    <div className="brutal-border bg-brutal-white overflow-x-auto">
      <table className="w-full">
        <thead className="bg-brutal-yellow">
          <tr>
            <th className="p-4 text-left font-mono">Rank</th>
            <th className="p-4 text-left font-mono">Name</th>
            <th className="p-4 text-left font-mono">Price</th>
            <th className="p-4 text-left font-mono">24h Change</th>
            <th className="p-4 text-left font-mono">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((crypto) => (
            <tr
              key={crypto.id}
              className="border-t border-black hover:bg-gray-50"
            >
              <td className="p-4 font-mono">{crypto.rank}</td>
              <td className="p-4">
                <Link
                  to={`/crypto/${crypto.id}`}
                  className="flex items-center gap-2 hover:text-brutal-blue"
                >
                  <span className="font-bold">{crypto.name}</span>
                  <span className="text-gray-600 font-mono">
                    {crypto.symbol}
                  </span>
                </Link>
              </td>
              <td className="p-4 font-mono">
                ${parseFloat(crypto.priceUsd).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td
                className={`p-4 font-mono ${
                  parseFloat(crypto.changePercent24Hr) >= 0
                    ? "text-green-600"
                    : "text-brutal-red"
                }`}
              >
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
              <td className="p-4 font-mono">
                {formatLargeNumber(parseFloat(crypto.marketCapUsd))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;