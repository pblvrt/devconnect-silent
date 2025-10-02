"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteAudioTrack,
} from "livekit-client";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import ConnectionStatus from "@/components/ConnectionStatus";
import { useReconnection } from "@/hooks/useReconnection";

export default function ListenerPage() {
  const params = useParams();
  const roomSlug = params.room as string;

  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [error, setError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    connectToRoom();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, [roomSlug]);

  // Detect iOS for autoplay hinting
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      const iOSLike = /iPhone|iPad|iPod|iOS|Macintosh;.*Mobile/.test(ua);
      setIsIOS(iOSLike);
    }
  }, []);

  const connectToRoom = async () => {
    try {
      setConnectionStatus("connecting");
      setError(null);

      const response = await fetch(`/api/token?room=${roomSlug}&role=listener`);
      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const { token } = await response.json();

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        console.log("Connected to room");
        setIsConnected(true);
        setConnectionStatus("connected");
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from room");
        setIsConnected(false);
        setConnectionStatus("disconnected");
        setIsPlaying(false);
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === "audio") {
          const audioElement = track.attach();
          audioElementRef.current = audioElement;
          audioElement.volume = volume;
          audioElement.muted = isMuted;

          // Do not autoplay on mobile; wait for explicit user interaction
          setIsPlaying(false);
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        if (track.kind === "audio") {
          track.detach();
          setIsPlaying(false);
        }
      });

      room.on(
        RoomEvent.ParticipantConnected,
        (participant: RemoteParticipant) => {
          console.log("Participant connected:", participant.identity);
        }
      );

      room.on(
        RoomEvent.ParticipantDisconnected,
        (participant: RemoteParticipant) => {
          console.log("Participant disconnected:", participant.identity);
        }
      );

      await room.connect(
        process.env.NEXT_PUBLIC_LIVEKIT_URL ||
          "wss://your-livekit.livekit.cloud",
        token
      );
    } catch (error) {
      console.error("Failed to connect to room:", error);
      setError(
        "Failed to connect to the audio stream. Please check the room URL."
      );
      setConnectionStatus("disconnected");
    }
  };

  const togglePlayPause = async () => {
    if (!audioElementRef.current) return;

    try {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioElementRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to toggle play/pause:", error);
    }
  };

  const toggleMute = () => {
    if (!audioElementRef.current) return;

    const newMuted = !isMuted;
    audioElementRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioElementRef.current) return;

    audioElementRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Silent Room</h1>
            <p className="text-sm text-gray-600">Room: {roomSlug}</p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {getStatusIcon()}
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Audio Controls */}
          {isConnected && (
            <div className="space-y-6">
              {!isPlaying && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 text-center">
                    Tap the button below to start listening
                    {isIOS ? ". On iOS, media playback requires a tap." : "."}
                  </p>
                </div>
              )}
              {/* Play/Pause Button */}
              <div className="flex justify-center">
                <button
                  onClick={togglePlayPause}
                  disabled={!isConnected}
                  className={`h-16 w-16 rounded-full flex items-center justify-center text-white transition-colors ${
                    isPlaying
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </button>
              </div>

              {/* Volume Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Volume
                  </span>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{Math.round(volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isConnected && !error && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Waiting for the broadcaster to start...
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              No app required • Works in any browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
