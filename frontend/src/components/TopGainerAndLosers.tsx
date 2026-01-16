import { formatCurrency, formatPercent } from "../utils/formatters";

interface Asset {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    changePercent: number;
}

interface TopGainersAndLosersProps {
    topGainers: Asset[];
    topLosers: Asset[];
    loading: boolean;
    error: string | null;
}

const TopGainersAndLosers = ({
    topGainers,
    topLosers,
    loading,
    error,
}: TopGainersAndLosersProps) => {
    if (loading)
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="flex justify-between">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

    if (error)
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load market data</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            </div>
        );

    const AssetRow = ({ asset }: { asset: Asset }) => (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="py-2 px-3 font-semibold text-gray-900 dark:text-white">{asset.symbol}</td>
            <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{asset.name}</td>
            <td className="py-2 px-3 text-gray-900 dark:text-white">{formatCurrency(asset.currentPrice)}</td>
            <td
                className={`py-2 px-3 font-medium ${
                    asset.changePercent > 0
                        ? "text-green-500"
                        : asset.changePercent < 0
                        ? "text-red-500"
                        : "text-gray-900 dark:text-white"
                }`}
            >
                {formatPercent(asset.changePercent)}
            </td>
        </tr>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-hidden">
                <h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
                    📈 Top Gainers
                </h2>
                <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full text-sm min-w-[400px]">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600 text-left">
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Symbol</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Name</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Price</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topGainers.slice(0, 3).map((asset) => (
                            <AssetRow key={asset.id} asset={asset} />
                        ))}
                    </tbody>
                    </table>
                </div>
                {topGainers.slice(0, 3).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No gainers found</p>
                )}
            </div>

            {/* Top Losers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-hidden">
                <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
                    📉 Top Losers
                </h2>
                <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full text-sm min-w-[400px]">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600 text-left">
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Symbol</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Name</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Price</th>
                            <th className="py-2 px-3 text-gray-900 dark:text-gray-100">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topLosers.slice(0, 3).map((asset) => (
                            <AssetRow key={asset.id} asset={asset} />
                        ))}
                    </tbody>
                    </table>
                </div>
                {topLosers.slice(0, 3).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No losers found</p>
                )}
            </div>
        </div>
    );
};

export default TopGainersAndLosers;
