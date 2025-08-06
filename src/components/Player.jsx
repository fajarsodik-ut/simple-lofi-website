import React, { useState, useEffect, useRef } from 'react'
import playlistData from '../playlist.json'

const Player = () => {
  // State management
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [volume, setVolume] = useState(0.7) // Default volume at 70%
  const [isMuted, setIsMuted] = useState(false)

  // Audio reference
  const audioRef = useRef(null)

  // Function to automatically discover audio files
  const discoverAudioFiles = async () => {
    try {
      setIsLoading(true)
      
      // First, try to use the generated playlist
      if (playlistData && playlistData.length > 0) {
        const validFiles = []
        
        // Verify each file exists
        for (const audioPath of playlistData) {
          try {
            const audio = new Audio()
            audio.src = audioPath
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('timeout')), 3000)
              audio.addEventListener('canplaythrough', () => {
                clearTimeout(timeout)
                resolve()
              })
              audio.addEventListener('error', () => {
                clearTimeout(timeout)
                reject()
              })
              audio.load()
            })
            validFiles.push(audioPath)
          } catch (error) {
            console.log(`File not accessible: ${audioPath}`)
          }
        }
        
        if (validFiles.length > 0) {
          setPlaylist(validFiles)
          setIsLoading(false)
          console.log('✅ Loaded playlist from JSON:', validFiles)
          return
        }
      }
      
      // Fallback: Try common filenames
      const commonNames = [
        'Shadowverse_ Worlds Beyond OST - Infinity Evolved.mp3',
        'Shadowverse_ Worlds Beyond OST - Shadowverse Showdown.mp3',
        'Shadowverse_ Worlds Beyond OST - Abysscraft Diawl Theme.mp3',
        // Common lo-fi naming patterns
        'lofi-1.mp3', 'lofi-2.mp3', 'lofi-3.mp3', 'lofi-4.mp3', 'lofi-5.mp3',
        'chill-1.mp3', 'chill-2.mp3', 'chill-3.mp3', 'chill-4.mp3', 'chill-5.mp3',
        'relax-1.mp3', 'relax-2.mp3', 'relax-3.mp3', 'relax-4.mp3', 'relax-5.mp3',
        'track1.mp3', 'track2.mp3', 'track3.mp3', 'track4.mp3', 'track5.mp3',
        'song1.mp3', 'song2.mp3', 'song3.mp3', 'song4.mp3', 'song5.mp3',
        'music1.mp3', 'music2.mp3', 'music3.mp3', 'music4.mp3', 'music5.mp3',
        // Different audio formats
        'lofi.wav', 'chill.wav', 'relax.wav', 'music.wav',
        'lofi.ogg', 'chill.ogg', 'relax.ogg', 'music.ogg',
        'lofi.m4a', 'chill.m4a', 'relax.m4a', 'music.m4a',
        // Numbered patterns
        '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3',
        '01.mp3', '02.mp3', '03.mp3', '04.mp3', '05.mp3',
        // Japanese/Anime patterns
        'anime-1.mp3', 'anime-2.mp3', 'anime-3.mp3',
        'ost-1.mp3', 'ost-2.mp3', 'ost-3.mp3',
        'bgm-1.mp3', 'bgm-2.mp3', 'bgm-3.mp3'
      ]
      
      const discoveredFiles = []
      for (const filename of commonNames) {
        const audioPath = `/assets/sound/${filename}`
        try {
          const audio = new Audio()
          audio.src = audioPath
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('timeout')), 2000)
            audio.addEventListener('canplaythrough', () => {
              clearTimeout(timeout)
              resolve()
            })
            audio.addEventListener('error', () => {
              clearTimeout(timeout)
              reject()
            })
            audio.load()
          })
          discoveredFiles.push(audioPath)
        } catch (error) {
          // File doesn't exist, skip silently
        }
      }
      
      setPlaylist(discoveredFiles)
      setIsLoading(false)
      console.log('📁 Discovered audio files:', discoveredFiles)
    } catch (error) {
      console.error('❌ Error discovering audio files:', error)
      setPlaylist([])
      setIsLoading(false)
    }
  }

  // Load playlist on component mount
  useEffect(() => {
    discoverAudioFiles()
  }, [])

  // Manual refresh function for the button
  const handleRefreshPlaylist = () => {
    console.log('🔄 Refreshing playlist...')
    discoverAudioFiles()
  }

  // Get current track name for display
  const getCurrentTrackName = () => {
    if (!playlist[currentTrackIndex]) return 'Loading...'
    const fullPath = playlist[currentTrackIndex]
    const filename = fullPath.split('/').pop()
    return filename.replace('.mp3', '').replace(/Shadowverse_\s*Worlds Beyond OST - /, '')
  }

  // Next track function
  const nextTrack = () => {
    if (playlist.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    setCurrentTrackIndex(nextIndex)
  }

  // Previous track function
  const previousTrack = () => {
    if (playlist.length === 0) return
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
  }

  // Play/Pause toggle function
  const togglePlayPause = () => {
    if (playlist.length === 0) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle track end
  const handleTrackEnd = () => {
    nextTrack()
  }

  // Update time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Format time for display
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const progressBar = e.currentTarget
      const clickPosition = e.nativeEvent.offsetX
      const progressBarWidth = progressBar.offsetWidth
      const newTime = (clickPosition / progressBarWidth) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Volume control functions
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    // Unmute if volume is changed from 0
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Effect to handle track changes
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.load()
      // Set volume when track changes
      audioRef.current.volume = isMuted ? 0 : volume
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrackIndex, playlist])

  // Effect to set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Show loading state if playlist is being discovered
  if (isLoading) {
    return (
      <div className="player">
        <div className="track-info">
          <h3 className="track-title">Discovering music...</h3>
          <p className="track-number">Loading playlist...</p>
        </div>
      </div>
    )
  }

  // Show message if no tracks found
  if (playlist.length === 0) {
    return (
      <div className="player">
        <div className="track-info">
          <h3 className="track-title">No music found</h3>
          <p className="track-number">Add audio files to /public/assets/sound/</p>
        </div>
      </div>
    )
  }

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]}
        onEnded={handleTrackEnd}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="track-info">
        <h3 className="track-title">{getCurrentTrackName()}</h3>
        <p className="track-number">Track {currentTrackIndex + 1} of {playlist.length}</p>
        <button className="refresh-btn" onClick={handleRefreshPlaylist}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Refresh Playlist
        </button>
      </div>

      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleProgressClick}>
          <div 
            className="progress-fill"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          ></div>
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={previousTrack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button className="control-btn play-pause-btn" onClick={togglePlayPause}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <button className="control-btn" onClick={nextTrack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <div className="volume-control">
        <button className="volume-btn" onClick={toggleMute}>
          {isMuted || volume === 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : volume < 0.5 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <span className="volume-percentage">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
      </div>
    </div>
  )
}

export default Player
