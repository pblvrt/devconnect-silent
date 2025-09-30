"use client";

import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  showHelp?: boolean;
  className?: string;
}

export default function ErrorMessage({
  error,
  onRetry,
  showHelp = true,
  className = "",
}: ErrorMessageProps) {
  const getErrorInfo = (error: string) => {
    if (error.includes("Failed to connect")) {
      return {
        title: "Connection Failed",
        description:
          "Unable to connect to the audio stream. This could be due to network issues or the broadcaster may have stopped streaming.",
        solutions: [
          "Check your internet connection",
          "Make sure the broadcaster is still streaming",
          "Try refreshing the page",
        ],
      };
    }

    if (error.includes("token")) {
      return {
        title: "Authentication Error",
        description:
          "There was an issue with the access token. This usually means the room has expired or the URL is incorrect.",
        solutions: [
          "Check if the room URL is correct",
          "Ask the broadcaster for a new QR code",
          "Try scanning the QR code again",
        ],
      };
    }

    if (error.includes("audio")) {
      return {
        title: "Audio Error",
        description:
          "There was an issue playing the audio stream. This could be due to browser restrictions or audio codec issues.",
        solutions: [
          "Try a different browser (Chrome, Firefox, Safari)",
          "Check if your device volume is turned up",
          "Make sure autoplay is allowed in your browser",
        ],
      };
    }

    return {
      title: "Something went wrong",
      description: error,
      solutions: [
        "Try refreshing the page",
        "Check your internet connection",
        "Try a different browser",
      ],
    };
  };

  const errorInfo = getErrorInfo(error);

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {errorInfo.title}
          </h3>
          <p className="text-sm text-red-700 mb-3">{errorInfo.description}</p>

          {showHelp && (
            <div className="mb-3">
              <p className="text-xs font-medium text-red-800 mb-2">
                Try these solutions:
              </p>
              <ul className="text-xs text-red-700 space-y-1">
                {errorInfo.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Try Again</span>
              </button>
            )}

            <a
              href="https://help.livekit.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              <span>Get Help</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
