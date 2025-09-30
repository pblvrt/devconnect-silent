Silent Room – Product Requirements Document (PRD)

1. Overview

Silent Room is a simple, scalable audio streaming solution built on LiveKit. It allows a single source (e.g., a computer or media device) to stream live audio to many listeners. Attendees join by scanning a QR code, instantly accessing the stream from their mobile or desktop browser, with no app installation required.

Use case: conference silent rooms, museum audio guides, silent discos, or temporary event spaces.

⸻

2. Goals & Objectives
	•	One-to-Many Audio Streaming: Enable a single device to broadcast high-quality audio to potentially hundreds of listeners.
	•	Frictionless Access: Make joining as easy as scanning a QR code and opening a browser link.
	•	Low Latency & Reliability: Deliver near real-time audio with minimal delay.
	•	Cross-Platform: Support modern mobile and desktop browsers (Safari, Chrome, Firefox, Edge).
	•	Simple Management: Allow the streaming computer to create/manage a room with minimal setup.

⸻

3. Key Features

3.1 Broadcaster
	•	Desktop app or web-based broadcaster that:
	•	Captures audio input (mic, line-in, or system audio).
	•	Connects to LiveKit and creates a new room.
	•	Generates a unique session URL + QR code.

3.2 Listener
	•	Browser-based player:
	•	Open via QR code or link.
	•	Auto-joins the LiveKit room as a listener (receive-only).
	•	Simple UI: play/pause, volume control.
	•	No account creation required.

3.3 QR Code System
	•	Each room generates a unique QR code.
	•	QR code encodes a short link (e.g., silentroom.app/r/12345).
	•	Optional branding/custom event link.

3.4 Admin Controls
	•	Start/stop stream.
	•	Mute/unmute broadcaster.
	•	View listener count.
	•	Optional: password-protect rooms.

3.5 Scalability & Reliability
	•	LiveKit handles audio distribution.
	•	Listeners connect via SFU (Selective Forwarding Unit) for efficiency.
	•	Designed to support 100s of concurrent listeners per room.

⸻

4. User Flow

Broadcaster Flow
	1.	Open broadcaster app/web page.
	2.	Select audio input source.
	3.	Click “Start Stream.”
	4.	System creates LiveKit room + QR code.
	5.	Share QR code (project on screen, print, etc.).

Listener Flow
	1.	Scan QR code.
	2.	Link opens in browser.
	3.	Automatically connects to the LiveKit room as a listener.
	4.	User hears live audio.

⸻

5. Non-Goals
	•	Video streaming (audio-only for simplicity).
	•	Multi-speaker support (initially one broadcaster per room).
	•	Chat or interactivity (optional later).

⸻

6. Technical Requirements
	•	Frontend:
	•	Browser-based player (React/Vanilla JS with LiveKit SDK).
	•	Broadcaster app (Electron, or web with system audio capture).
	•	Backend:
	•	LiveKit server for media routing.
	•	API to create/manage rooms, generate links/QR codes.
	•	Authentication: simple token-based for broadcasters, anonymous for listeners.
	•	Deployment:
	•	Cloud-hosted LiveKit cluster (scalable).
	•	Custom domain for short links.

⸻

7. Success Metrics
	•	Listener join time < 5 seconds.
	•	Latency < 300ms end-to-end.
	•	Support 500 concurrent listeners per room with no audio dropouts.
	•	95% of users able to join without technical support.