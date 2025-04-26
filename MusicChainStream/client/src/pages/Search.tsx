import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import SearchBar from "@/components/SearchBar";
import ArtistCard from "@/components/ArtistCard";
import TrackList from "@/components/TrackList";
import PlaylistCard from "@/components/PlaylistCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Artist, Track, Playlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";

const Search = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { connectWallet, isConnected, account } = useBlockchain();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);
  
  const { data: searchResults, isLoading } = useQuery<{
    artists: Artist[];
    tracks: Track[];
    playlists: Playlist[];
  }>({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 0,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
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
        
        <SearchBar onSearch={handleSearch} />
        
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
        <h1 className="text-3xl font-bold font-heading mb-6">
          {searchQuery ? `Search results for "${searchQuery}"` : "Search"}
        </h1>
        
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
          </div>
        )}
        
        {!searchQuery && !isLoading && (
          <div className="text-center py-12">
            <i className="ri-search-line text-6xl text-[#B3B3B3] mb-4"></i>
            <h2 className="text-2xl font-semibold mb-2">Search for music</h2>
            <p className="text-[#B3B3B3]">Find your favorite artists, songs, and playlists</p>
          </div>
        )}
        
        {searchQuery && searchResults && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {/* Artists */}
              {searchResults.artists.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Artists</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.artists.slice(0, 6).map(artist => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </section>
              )}
              
              {/* Tracks */}
              {searchResults.tracks.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Tracks</h2>
                  <TrackList tracks={searchResults.tracks.slice(0, 5)} />
                </section>
              )}
              
              {/* Playlists */}
              {searchResults.playlists.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Playlists</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {searchResults.playlists.slice(0, 5).map(playlist => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </section>
              )}
              
              {searchResults.artists.length === 0 && 
               searchResults.tracks.length === 0 && 
               searchResults.playlists.length === 0 && (
                <div className="text-center py-12">
                  <i className="ri-emotion-sad-line text-4xl text-[#B3B3B3] mb-4"></i>
                  <h2 className="text-xl font-semibold mb-2">No results found</h2>
                  <p className="text-[#B3B3B3]">Try different keywords or check your spelling</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="artists">
              {searchResults.artists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">No artists found</h2>
                  <p className="text-[#B3B3B3]">Try different keywords</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tracks">
              {searchResults.tracks.length > 0 ? (
                <TrackList tracks={searchResults.tracks} />
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">No tracks found</h2>
                  <p className="text-[#B3B3B3]">Try different keywords</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="playlists">
              {searchResults.playlists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {searchResults.playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">No playlists found</h2>
                  <p className="text-[#B3B3B3]">Try different keywords</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Search;
