import { useEffect, useState } from "react";
import Table, { Column } from "./Table";
import { formatCurrency, formatPercent, formatVolume } from "../utils/formatters";

interface Asset {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    changePercent: number;
    volume: number;
    type: "stock" | "crypto";
}

const columns: Column<Asset>[] = [
    {
        key: "symbol",
        header: "Symbol",
        render: (asset) => (
            <span className="font-semibold text-gray-900 dark:text-white">{asset.symbol}</span>
        ),
    },
    {
        key: "name",
        header: "Name",
        className: "text-gray-600 dark:text-gray-300",
    },
    {
        key: "type",
        header: "Type",
        render: (asset) => (
            <span
                className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    asset.type === "stock"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
            >
                {asset.type === "stock" ? "🏢" : "🪙"} {asset.type}
            </span>
        ),
    },
    {
        key: "currentPrice",
        header: "Price",
        sortable: true,
        render: (asset) => formatCurrency(asset.currentPrice),
    },
    {
        key: "changePercent",
        header: "Change",
        sortable: true,
        render: (asset) => (
            <span
                className={`font-medium ${
                    asset.changePercent > 0
                        ? "text-green-500"
                        : asset.changePercent < 0
                        ? "text-red-500"
                        : ""
                }`}
            >
                {formatPercent(asset.changePercent)}
            </span>
        ),
    },
    {
        key: "volume",
        header: "Volume",
        sortable: true,
        className: "text-gray-600 dark:text-gray-300",
        render: (asset) => formatVolume(asset.volume),
    },
];

const AssetsListTable = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [filter, setFilter] = useState<"all" | "stock" | "crypto">("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stocksRes, cryptoRes] = await Promise.all([
                    fetch("/api/assets/stocks"),
                    fetch("/api/assets/crypto"),
                ]);

                if (!stocksRes.ok) throw new Error("Failed to fetch stocks");
                if (!cryptoRes.ok) throw new Error("Failed to fetch crypto");

                const stocksData = await stocksRes.json();
                const cryptoData = await cryptoRes.json();

                const stocks = (stocksData?.data ?? []).map((s: any) => ({
                    ...s,
                    type: "stock",
                }));
                const crypto = (cryptoData?.data ?? []).map((c: any) => ({
                    ...c,
                    type: "crypto",
                }));

                setAssets([...stocks, ...crypto]);
            } catch (err: any) {
                setError(err?.message ?? String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-64"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={[]}
                    keyExtractor={(a) => a.id}
                    loading={true}
                />
            </div>
        );

    if (error)
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load assets</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            </div>
        );

    const searchLower = search.toLowerCase().trim();
    const filteredAssets = assets.filter((asset) => {
        const matchesType = filter === "all" || asset.type === filter;
        const matchesSearch =
            !searchLower ||
            asset.name.toLowerCase().includes(searchLower) ||
            asset.symbol.toLowerCase().includes(searchLower);
        return matchesType && matchesSearch;
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Search & Filter Controls */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name or symbol..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 sm:px-4 py-2 rounded font-medium text-sm flex-1 sm:flex-none ${
                            filter === "all"
                                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                        🌐 All
                    </button>
                    <button
                        onClick={() => setFilter("stock")}
                        className={`px-3 sm:px-4 py-2 rounded font-medium text-sm flex-1 sm:flex-none ${
                            filter === "stock"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                        }`}
                    >
                        🏢 Stocks
                    </button>
                    <button
                        onClick={() => setFilter("crypto")}
                        className={`px-3 sm:px-4 py-2 rounded font-medium text-sm flex-1 sm:flex-none ${
                            filter === "crypto"
                                ? "bg-yellow-500 text-white"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                        }`}
                    >
                        🪙 Crypto
                    </button>
                </div>
            </div>

            <Table
                columns={columns}
                data={filteredAssets}
                keyExtractor={(asset) => asset.id}
                emptyMessage="📭 No assets found"
            />
        </div>
    );
};

export default AssetsListTable;
