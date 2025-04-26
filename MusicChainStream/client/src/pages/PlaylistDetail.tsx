import { useParams } from "wouter";
import SearchBar from "@/components/SearchBar";
import TrackList from "@/components/TrackList";
import { useQuery } from "@tanstack/react-query";
import { Playlist, Track } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { usePlayer } from "@/contexts/PlayerContext";

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { connectWallet, isConnected, account } = useBlockchain();
  const { setCurrentTrack } = usePlayer();
  
  const { data: playlist, isLoading: isLoadingPlaylist } = useQuery<Playlist>({
    queryKey: [`/api/playlists/${id}`],
  });
  
  const { data: playlistTracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: [`/api/playlists/${id}/tracks`],
  });
  
  const handlePlayAll = () => {
    if (playlistTracks && playlistTracks.length > 0) {
      setCurrentTrack(playlistTracks[0]);
    }
  };
  
  if (isLoadingPlaylist || isLoadingTracks) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }
  
  if (!playlist || !playlistTracks) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Playlist not found</h2>
        <p className="text-[#B3B3B3]">The playlist you're looking for doesn't exist.</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-10 bg-opacity-80 bg-[#181818] backdrop-blur-sm">
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-black bg-opacity-50 rounded-full p-1">
            <i className="ri-arrow-left-s-line text-xl text-white"></i>
          </button>
          <button className="bg-black bg-opacity-50 rounded-full p-1">
            <i className="ri-arrow-right-s-line text-xl text-white"></i>
          </button>
        </div>
        
        <SearchBar />
        
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <Button 
              onClick={connectWallet}
              className="py-1 px-3 bg-[#644EFF] rounded-full text-xs font-medium text-white hidden md:block"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button 
              className="py-1 px-3 bg-[#1DB954] rounded-full text-xs font-medium text-white hidden md:block"
            >
              {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
          )}
          <div className="relative">
            <button className="bg-black bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Header */}
      <div className="relative">
        <div className="p-8 bg-gradient-to-b from-[#282828] to-[#181818] flex items-end">
          <div className="flex flex-col md:flex-row items-center md:items-end">
            <img 
              src={playlist.coverUrl} 
              alt={playlist.name} 
              className="w-52 h-52 shadow-lg mr-6"
            />
            <div className="text-center md:text-left mt-4 md:mt-0">
              <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{playlist.name}</h1>
              <p className="text-[#B3B3B3] text-sm mb-2">{playlist.description}</p>
              <div className="flex items-center flex-wrap justify-center md:justify-start">
                <span className="text-white">{playlist.creator}</span>
                <span className="mx-2 text-[#B3B3B3]">•</span>
                <span className="text-[#B3B3B3]">{playlistTracks.length} songs</span>
                <span className="mx-2 text-[#B3B3B3]">•</span>
                <span className="text-[#B3B3B3]">{playlist.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-8 bg-gradient-to-b from-[#181818] to-[#121212]">
        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full"
            onClick={handlePlayAll}
          >
            <i className="ri-play-fill mr-1 text-xl"></i>
            Play
          </Button>
          <Button 
            variant="outline" 
            className="text-white border-[#B3B3B3] hover:border-white"
          >
            <i className="ri-heart-line mr-1"></i>
            Like
          </Button>
          <Button 
            variant="ghost" 
            className="text-[#B3B3B3] hover:text-white"
          >
            <i className="ri-more-fill text-xl"></i>
          </Button>
        </div>
        
        {/* Tracks */}
        {playlistTracks.length > 0 ? (
          <TrackList tracks={playlistTracks} />
        ) : (
          <div className="text-center py-12 bg-[#181818] rounded-lg">
            <i className="ri-music-2-line text-6xl text-[#B3B3B3] mb-4"></i>
            <h2 className="text-2xl font-semibold mb-2">No tracks in this playlist</h2>
            <p className="text-[#B3B3B3]">Add some tracks to get started</p>
          </div>
        )}
        
        {/* Blockchain Artists Information */}
        {playlist.blockchainArtists > 0 && (
          <div className="mt-8 p-6 bg-[#181818] rounded-lg border border-[#282828]">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-[#644EFF] bg-opacity-20 flex items-center justify-center mr-4">
                <i className="ri-token-swap-line text-[#644EFF]"></i>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Blockchain-Powered Artists</h3>
                <p className="text-[#B3B3B3] mb-4">
                  This playlist features {playlist.blockchainArtists} artists who receive direct support through blockchain payments. 
                  By listening to their music and supporting them directly, you're helping revolutionize the music industry.
                </p>
                <Button 
                  variant="outline" 
                  className="text-[#644EFF] border-[#644EFF] hover:bg-[#644EFF] hover:bg-opacity-10"
                >
                  <i className="ri-information-line mr-1"></i>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaylistDetail;
