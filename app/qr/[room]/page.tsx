"use client";

import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Wifi, Volume2, Users } from "lucide-react";

export default function QRCodePage() {
  const params = useParams();
  const roomSlug = params.room as string;

  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";
  const listenerUrl = `${baseUrl}/r/${roomSlug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Silent Room
            </h1>
            <p className="text-xl text-gray-600 mb-4">Room: {roomSlug}</p>
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live Audio Stream</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                Scan to Join
              </h2>
              <div className="bg-white p-6 rounded-xl border-4 border-gray-200 shadow-lg">
                <QRCodeSVG
                  value={listenerUrl}
                  size={280}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Or visit:</p>
                <p className="text-xs text-gray-500 font-mono break-all">
                  {listenerUrl}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                How to Join
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Scan the QR Code
                    </h3>
                    <p className="text-gray-600">
                      Use your phone's camera to scan the QR code above
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Open in Browser
                    </h3>
                    <p className="text-gray-600">
                      The link will open automatically in your browser
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Start Listening
                    </h3>
                    <p className="text-gray-600">
                      Audio will start playing automatically
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">No app required</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Works on any device</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Volume controls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Live audio stream</span>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  Having trouble?
                </h3>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>• Make sure your phone's camera can scan QR codes</li>
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page if audio doesn't start</li>
                  <li>• Make sure your device volume is turned up</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Silent Room - Simple audio streaming for events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
