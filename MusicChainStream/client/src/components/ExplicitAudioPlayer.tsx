import { usePlayer } from "@/contexts/PlayerContext";

/**
 * ExplicitAudioPlayer Component
 * 
 * This component uses the native HTML5 audio element with visible controls
 * to clearly communicate to browsers that this is user-initiated playback.
 * It's a fallback for environments where other audio playback methods fail.
 */
const ExplicitAudioPlayer = () => {
  const { currentTrack } = usePlayer();
  
  if (!currentTrack) return null;
  
  // Use a demo track URL that's known to work well
  const audioUrl = currentTrack.audioUrl || 'https://cdn.freesound.org/previews/649/649408_5674468-lq.mp3';
  
  return (
    <div className="explicit-player fixed bottom-24 left-0 right-0 mx-auto max-w-screen-lg bg-black bg-opacity-80 backdrop-blur-md p-4 rounded-t-lg z-20">
      <div className="mb-3 text-center">
        <h4 className="text-white font-medium">Browser Autoplay Restrictions Detected</h4>
        <p className="text-sm text-gray-300">Use the controls below to play "{currentTrack.title}" by {currentTrack.artist}</p>
      </div>
      
      {/* The explicit audio player with browser native controls */}
      <audio 
        src={audioUrl}
        controls
        className="w-full"
        autoPlay={false}
      />
      
      <div className="mt-2 text-xs text-center text-gray-400">
        <p>Due to browser security policies, we need your direct interaction to play audio.</p>
        <p>This fallback player will let you enjoy music even with strict browser settings.</p>
      </div>
    </div>
  );
};

export default ExplicitAudioPlayer;