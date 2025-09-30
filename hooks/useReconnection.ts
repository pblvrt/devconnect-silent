"use client";

import { useEffect, useRef, useState } from "react";

interface UseReconnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
  onReconnect?: () => void;
  onMaxRetriesReached?: () => void;
}

export function useReconnection({
  maxRetries = 5,
  retryDelay = 2000,
  onReconnect,
  onMaxRetriesReached,
}: UseReconnectionOptions = {}) {
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current >= maxRetries) {
      setIsReconnecting(false);
      onMaxRetriesReached?.();
      return;
    }

    setIsReconnecting(true);
    reconnectAttemptsRef.current += 1;
    setRetryCount(reconnectAttemptsRef.current);

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Attempt reconnection after delay
    retryTimeoutRef.current = setTimeout(() => {
      onReconnect?.();
    }, retryDelay);
  };

  const handleConnectionSuccess = () => {
    setIsConnected(true);
    setIsReconnecting(false);
    setRetryCount(0);
    reconnectAttemptsRef.current = 0;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  const handleConnectionFailure = () => {
    setIsConnected(false);
    attemptReconnect();
  };

  const reset = () => {
    setIsReconnecting(false);
    setRetryCount(0);
    reconnectAttemptsRef.current = 0;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    isReconnecting,
    retryCount,
    isConnected,
    attemptReconnect,
    handleConnectionSuccess,
    handleConnectionFailure,
    reset,
  };
}
