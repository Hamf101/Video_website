'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Network connection information from the Network Information API.
 * Falls back to "4g" when the API is unavailable.
 */
export interface ConnectionInfo {
  /** Effective connection type: "slow-2g" | "2g" | "3g" | "4g". */
  effectiveType: string;
  /** Whether the user has requested reduced data usage. */
  saveData: boolean;
  /** Estimated downlink speed in Mbps. */
  downlink: number;
  /** Whether this is a slow connection (3g or worse). */
  isSlow: boolean;
  /** Whether this is an ultra-slow connection (2g or worse). */
  isUltraSlow: boolean;
}

/**
 * Extended Navigator interface with Network Information API.
 * The API is experimental and not available in all browsers.
 */
interface NetworkInformation extends EventTarget {
  effectiveType: string;
  saveData: boolean;
  downlink: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

const DEFAULT_CONNECTION: ConnectionInfo = {
  effectiveType: '4g',
  saveData: false,
  downlink: 10,
  isSlow: false,
  isUltraSlow: false,
};

/**
 * Hook that detects the user's network connection quality.
 * Uses the Network Information API when available, falls back to "4g".
 *
 * @returns ConnectionInfo object with connection speed details.
 *
 * @example
 * ```tsx
 * const { isSlow, isUltraSlow } = useConnection();
 * // Show lightweight content on slow connections
 * ```
 */
export function useConnection(): ConnectionInfo {
  const [connection, setConnection] = useState<ConnectionInfo>(DEFAULT_CONNECTION);

  const updateConnection = useCallback(() => {
    const nav = navigator as NavigatorWithConnection;
    if (!nav.connection) return;

    const { effectiveType, saveData, downlink } = nav.connection;
    const isSlow = effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g' || saveData;
    const isUltraSlow = effectiveType === '2g' || effectiveType === 'slow-2g';

    setConnection({ effectiveType, saveData, downlink, isSlow, isUltraSlow });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateConnection();

    const nav = navigator as NavigatorWithConnection;
    if (nav.connection) {
      nav.connection.addEventListener('change', updateConnection);
      return () => nav.connection?.removeEventListener('change', updateConnection);
    }
  }, [updateConnection]);

  return connection;
}
