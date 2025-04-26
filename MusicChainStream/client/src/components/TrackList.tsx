import { usePlayer } from "@/contexts/PlayerContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Track } from "@shared/schema";

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showArtist?: boolean;
}

const TrackList = ({ tracks, showAlbum = true, showArtist = true }: TrackListProps) => {
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } = usePlayer();
  
  const handlePlay = (track: Track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
    }
  };
  
  return (
    <div className="bg-[#181818] rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#282828] text-[#B3B3B3] text-xs">
            <th className="py-3 px-4 font-medium w-10">#</th>
            <th className="py-3 px-4 font-medium">TITLE</th>
            {showArtist && <th className="py-3 px-4 font-medium hidden md:table-cell">ARTIST</th>}
            {showAlbum && <th className="py-3 px-4 font-medium hidden lg:table-cell">ALBUM</th>}
            <th className="py-3 px-4 font-medium text-right">
              <i className="ri-time-line"></i>
            </th>
            <th className="py-3 px-4 font-medium text-center">EARNINGS</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr 
              key={track.id} 
              className="group hover:bg-[#282828] cursor-pointer"
              onClick={() => handlePlay(track)}
            >
              <td className="py-3 px-4 text-[#B3B3B3]">
                {currentTrack?.id === track.id && isPlaying ? (
                  <i className="ri-volume-up-fill text-[#1DB954]"></i>
                ) : (
                  index + 1
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <img 
                    src={track.albumCover} 
                    alt={`${track.title} cover`} 
                    className="w-10 h-10 mr-3 rounded"
                  />
                  <div>
                    <p className={`font-medium ${currentTrack?.id === track.id ? 'text-[#1DB954]' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[#B3B3B3] text-sm hidden sm:block">
                      {track.artist}
                    </p>
                  </div>
                </div>
              </td>
              {showArtist && <td className="py-3 px-4 text-[#B3B3B3] hidden md:table-cell">{track.artist}</td>}
              {showAlbum && <td className="py-3 px-4 text-[#B3B3B3] hidden lg:table-cell">{track.album}</td>}
              <td className="py-3 px-4 text-[#B3B3B3] text-right">{track.duration}</td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className="bg-[#282828] px-2 py-1 rounded text-xs flex items-center text-[#1DB954]">
                    <i className="ri-coin-line mr-1"></i>
                    <span>{track.earnings} ETH</span>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
