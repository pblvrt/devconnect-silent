"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, AlertTriangle, CheckCircle } from "lucide-react";

interface AudioPermissionPromptProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

export default function AudioPermissionPrompt({
  onPermissionGranted,
  onPermissionDenied,
}: AudioPermissionPromptProps) {
  const [permissionState, setPermissionState] = useState<
    "checking" | "granted" | "denied" | "prompt"
  >("checking");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        setPermissionState(result.state as any);

        if (result.state === "granted") {
          onPermissionGranted();
        } else if (result.state === "denied") {
          onPermissionDenied();
        }
      } else {
        // Fallback for browsers that don't support permissions API
        setPermissionState("prompt");
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      setPermissionState("prompt");
    }
  };

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop());
      setPermissionState("granted");
      onPermissionGranted();
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setPermissionState("denied");
      onPermissionDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  if (permissionState === "checking") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (permissionState === "granted") {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Microphone access granted</span>
      </div>
    );
  }

  if (permissionState === "denied") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Microphone access denied
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Please enable microphone access in your browser settings to
              broadcast audio.
            </p>
            <div className="mt-3 text-xs text-red-600">
              <p>To fix this:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Click the microphone icon in your browser's address bar</li>
                <li>Select "Allow" for microphone access</li>
                <li>Refresh the page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Mic className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Microphone access required
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            We need access to your microphone to broadcast audio to listeners.
          </p>
          <button
            onClick={requestPermission}
            disabled={isRequesting}
            className="mt-3 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRequesting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Mic className="h-4 w-4" />
            )}
            <span>
              {isRequesting ? "Requesting..." : "Allow Microphone Access"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
