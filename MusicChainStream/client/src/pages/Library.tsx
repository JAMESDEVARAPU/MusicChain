import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ArtistCard from "@/components/ArtistCard";
import PlaylistCard from "@/components/PlaylistCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Artist, Playlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";

const Library = () => {
  const { connectWallet, isConnected, account } = useBlockchain();
  
  const { data: followedArtists, isLoading: isLoadingArtists } = useQuery<Artist[]>({
    queryKey: ['/api/library/artists'],
  });
  
  const { data: userPlaylists, isLoading: isLoadingPlaylists } = useQuery<Playlist[]>({
    queryKey: ['/api/library/playlists'],
  });
  
  if (isLoadingArtists || isLoadingPlaylists) {
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-heading mb-6">Your Library</h1>
          <button className="text-white bg-[#282828] hover:bg-[#3E3E3E] rounded-full p-2">
            <i className="ri-add-line text-xl"></i>
          </button>
        </div>
        
        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playlists">
            {userPlaylists && userPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {userPlaylists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#181818] rounded-lg">
                <i className="ri-music-2-line text-6xl text-[#B3B3B3] mb-4"></i>
                <h2 className="text-2xl font-semibold mb-2">Create your first playlist</h2>
                <p className="text-[#B3B3B3] mb-6">It's easy, we'll help you</p>
                <Button className="bg-white text-black hover:bg-[#EFEFEF]">
                  Create playlist
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="artists">
            {followedArtists && followedArtists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {followedArtists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#181818] rounded-lg">
                <i className="ri-user-star-line text-6xl text-[#B3B3B3] mb-4"></i>
                <h2 className="text-2xl font-semibold mb-2">Follow your first artist</h2>
                <p className="text-[#B3B3B3] mb-6">Follow artists you like by tapping the follow button</p>
                <Button className="bg-white text-black hover:bg-[#EFEFEF]">
                  Browse artists
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Library;
