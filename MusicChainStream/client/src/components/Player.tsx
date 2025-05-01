// src/components/Player.tsx

import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils"; // Assuming cn is a utility for class names
import ExplicitAudioPlayer from "@/components/ExplicitAudioPlayer"; // Custom explicit content player
import AudioGenerator from "@/components/AudioGenerator"; // Component for audio generation

function Player() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    isShuffle,
    isRepeat
  } = usePlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // Set default track duration
  const [playerReady, setPlayerReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [showExplicitPlayer, setShowExplicitPlayer] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      if (!isNaN(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current || !playerReady || !currentTrack) return;

    const playAudio = async () => {
      try {
        if (isPlaying) {
          await audioRef.current.play();
          setAudioError(null);
        } else {
          audioRef.current.pause();
        }
      } catch (err) {
        console.error("Playback error:", err);
        setIsPlaying(false);
        setAudioError("Click play to start playback");
      }
    };

    playAudio();
  }, [isPlaying, playerReady, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout | null = null;
    if (isPlaying && playerReady && audioRef.current) {
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
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleForcePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = context.createBuffer(1, 1, 22050);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);

        audioRef.current.play().then(() => {
          setAudioError(null);
          togglePlayPause();
        }).catch(err => {
          console.error("Force play error:", err);
          setAudioError("Audio still blocked. Try clicking again.");
        });
      } catch (err) {
        console.error("Force play error:", err);
        setAudioError("Audio still blocked. Try a different browser.");
      }
    }
  };

  const handleAudioGenerated = (audioUrl: string) => {
    setGeneratedAudioUrl(audioUrl);
    setPlayerReady(true);
    setAudioError(null);

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          if (isRepeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(err => {
                console.error("Replay error:", err);
                setAudioError("Unable to replay track. Click play to try again.");
              });
            }
          } else {
            nextTrack();
          }
        };
        audioRef.current.onloadedmetadata = handleMetadataLoaded;
        audioRef.current.onerror = (e) => {
          console.error("Audio error:", e);
          setAudioError("Unable to play track. Please select another song.");
        };
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
    } catch (err) {
      console.error("Audio initialization error:", err);
      setAudioError("Failed to initialize audio player.");
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        setAudioError("Audio playback error. Please try again.");
      });
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="flex flex-col items-center w-full">
      {showExplicitPlayer ? (
        <ExplicitAudioPlayer />
      ) : (
        <AudioGenerator onAudioGenerated={handleAudioGenerated} />
      )}
      {audioError && (
        <div className="text-red-500 mt-2">{audioError}</div>
      )}
      <div className="w-full max-w-lg">
        <Slider value={[currentTime / duration * 100]} onChange={handleSeek} />
      </div>
      <div className="flex items-center justify-between w-full max-w-lg mt-2">
        <div className="text-sm">{formatTime(currentTime)}</div>
        <div className="text-sm">{formatTime(duration)}</div>
      </div>
      <div className="flex items-center justify-center w-full mt-4">
        <button
          onClick={previousTrack}
          className="p-2 mr-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          Previous
        </button>
        <button
          onClick={togglePlayPause}
          className={cn(
            "p-2 bg-gray-200 hover:bg-gray-300 rounded-full",
            isPlaying ? "text-red-500" : "text-gray-500"
          )}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={nextTrack}
          className="p-2 ml-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          Next
        </button>
      </div>
      <div className="flex items-center mt-4">
        <button
          onClick={toggleShuffle}
          className={cn("p-2 bg-gray-200 hover:bg-gray-300 rounded-full", isShuffle ? "text-blue-500" : "text-gray-500")}
        >
          Shuffle
        </button>
        <button
          onClick={toggleRepeat}
          className={cn("p-2 ml-2 bg-gray-200 hover:bg-gray-300 rounded-full", isRepeat ? "text-blue-500" : "text-gray-500")}
        >
          Repeat
        </button>
      </div>
      <div className="w-full mt-4">
        <Slider value={[volume]} onChange={setVolume} />
      </div>
      <div className="mt-4">
        {audioError && (
          <button onClick={handleForcePlay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Force Play</button>
        )}
      </div>
    </div>
  );
}

export default Player;
