// src/contexts/PlayerContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";

interface PlayerContextType {
  currentTrack: any;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffle: boolean;
  isRepeat: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const togglePlayPause = () => setIsPlaying(prev => !prev);
  const nextTrack = () => { /* Implement track switching logic */ };
  const previousTrack = () => { /* Implement track switching logic */ };
  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleRepeat = () => setIsRepeat(prev => !prev);

  return (
    <PlayerContext.Provider
      value={{
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
