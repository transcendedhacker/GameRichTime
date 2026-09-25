/**
 * Formatting utilities for financial simulation & empire stats
 */

export function formatCurrency(amount: number, forceCompact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (forceCompact || abs >= 1_000_000_000_000) {
    if (abs >= 1_000_000_000_000) {
      return `${sign}$${(abs / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (abs >= 1_000_000_000) {
      return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    }
    if (abs >= 100_000) {
      return `${sign}$${(abs / 1_000).toFixed(1)}K`;
    }
  }

  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 10_000) {
    return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  }

  return `${sign}$${Math.round(abs).toLocaleString('en-US')}`;
}

export function formatExactCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }
  return '$' + Math.floor(amount).toLocaleString('en-US');
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString('en-US');
}

export const formatCompactNumber = formatNumber;

export function formatPercent(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ${Math.floor(seconds % 60)}s`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}
