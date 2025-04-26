import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Track } from "@shared/schema";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  queue: Track[];
  history: Track[];
  setCurrentTrack: (track: Track) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  
  // Load volume from localStorage on initial load
  useEffect(() => {
    const savedVolume = localStorage.getItem("player-volume");
    if (savedVolume) {
      setVolumeState(parseInt(savedVolume));
    }
    
    // Fetch all tracks to use as fallback when queue is empty
    fetch('/api/tracks')
      .then(res => res.json())
      .then(data => {
        console.log("Loaded tracks for player context:", data.length);
        setAllTracks(data);
      })
      .catch(err => console.error("Error loading tracks for player:", err));
  }, []);
  
  // Save volume to localStorage when it changes
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("player-volume", newVolume.toString());
  };
  
  const setCurrentTrack = (track: Track) => {
    console.log("Setting current track:", track.title, track.audioUrl);
    
    if (currentTrack) {
      // Add current track to history
      setHistory(prev => [...prev, currentTrack]);
    }
    
    setCurrentTrackState(track);
    setIsPlaying(true);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const getRandomTrack = (): Track | null => {
    if (allTracks.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allTracks.length);
    return allTracks[randomIndex];
  };
  
  const getNextTrackInCollection = (): Track | null => {
    if (allTracks.length === 0 || !currentTrack) return null;
    
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return null;
    
    // Get next track or wrap around to first track
    const nextIndex = (currentIndex + 1) % allTracks.length;
    return allTracks[nextIndex];
  };
  
  const nextTrack = () => {
    // First check if there's anything in queue
    if (queue.length > 0) {
      console.log("Playing next track from queue");
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      
      if (currentTrack) {
        // Add current track to history
        setHistory(prev => [...prev, currentTrack]);
      }
      
      setCurrentTrackState(nextTrack);
      setQueue(newQueue);
      setIsPlaying(true);
    } 
    // If shuffle is on, pick a random track
    else if (isShuffle) {
      console.log("Playing random track (shuffle mode)");
      const randomTrack = getRandomTrack();
      
      if (randomTrack) {
        if (currentTrack) {
          setHistory(prev => [...prev, currentTrack]);
        }
        
        setCurrentTrackState(randomTrack);
        setIsPlaying(true);
      }
    }
    // If repeat is on, restart current track
    else if (isRepeat && currentTrack) {
      console.log("Repeating current track");
      setCurrentTrackState({...currentTrack});
      setIsPlaying(true);
    }
    // Find next track in the collection
    else {
      console.log("Finding next track in collection");
      const nextTrack = getNextTrackInCollection();
      
      if (nextTrack) {
        if (currentTrack) {
          setHistory(prev => [...prev, currentTrack]);
        }
        
        setCurrentTrackState(nextTrack);
        setIsPlaying(true);
      } else {
        // No next track, stop playing
        setIsPlaying(false);
      }
    }
  };
  
  const previousTrack = () => {
    if (history.length > 0) {
      console.log("Playing previous track from history");
      // Take last track from history
      const prevTrack = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);
      
      if (currentTrack) {
        // Add current track to beginning of queue
        setQueue(prev => [currentTrack, ...prev]);
      }
      
      setCurrentTrackState(prevTrack);
      setHistory(newHistory);
      setIsPlaying(true);
    }
  };
  
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };
  
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  
  const addToQueue = (track: Track) => {
    console.log("Adding to queue:", track.title);
    setQueue(prev => [...prev, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        isShuffle,
        isRepeat,
        queue,
        history,
        setCurrentTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  
  return context;
};
