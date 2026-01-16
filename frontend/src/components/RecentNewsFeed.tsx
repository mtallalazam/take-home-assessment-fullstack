import { formatTimestamp } from "../utils/formatters";

interface NewsItem {
    id: string;
    title: string;
    source: string;
    timestamp: string;
    category: string;
}

interface RecentNewsFeedProps {
    news: NewsItem[];
    loading: boolean;
    error: string | null;
}

const categoryColors: Record<string, string> = {
    macro: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    technology: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    crypto: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    market: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    earnings: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    regulatory: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const RecentNewsFeed = ({ news, loading, error }: RecentNewsFeedProps) => {
    if (loading)
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <div className="flex justify-between gap-2">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mt-2"></div>
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
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load news</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📰 Recent News</h2>
            <div className="space-y-4">
                {news.slice(0, 5).map((item) => (
                    <div
                        key={item.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                {item.title}
                            </h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                                    categoryColors[item.category] ??
                                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                            >
                                {item.category}
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{formatTimestamp(item.timestamp)}</span>
                        </div>
                    </div>
                ))}
                {news.slice(0, 5).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No news found</p>
                )}
            </div>
        </div>
    );
};

export default RecentNewsFeed;
