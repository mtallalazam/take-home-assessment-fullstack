import { formatTimestamp } from "../utils/formatters";

interface Alert {
    id: string;
    message: string;
    severity: string;
    timestamp: string;
}

interface ActiveAlertsSummaryProps {
    alerts: Alert[];
    loading: boolean;
    error: string | null;
}

const severityColors: Record<string, string> = {
    critical: "bg-red-600 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-400 text-yellow-900",
    low: "bg-blue-100 text-blue-800",
};

const ActiveAlertsSummary = ({
    alerts,
    loading,
    error,
}: ActiveAlertsSummaryProps) => {
    if (loading)
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <div className="flex justify-between gap-2">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );

    if (error)
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load alerts</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🚨 Active Alerts</h2>
            <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                    <div
                        key={alert.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-gray-900 dark:text-white">{alert.message}</p>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                                    severityColors[alert.severity] ??
                                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                            >
                                {alert.severity}
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {formatTimestamp(alert.timestamp)}
                        </div>
                    </div>
                ))}
                {alerts.slice(0, 5).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No active alerts</p>
                )}
            </div>
        </div>
    );
};

export default ActiveAlertsSummary;
