/**
 * Utility functions for formatting values across the application
 */

/**
 * Format a number as USD currency
 */
export const formatCurrency = (n: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(n);

/**
 * Format a number as a percentage with +/- sign
 */
export const formatPercent = (n: number): string =>
    `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

/**
 * Format a large number with K/M/B suffixes
 */
export const formatVolume = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toLocaleString();
};

/**
 * Format an ISO timestamp as a human-readable date
 */
export const formatTimestamp = (ts: string): string => {
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
