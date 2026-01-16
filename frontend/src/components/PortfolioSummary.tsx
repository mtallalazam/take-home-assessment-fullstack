import { useEffect, useState } from "react";
import { formatCurrency, formatPercent } from "../utils/formatters";

interface PortfolioData {
    totalValue: number;
    totalChange: number;
    totalChangePercent: number;
}

interface PortfolioTotals {
    total: number;
    change: number;
    percent: number;
}

const computeTotals = (data: PortfolioData | null): PortfolioTotals | null => {
    if (!data || typeof data.totalValue !== "number") return null;

    return {
        total: data.totalValue,
        change: data.totalChange ?? 0,
        percent: data.totalChangePercent ?? 0,
    };
};

const PortfolioSummary = () => {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch("/api/portfolio");
                if (!response.ok) throw new Error("Failed to fetch portfolio");
                const data = await response.json();
                // API returns { success: true, data: ... }
                setPortfolio(data && data.data ? data.data : data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    if (loading)
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
        );

    if (error)
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load portfolio</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            </div>
        );

    const totals = computeTotals(portfolio);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💼 Portfolio Summary</h2>
            {totals ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">💰 Total Value</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(totals.total)}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">📈 Change</div>
                        <div
                            className={`text-xl font-bold ${
                                totals.change > 0
                                    ? "text-green-500"
                                    : totals.change < 0
                                    ? "text-red-500"
                                    : "text-gray-900 dark:text-white"
                            }`}
                        >
                            {formatCurrency(totals.change)}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">📊 Percentage</div>
                        <div
                            className={`text-xl font-bold ${
                                totals.percent > 0
                                    ? "text-green-500"
                                    : totals.percent < 0
                                    ? "text-red-500"
                                    : "text-gray-900 dark:text-white"
                            }`}
                        >
                            {formatPercent(totals.percent)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 dark:text-gray-400">📭 No summary available for this portfolio response.</div>
            )}
        </div>
    );
};

export default PortfolioSummary;
