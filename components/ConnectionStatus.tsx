"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  isPublishing?: boolean;
  listenerCount?: number;
  error?: string | null;
  className?: string;
}

export default function ConnectionStatus({
  isConnected,
  isPublishing = false,
  listenerCount = 0,
  error,
  className = "",
}: ConnectionStatusProps) {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected) {
      // Simple latency measurement
      const start = Date.now();
      fetch("/api/health")
        .then(() => {
          setLatency(Date.now() - start);
        })
        .catch(() => {
          setLatency(null);
        });
    }
  }, [isConnected]);

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <WifiOff className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) return "Error";
    if (isConnected) return "Connected";
    return "Disconnected";
  };

  const getStatusColor = () => {
    if (error) return "text-red-600";
    if (isConnected) return "text-green-600";
    return "text-gray-500";
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>

      {isConnected && latency && (
        <span className="text-xs text-gray-500">• {latency}ms</span>
      )}

      {isPublishing && (
        <span className="text-xs text-blue-600 font-medium">
          • Broadcasting
        </span>
      )}

      {listenerCount > 0 && (
        <span className="text-xs text-gray-600">
          • {listenerCount} listener{listenerCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
