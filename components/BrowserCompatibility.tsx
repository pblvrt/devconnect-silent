"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  issues: string[];
}

export default function BrowserCompatibility() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkBrowser = () => {
      const userAgent = navigator.userAgent;
      let browserName = "Unknown";
      let browserVersion = "0";
      let isSupported = false;
      let issues: string[] = [];

      // Chrome
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        browserName = "Chrome";
        const match = userAgent.match(/Chrome\/(\d+)/);
        browserVersion = match ? match[1] : "0";
        isSupported = parseInt(browserVersion) >= 60;
        if (!isSupported) {
          issues.push(
            "Chrome version too old. Please update to Chrome 60 or newer."
          );
        }
      }
      // Firefox
      else if (userAgent.includes("Firefox")) {
        browserName = "Firefox";
        const match = userAgent.match(/Firefox\/(\d+)/);
        browserVersion = match ? match[1] : "0";
        isSupported = parseInt(browserVersion) >= 55;
        if (!isSupported) {
          issues.push(
            "Firefox version too old. Please update to Firefox 55 or newer."
          );
        }
      }
      // Safari
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        browserName = "Safari";
        const match = userAgent.match(/Version\/(\d+)/);
        browserVersion = match ? match[1] : "0";
        isSupported = parseInt(browserVersion) >= 11;
        if (!isSupported) {
          issues.push(
            "Safari version too old. Please update to Safari 11 or newer."
          );
        }
        // Safari-specific issues
        issues.push(
          "Safari may require user interaction to start audio playback."
        );
      }
      // Edge
      else if (userAgent.includes("Edg")) {
        browserName = "Edge";
        const match = userAgent.match(/Edg\/(\d+)/);
        browserVersion = match ? match[1] : "0";
        isSupported = parseInt(browserVersion) >= 79;
        if (!isSupported) {
          issues.push(
            "Edge version too old. Please update to Edge 79 or newer."
          );
        }
      }
      // Other browsers
      else {
        browserName = "Unknown Browser";
        isSupported = false;
        issues.push(
          "This browser may not be fully supported. We recommend Chrome, Firefox, Safari, or Edge."
        );
      }

      // Check for required features
      if (!navigator.mediaDevices) {
        issues.push(
          "Media devices API not supported. Audio streaming may not work."
        );
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        issues.push(
          "Microphone access not supported. Broadcasting will not work."
        );
      }

      if (!window.RTCPeerConnection) {
        issues.push("WebRTC not supported. Audio streaming will not work.");
      }

      setBrowserInfo({
        name: browserName,
        version: browserVersion,
        isSupported,
        issues,
      });

      setShowWarning(!isSupported || issues.length > 0);
    };

    checkBrowser();
  }, []);

  if (!browserInfo || !showWarning) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Browser Compatibility Notice
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            You're using {browserInfo.name} {browserInfo.version}.
            {browserInfo.isSupported
              ? " This browser is supported."
              : " This browser may not work properly."}
          </p>

          {browserInfo.issues.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-yellow-800 mb-2">
                Potential issues:
              </p>
              <ul className="text-xs text-yellow-700 space-y-1">
                {browserInfo.issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <a
              href="https://www.google.com/chrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <span>Download Chrome</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://www.mozilla.org/firefox/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <span>Download Firefox</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
