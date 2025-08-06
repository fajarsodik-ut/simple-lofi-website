# 🎵 Simple Lo-Fi Music Player

A beautiful, minimalist lo-fi music player built with React and Vite.

## ✨ Features

- 🎵 Automatic audio file detection
- ⏯️ Play/pause with dynamic icons
- ⏭️ Next/previous track navigation
- 🔄 Auto-play next track on completion
- 📊 Progress bar with seek functionality
- ⏱️ Time display and track information
- 📱 Responsive design
- 🎨 Beautiful anime-inspired aesthetic

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 🎶 Adding New Music

### Method 1: Automatic Detection (Recommended)

1. Add your audio files (`.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`) to the `public/assets/sound/` directory

2. Run the playlist generator:

   ```bash
   npm run playlist
   ```

3. Refresh your browser - the new songs will be automatically loaded!

### Method 2: Manual Addition

You can also manually add files by placing them in `public/assets/sound/` and the player will attempt to discover them automatically.

## 📁 Project Structure

```
simple-lofi-website/
├── public/
│   └── assets/
│       └── sound/          # Place your audio files here
├── src/
│   ├── components/
│   │   ├── Background.jsx  # Animated background
│   │   └── Player.jsx      # Music player component
│   ├── App.jsx            # Main app component
│   ├── App.css            # Styles
│   └── playlist.json      # Auto-generated playlist
├── generate-playlist.cjs   # Playlist generator script
└── package.json
```

## 🎨 Customization

- **Background**: Modify `src/components/Background.jsx` to change the background image/GIF
- **Styling**: Edit `src/App.css` to customize the appearance
- **Fonts**: The player uses 'VT323' for titles and 'Inter' for body text

## 🔧 Supported Audio Formats

- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)
- M4A (`.m4a`)
- AAC (`.aac`)

## 📝 Notes

- When you add new audio files, run `npm run playlist` to update the playlist
- The player will automatically detect and play all audio files in the `/public/assets/sound/` directory
- Files are played in the order they appear in the generated playlist
- The player remembers the current track position and continues from where you left off

Enjoy your lo-fi vibes! 🎧✨
