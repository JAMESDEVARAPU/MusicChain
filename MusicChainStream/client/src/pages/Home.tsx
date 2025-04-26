import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ArtistCard from "@/components/ArtistCard";
import TrackList from "@/components/TrackList";
import PlaylistCard from "@/components/PlaylistCard";
import StatsCard from "@/components/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { Artist, Track, Playlist } from "@shared/schema";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { connectWallet, isConnected, account } = useBlockchain();
  
  const { data: featuredArtists } = useQuery<Artist[]>({
    queryKey: ['/api/artists/featured'],
  });
  
  const { data: recentTracks } = useQuery<Track[]>({
    queryKey: ['/api/tracks/recent'],
  });
  
  const { data: recommendedPlaylists } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists/recommended'],
  });
  
  if (!featuredArtists || !recentTracks || !recommendedPlaylists) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
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

      {/* Content */}
      <div className="p-4 md:p-8">
        {/* Featured Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Featured Artists</h2>
            <a href="#" className="text-[#B3B3B3] hover:text-white text-sm font-medium">See All</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        {/* Recently Played */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Recently Played</h2>
            <a href="#" className="text-[#B3B3B3] hover:text-white text-sm font-medium">See All</a>
          </div>
          
          <TrackList tracks={recentTracks} />
        </section>

        {/* Made For You */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Made For You</h2>
            <a href="#" className="text-[#B3B3B3] hover:text-white text-sm font-medium">See All</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        {/* Blockchain Stats */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Your Support Impact</h2>
            <button className="text-[#644EFF] hover:text-white text-sm font-medium flex items-center">
              <i className="ri-information-line mr-1"></i>
              <span>Learn More</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Artist Payments"
              value="0.023 ETH"
              description="This month"
              icon="ri-coin-line"
              iconBgColor="bg-[#1DB954]"
              iconColor="text-[#1DB954]"
              trend={{
                value: "12% from last month",
                isPositive: true
              }}
            />
            
            <StatsCard
              title="Artists Supported"
              value="12"
              description="Unique artists"
              icon="ri-user-star-line"
              iconBgColor="bg-[#644EFF]"
              iconColor="text-[#644EFF]"
              trend={{
                value: "3 new this month",
                isPositive: true
              }}
            />
            
            <StatsCard
              title="Listening Impact"
              value="95%"
              description="Direct to artist"
              icon="ri-bar-chart-line"
              iconBgColor="bg-green-500"
              iconColor="text-green-500"
              trend={{
                value: "Verified blockchain payments",
                isPositive: true
              }}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
