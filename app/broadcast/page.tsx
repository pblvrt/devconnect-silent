"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Room,
  RoomEvent,
  Track,
  LocalAudioTrack,
  createLocalAudioTrack,
} from "livekit-client";
import { QRCodeSVG } from "qrcode.react";
import { Mic, MicOff, Volume2, Users, Copy, Check, QrCode, ExternalLink } from "lucide-react";

export default function BroadcastPage() {
  const searchParams = useSearchParams();
  const roomSlug = searchParams.get("room") || "default-room";

  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [copied, setCopied] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const audioTrackRef = useRef<LocalAudioTrack | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";
  const listenerUrl = `${baseUrl}/r/${roomSlug}`;
  const qrUrl = `${baseUrl}/qr/${roomSlug}`;

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const connectToRoom = async () => {
    try {
      const response = await fetch(
        `/api/token?room=${roomSlug}&role=publisher`
      );
      const { token } = await response.json();

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        console.log("Connected to room");
        setIsConnected(true);
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from room");
        setIsConnected(false);
        setIsPublishing(false);
      });

      room.on(RoomEvent.ParticipantConnected, () => {
        setListenerCount(room.numParticipants - 1); // Subtract 1 for the broadcaster
      });

      room.on(RoomEvent.ParticipantDisconnected, () => {
        setListenerCount(room.numParticipants - 1);
      });

      await room.connect(
        process.env.NEXT_PUBLIC_LIVEKIT_URL ||
          "wss://your-livekit.livekit.cloud",
        token
      );
    } catch (error) {
      console.error("Failed to connect to room:", error);
      alert(
        "Failed to connect to room. Please check your LiveKit configuration."
      );
    }
  };

  const startPublishing = async () => {
    if (!roomRef.current || isPublishing) return;

    try {
      const audioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });

      audioTrackRef.current = audioTrack;
      await roomRef.current.localParticipant.publishTrack(audioTrack);
      setIsPublishing(true);

      // Set up audio level monitoring
      setupAudioLevelMonitoring(audioTrack);
    } catch (error) {
      console.error("Failed to start publishing:", error);
      alert(
        "Failed to start publishing audio. Please check your microphone permissions."
      );
    }
  };

  const stopPublishing = async () => {
    if (!roomRef.current || !audioTrackRef.current || !isPublishing) return;

    try {
      await roomRef.current.localParticipant.unpublishTrack(
        audioTrackRef.current
      );
      audioTrackRef.current.stop();
      audioTrackRef.current = null;
      setIsPublishing(false);
      setAudioLevel(0);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } catch (error) {
      console.error("Failed to stop publishing:", error);
    }
  };

  const setupAudioLevelMonitoring = (track: LocalAudioTrack) => {
    const stream = track.mediaStream;
    if (!stream) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateAudioLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255);

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(listenerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const openQRCodeScreen = () => {
    window.open(qrUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes");
  };

  const disconnect = async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setIsConnected(false);
    setIsPublishing(false);
    setListenerCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Broadcast Room</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Audio Controls
                </h2>

                {!isConnected ? (
                  <button
                    onClick={connectToRoom}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Connect to Room
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={
                          isPublishing ? stopPublishing : startPublishing
                        }
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                          isPublishing
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isPublishing ? (
                          <MicOff className="h-5 w-5" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                        <span>
                          {isPublishing
                            ? "Stop Broadcasting"
                            : "Start Broadcasting"}
                        </span>
                      </button>
                    </div>

                    {isPublishing && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            Audio Level
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-100"
                            style={{ width: `${audioLevel * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={disconnect}
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Room Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Listeners: {listenerCount}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={listenerUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      QR Code Screen
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={qrUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                      />
                      <button
                        onClick={openQRCodeScreen}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Open this URL on a projector or second screen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Share with Listeners
              </h2>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  value={listenerUrl}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Scan this QR code to join the audio stream
              </p>
              
              {/* QR Code Screen Button */}
              <button
                onClick={openQRCodeScreen}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                <span>Open QR Screen for Projection</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
