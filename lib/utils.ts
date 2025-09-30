import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomSlug(): string {
  const adjectives = [
    "silent",
    "quiet",
    "peaceful",
    "calm",
    "serene",
    "tranquil",
    "gentle",
    "soft",
    "mellow",
    "smooth",
    "easy",
    "gentle",
  ];
  const nouns = [
    "room",
    "space",
    "zone",
    "area",
    "place",
    "corner",
    "spot",
    "nook",
    "haven",
    "retreat",
    "sanctuary",
    "chamber",
  ];

  const randomNum = Math.floor(Math.random() * 100);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}-${noun}-${randomNum}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getAudioLevelColor(level: number): string {
  if (level < 0.1) return "bg-gray-400";
  if (level < 0.3) return "bg-yellow-400";
  if (level < 0.6) return "bg-orange-400";
  return "bg-red-400";
}
