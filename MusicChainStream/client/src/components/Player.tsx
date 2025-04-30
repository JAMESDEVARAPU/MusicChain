import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import ExplicitAudioPlayer from "@/components/ExplicitAudioPlayer";
import AudioGenerator from "@/components/AudioGenerator";

/**
 * Player component with fallback to explicit audio controls
 * 
 * This component provides a complete music player experience with visual feedback
 * and, when needed, will display explicit audio controls to overcome browser
 * security restrictions.
 * 
 * Features:
 * - Uses AudioGenerator component for reliable cross-browser audio
 * - Provides "Force Play" button to help overcome browser autoplay restrictions
 * - Falls back to ExplicitAudioPlayer for browsers that block all auto-initiated audio
 * - Includes blockchain-based artist payment functionality
 */
function Player() {
  // Declare all hooks at the top level
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, previousTrack, volume, setVolume, toggleShuffle, toggleRepeat, isShuffle, isRepeat } = usePlayer();
  const { payArtist } = useBlockchain();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [playerReady, setPlayerReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [showExplicitPlayer, setShowExplicitPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio metadata loaded
  const handleMetadataLoaded = () => {
    console.log('Track loaded successfully');
    if (audioRef.current) {
      // Update duration from the actual audio
      const audioDuration = audioRef.current.duration;
      if (!isNaN(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      }
    }
  };

  // Update play/pause state
  useEffect(() => {
    if (!audioRef.current || !playerReady) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Play prevented:', err);
        setAudioError('Browser blocked play. Click "Force Play".');
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, playerReady]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update current time for progress bar
  useEffect(() => {
    let timeInterval: NodeJS.Timeout | null = null;

    if (isPlaying && playerReady && audioRef.current) {
      // Update current time every second while playing
      timeInterval = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    }

    return () => {
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [isPlaying, playerReady]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, [generatedAudioUrl]);

  // Seeking in the track
  const handleSeek = (value: number[]) => {
    if (duration && audioRef.current) {
      const seekTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePayArtist = () => {
    if (currentTrack) {
      payArtist(currentTrack.artistId, 0.001);
    }
  };

  // Force play button to help with browser autoplay restrictions
  const handleForcePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (audioRef.current) {
      try {
        // Create and play a silent buffer to unlock audio
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = context.createBuffer(1, 1, 22050);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);

        // Now try to play the actual audio
        audioRef.current.play().then(() => {
          setAudioError(null);
          togglePlayPause(); // Use context's function instead of directly setting state
        }).catch(err => {
          console.error('Force play error:', err);
          setAudioError('Audio still blocked. Try clicking again.');
        });
      } catch (err) {
        console.error('Force play error:', err);
        setAudioError('Audio still blocked. Try a different browser.');
      }
    }
  };

  if (!currentTrack) {
    return null;
  }


  // Handle audio URL generated by AudioGenerator
  const handleAudioGenerated = (audioUrl: string) => {
    console.log("Audio generated for track:", currentTrack?.title);
    setGeneratedAudioUrl(audioUrl);
    setPlayerReady(true);

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);

      // Set event listeners
      audioRef.current.onended = () => {
        console.log('Track ended');
        if (isRepeat) {
          // If repeating, seek to beginning and continue playing
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } else {
          // Otherwise, play next track
          nextTrack();
        }
      };

      audioRef.current.onloadedmetadata = handleMetadataLoaded;

      audioRef.current.onerror = () => {
        console.error('Error playing audio');
        setAudioError('Browser blocked audio. Click "Force Play".');
      };

      audioRef.current.volume = volume / 100;
    } else {
      // Update audio source
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }

    // Play if needed
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Autoplay prevented:', err);
        setAudioError('Browser blocked autoplay. Click "Force Play".');
      });
    }
  };

  // Show explicit player after two Force Play attempts
  useEffect(() => {
    if (audioError && audioError.includes('still blocked')) {
      setShowExplicitPlayer(true);
    }
  }, [audioError]);

  // Render the explicit audio player and main player
  return (
    <>
      {/* Audio generator for current track */}
      {currentTrack && (
        <AudioGenerator 
          frequency={currentTrack.id * 20 + 440}
          duration={10}
          onAudioGenerated={handleAudioGenerated}
        />
      )}

      {/* Show explicit audio player if needed */}
      {showExplicitPlayer && currentTrack && (
        <ExplicitAudioPlayer />
      )}

      <div className="player fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-[#282828] z-30 px-4 backdrop-blur-md bg-opacity-95 shadow-lg transition-all duration-300">
        <div className="h-full max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Currently Playing */}
          <div className="flex items-center w-1/4">
            {currentTrack?.albumCover && (
              <img 
                src={currentTrack.albumCover} 
                alt={`${currentTrack.title} album cover`} 
                className="h-14 w-14 rounded mr-3 hidden sm:block"
              />
            )}
            <div className="truncate">
              <p className="text-white font-medium text-sm truncate">{currentTrack.title}</p>
              <p className="text-[#B3B3B3] text-xs truncate">{currentTrack.artist}</p>
              {isPlaying && playerReady && <p className="text-green-500 text-xs truncate">Now playing</p>}
              {audioError && 
                <div className="flex items-center mt-1">
                  <p className="text-orange-500 text-xs truncate mr-2">{audioError}</p>
                  <button 
                    onClick={handleForcePlay}
                    className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 rounded-full"
                  >
                    Force Play
                  </button>
                </div>
              }
            </div>
            <button className="ml-4 text-[#B3B3B3] hover:text-white hidden sm:block">
              <i className="ri-heart-line"></i>
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col justify-center items-center w-2/4">
            <div className="flex items-center mb-2">
              <button 
                className={cn("mx-2 hover:text-white", isShuffle ? "text-[#1DB954]" : "text-[#B3B3B3]")}
                onClick={toggleShuffle}
              >
                <i className="ri-shuffle-line text-sm"></i>
              </button>
              <button 
                className="mx-2 text-[#B3B3B3] hover:text-white"
                onClick={previousTrack}
              >
                <i className="ri-skip-back-line text-xl"></i>
              </button>
              <button 
                className="mx-2 bg-white rounded-full h-8 w-8 flex items-center justify-center hover:scale-105 transition"
                onClick={togglePlayPause}
              >
                <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-black text-xl`}></i>
              </button>
              <button 
                className="mx-2 text-[#B3B3B3] hover:text-white"
                onClick={nextTrack}
              >
                <i className="ri-skip-forward-line text-xl"></i>
              </button>
              <button 
                className={cn("mx-2 hover:text-white", isRepeat ? "text-[#1DB954]" : "text-[#B3B3B3]")}
                onClick={toggleRepeat}
              >
                <i className="ri-repeat-line text-sm"></i>
              </button>
            </div>

            <div className="w-full flex items-center text-xs text-[#B3B3B3]">
              <span className="mr-2 hidden sm:block">{formatTime(currentTime)}</span>
              <div className="flex-1 mx-2">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
              </div>
              <span className="ml-2 hidden sm:block">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center justify-end w-1/4">
            <button className="text-[#B3B3B3] hover:text-white mr-2 hidden md:block">
              <i className="ri-token-swap-line"></i>
            </button>
            <div className="flex items-center ml-4 hidden sm:flex">
              <button className="text-[#B3B3B3] hover:text-white">
                <i className="ri-volume-up-line"></i>
              </button>
              <div className="w-20 mx-2">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => setVolume(v[0])}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <button className="text-[#B3B3B3] hover:text-white ml-4 hidden md:block">
              <i className="ri-fullscreen-line"></i>
            </button>
            <button 
              className="bg-[#644EFF] text-white text-xs px-3 py-1.5 rounded-full flex items-center ml-4 hover:bg-opacity-80"
              onClick={handlePayArtist}
            >
              <i className="ri-coin-line mr-1"></i>
              <span className="hidden sm:inline">Pay Artist</span>
              <span className="sm:hidden">Pay</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;