# Silent Room

A simple, scalable audio streaming solution built on LiveKit. Allows a single source to stream live audio to many listeners via QR code access.

## Features

- **One-to-Many Audio Streaming**: Single broadcaster to hundreds of listeners
- **Frictionless Access**: Join by scanning QR code, no app installation required
- **Low Latency**: Near real-time audio with minimal delay
- **Cross-Platform**: Works on modern mobile and desktop browsers
- **Simple Management**: Easy room creation and management

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Realtime**: LiveKit Cloud
- **Deployment**: Vercel
- **Audio**: WebRTC with Opus codec

## Quick Start

### 1. Prerequisites

- Node.js 18+
- LiveKit Cloud account
- Vercel account (for deployment)

### 2. Setup LiveKit Cloud

1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Note down your:
   - LiveKit URL (e.g., `wss://your-project.livekit.cloud`)
   - API Key
   - API Secret

### 3. Local Development

1. Clone and install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp env.example .env.local
```

3. Configure environment variables in `.env.local`:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

4. Start development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
   - `NEXT_PUBLIC_LIVEKIT_URL`
   - `NEXT_PUBLIC_APP_BASE_URL` (your Vercel domain)

## Usage

### For Broadcasters

1. Visit the homepage
2. Enter a room name (optional) or click "Start Broadcasting"
3. Allow microphone access when prompted
4. Click "Start Broadcasting" to begin streaming
5. Click "Open QR Screen for Projection" to open a full-screen QR code display
6. Project the QR screen for your audience to scan

### For Listeners

1. Scan the QR code or visit the room URL
2. Audio will start playing automatically
3. Use play/pause and volume controls as needed

## Architecture

```
[ Broadcaster Browser ] -- WebRTC publish --> [ LiveKit Cloud ]
                ^                                   |
                |  HTTPS (token)                    |  WebRTC subscribe
         [ Next.js API on Vercel ] <---------------- v
                ^                                     [ Listener Browser ]
                |
          QR URL/link
```

## API Routes

- `GET /api/token?room={slug}&role=publisher|listener` - Generate LiveKit access tokens

## Pages

- `/` - Landing page with room creation
- `/broadcast?room={slug}` - Broadcaster interface
- `/r/{slug}` - Listener interface
- `/qr/{slug}` - QR code screen for projection

## Configuration

### LiveKit Cloud Settings

- Audio-only streaming (no video)
- Opus codec at 48kHz mono
- Target bitrate: 32-64 kbps
- DTX enabled for silence

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security

- Tokens are signed server-side only
- Publisher tokens: 4-hour TTL
- Listener tokens: 2-hour TTL
- Room slugs are randomized
- No persistent data storage

## Performance

- Supports 500+ concurrent listeners per room
- <300ms end-to-end latency
- <5 second join time
- Automatic audio level monitoring

## Troubleshooting

### Common Issues

1. **Microphone not working**: Check browser permissions
2. **Connection failed**: Verify LiveKit credentials
3. **Audio not playing**: Check autoplay policies (iOS Safari)
4. **QR code not working**: Ensure correct base URL

### Browser Permissions

- Microphone access required for broadcasting
- Autoplay may require user interaction on some browsers

## License

MIT License - see LICENSE file for details.
