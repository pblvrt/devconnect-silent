# Silent Room - Deployment Guide

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template and configure your LiveKit Cloud credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your LiveKit Cloud credentials:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### 3. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Vercel

Add these in your Vercel project settings:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_LIVEKIT_URL`
- `NEXT_PUBLIC_APP_BASE_URL` (your Vercel domain)

## 🔧 LiveKit Cloud Setup

1. **Create LiveKit Cloud Account**

   - Visit [cloud.livekit.io](https://cloud.livekit.io)
   - Sign up and create a new project

2. **Get Credentials**

   - Copy your LiveKit URL (e.g., `wss://your-project.livekit.cloud`)
   - Copy your API Key and Secret from project settings

3. **Configure Audio Settings**
   - Audio-only streaming (no video)
   - Opus codec at 48kHz mono
   - Target bitrate: 32-64 kbps
   - DTX enabled for silence

## 📱 Usage

### For Broadcasters

1. Visit the homepage
2. Enter room name (optional) or click "Start Broadcasting"
3. Allow microphone access
4. Click "Start Broadcasting"
5. Click "Open QR Screen for Projection" to open a full-screen display
6. Project the QR screen for your audience to scan

### For Listeners

1. Scan QR code or visit room URL
2. Audio starts automatically
3. Use play/pause and volume controls

## 🛠️ Troubleshooting

### Common Issues

**Microphone not working:**

- Check browser permissions
- Ensure HTTPS in production
- Test with different browsers

**Connection failed:**

- Verify LiveKit credentials
- Check network connectivity
- Ensure LiveKit Cloud is active

**Audio not playing:**

- Check autoplay policies (iOS Safari)
- Ensure user interaction for first play
- Test with different devices

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📊 Performance

- **Latency:** <300ms end-to-end
- **Join Time:** <5 seconds
- **Concurrent Users:** 500+ per room
- **Audio Quality:** Opus 48kHz mono, 32-64 kbps

## 🔒 Security

- Server-side token signing only
- Publisher tokens: 4-hour TTL
- Listener tokens: 2-hour TTL
- No persistent data storage
- Randomized room slugs

## 📈 Monitoring

The application includes:

- Real-time listener count
- Audio level monitoring
- Connection status indicators
- Error handling and user feedback

## 🎯 Success Metrics

- ✅ Listener join time < 5 seconds
- ✅ Latency < 300ms end-to-end
- ✅ Support 500+ concurrent listeners
- ✅ 95% users join without technical support
- ✅ Cross-platform browser compatibility

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Verify LiveKit Cloud status
4. Test with different devices/browsers

---

**Silent Room** - Simple, scalable audio streaming for events and conferences.
