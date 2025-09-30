"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Users, Wifi } from "lucide-react";

export default function Home() {
  const [roomSlug, setRoomSlug] = useState("");
  const router = useRouter();

  const generateRoomSlug = () => {
    const adjectives = [
      "silent",
      "quiet",
      "peaceful",
      "calm",
      "serene",
      "tranquil",
    ];
    const nouns = ["room", "space", "zone", "area", "place", "corner"];
    const randomNum = Math.floor(Math.random() * 100);

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj}-${noun}-${randomNum}`;
  };

  const handleCreateRoom = () => {
    const slug = roomSlug.trim() || generateRoomSlug();
    router.push(`/broadcast?room=${encodeURIComponent(slug)}`);
  };

  const handleJoinRoom = () => {
    if (roomSlug.trim()) {
      router.push(`/r/${encodeURIComponent(roomSlug.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Silent Room</h2>
          <p className="mt-2 text-sm text-gray-600">
            Simple audio streaming for events and conferences
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="room-slug"
              className="block text-sm font-medium text-gray-700"
            >
              Room Name (optional)
            </label>
            <input
              id="room-slug"
              type="text"
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value)}
              placeholder="e.g., conference-room-1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCreateRoom}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Broadcasting
            </button>

            <button
              onClick={handleJoinRoom}
              disabled={!roomSlug.trim()}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Join Room
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How it works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Broadcast:</strong> Start a room and share the QR
                    code with your audience
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Listen:</strong> Scan the QR code to join and listen
                    to the live audio
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wifi className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>No app required:</strong> Works in any modern
                    browser
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
