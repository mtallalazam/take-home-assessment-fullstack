import { useState, ReactNode } from "react";

export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    className?: string;
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    loading?: boolean;
    emptyMessage?: string;
    skeletonRows?: number;
}

type SortDirection = "asc" | "desc";

const Table = <T extends Record<string, any>>({
    columns,
    data,
    keyExtractor,
    loading = false,
    emptyMessage = "📭 No data found",
    skeletonRows = 8,
}: TableProps<T>) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("desc");
        }
    };

    const getSortIcon = (columnKey: string) => {
        if (sortColumn !== columnKey) return "↕️";
        return sortDirection === "asc" ? "⬆️" : "⬇️";
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        // Handle different types
        if (typeof aVal === "string" && typeof bVal === "string") {
            const modifier = sortDirection === "asc" ? 1 : -1;
            return aVal.localeCompare(bVal) * modifier;
        }
        
        if (typeof aVal === "number" && typeof bVal === "number") {
            const modifier = sortDirection === "asc" ? 1 : -1;
            return (aVal - bVal) * modifier;
        }
        
        return 0;
    });

    if (loading) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm animate-pulse">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                            {columns.map((col, i) => (
                                <th key={i} className="py-3 px-4 text-left">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: skeletonRows }).map((_, i) => (
                            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                                {columns.map((_, j) => (
                                    <td key={j} className="py-3 px-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`py-3 px-4 text-gray-900 dark:text-gray-100 ${
                                    col.sortable
                                        ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        : ""
                                }`}
                                onClick={
                                    col.sortable
                                        ? () => handleSort(col.key)
                                        : undefined
                                }
                            >
                                {col.header}{" "}
                                {col.sortable && getSortIcon(col.key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`py-3 px-4 text-gray-900 dark:text-gray-100 ${col.className ?? ""}`}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : item[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedData.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">{emptyMessage}</p>
            )}
        </div>
    );
};

export default Table;
