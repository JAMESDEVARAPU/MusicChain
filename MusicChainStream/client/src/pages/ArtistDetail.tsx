import { useEffect } from "react";
import { useParams } from "wouter";
import SearchBar from "@/components/SearchBar";
import TrackList from "@/components/TrackList";
import PlaylistCard from "@/components/PlaylistCard";
import StatsCard from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { Artist, Track, Playlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { usePlayer } from "@/contexts/PlayerContext";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { connectWallet, isConnected, account, payArtist } = useBlockchain();
  const { setCurrentTrack } = usePlayer();
  
  const { data: artist, isLoading: isLoadingArtist } = useQuery<Artist>({
    queryKey: [`/api/artists/${id}`],
  });
  
  const { data: artistTracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: [`/api/artists/${id}/tracks`],
  });
  
  const { data: artistPlaylists, isLoading: isLoadingPlaylists } = useQuery<Playlist[]>({
    queryKey: [`/api/artists/${id}/playlists`],
  });
  
  const handlePlayAll = () => {
    if (artistTracks && artistTracks.length > 0) {
      setCurrentTrack(artistTracks[0]);
    }
  };
  
  const handlePayArtist = () => {
    if (artist) {
      payArtist(artist.id, 0.01);
    }
  };
  
  if (isLoadingArtist || isLoadingTracks || isLoadingPlaylists) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }
  
  if (!artist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Artist not found</h2>
        <p className="text-[#B3B3B3]">The artist you're looking for doesn't exist.</p>
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

      {/* Artist Header */}
      <div className="relative">
        <div className="h-80 bg-gradient-to-b from-[#644EFF] to-[#181818]">
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-8 flex items-end">
          <div className="flex items-center">
            <img 
              src={artist.imageUrl} 
              alt={artist.name} 
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg mr-6"
            />
            <div>
              <div className="flex items-center">
                <p className="text-sm font-semibold text-white mb-2">ARTIST</p>
                {artist.blockchain && (
                  <span className="ml-2 bg-[#644EFF] text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                    <i className="ri-token-swap-line mr-1"></i>
                    Blockchain
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">{artist.name}</h1>
              <p className="text-white text-sm">{artist.followers.toLocaleString()} followers • {artist.monthlyListeners.toLocaleString()} monthly listeners</p>
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
            Follow
          </Button>
          {artist.blockchain && (
            <Button 
              className="bg-[#644EFF] text-white hover:bg-opacity-80"
              onClick={handlePayArtist}
            >
              <i className="ri-coin-line mr-1"></i>
              Support Artist
            </Button>
          )}
        </div>
        
        {/* Popular Tracks */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-heading mb-4">Popular</h2>
          {artistTracks && artistTracks.length > 0 ? (
            <TrackList tracks={artistTracks.slice(0, 5)} showArtist={false} />
          ) : (
            <p className="text-[#B3B3B3]">No tracks available for this artist.</p>
          )}
        </section>
        
        {/* Released By */}
        {artistPlaylists && artistPlaylists.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-heading mb-4">Released By {artist.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {artistPlaylists.map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </section>
        )}
        
        {/* Blockchain Earnings */}
        {artist.blockchain && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-heading mb-4">Support Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Earnings"
                value={`${artist.earnings.toFixed(3)} ETH`}
                description="Lifetime earnings"
                icon="ri-coin-line"
                iconBgColor="bg-[#1DB954]"
                iconColor="text-[#1DB954]"
                trend={{
                  value: "0.42 ETH this month",
                  isPositive: true
                }}
              />
              
              <StatsCard
                title="Supporters"
                value={artist.supporters}
                description="Unique supporters"
                icon="ri-user-heart-line"
                iconBgColor="bg-[#644EFF]"
                iconColor="text-[#644EFF]"
                trend={{
                  value: "24 new this month",
                  isPositive: true
                }}
              />
              
              <StatsCard
                title="Revenue Split"
                value="95%"
                description="To artist directly"
                icon="ri-pie-chart-line"
                iconBgColor="bg-green-500"
                iconColor="text-green-500"
                trend={{
                  value: "5% platform fee",
                  isPositive: true
                }}
              />
            </div>
          </section>
        )}
        
        {/* About */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-heading mb-4">About</h2>
          <div className="bg-[#181818] rounded-lg p-6">
            <div className="mb-4">
              <img 
                src={artist.imageUrl} 
                alt={artist.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
              <p className="text-[#B3B3B3] mb-4">{artist.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-[#B3B3B3] text-sm font-semibold mb-1">Genre</h4>
                  <p>{artist.genre}</p>
                </div>
                <div>
                  <h4 className="text-[#B3B3B3] text-sm font-semibold mb-1">Monthly Listeners</h4>
                  <p>{artist.monthlyListeners.toLocaleString()}</p>
                </div>
              </div>
              
              {artist.blockchain && (
                <div className="border-t border-[#282828] pt-4 mt-4">
                  <h4 className="text-white font-semibold mb-2">Blockchain Verified Artist</h4>
                  <p className="text-[#B3B3B3] text-sm mb-3">
                    Support this artist directly through blockchain payments. 95% of your support goes directly to the artist.
                  </p>
                  <div className="flex items-center">
                    <i className="ri-link-m text-[#644EFF] mr-1"></i>
                    <a href="#" className="text-[#644EFF] text-sm hover:underline">
                      View on Blockchain
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ArtistDetail;
