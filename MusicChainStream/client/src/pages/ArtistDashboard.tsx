import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import SearchBar from "@/components/SearchBar";
import UploadMusicForm from "@/components/UploadMusicForm";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Artist, Track, Transaction } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon, description, change }: StatsCardProps) => (
  <Card className="bg-[#181818] border-[#282828]">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#B3B3B3] text-sm font-medium">{title}</p>
        <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <span className={`text-xs font-medium ${
            change.positive ? 'text-green-500' : 'text-red-500'
          }`}>
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
        )}
      </div>
      {description && <p className="text-xs text-[#B3B3B3] mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const TrackRow = ({ track, index }: { track: Track, index: number }) => (
  <tr className="border-b border-[#282828] hover:bg-[#282828]">
    <td className="py-4 px-2 text-center text-[#B3B3B3]">{index + 1}</td>
    <td className="py-4">
      <div className="flex items-center">
        <img 
          src={track.albumCover} 
          alt={track.title} 
          className="w-10 h-10 rounded mr-3"
        />
        <div>
          <p className="font-medium">{track.title}</p>
          <p className="text-sm text-[#B3B3B3]">{track.album}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-4 text-[#B3B3B3]">{track.duration}</td>
    <td className="py-4 px-4 text-right">
      <Badge className="bg-[#1DB954] text-white hover:bg-[#1DB954]">
        {track.earnings} ETH
      </Badge>
    </td>
  </tr>
);

const PaymentRow = ({ tx, index }: { tx: Transaction, index: number }) => (
  <tr className="border-b border-[#282828] hover:bg-[#282828]">
    <td className="py-4 px-4">{tx.date}</td>
    <td className="py-4 px-4 text-[#B3B3B3]">{tx.fromAddress.slice(0, 6)}...{tx.fromAddress.slice(-4)}</td>
    <td className="py-4 px-4">{tx.amount} ETH</td>
    <td className="py-4 px-4">
      <Badge variant="outline" className="border-[#644EFF] text-[#644EFF]">
        Verified
      </Badge>
    </td>
    <td className="py-4 px-4 text-right">
      <a 
        href={`https://etherscan.io/tx/${tx.txHash}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-[#644EFF] hover:underline text-sm"
      >
        View
      </a>
    </td>
  </tr>
);

const ArtistDashboard = () => {
  const { isConnected, account, connectWallet } = useBlockchain();
  const [, setLocation] = useLocation();
  
  // For demo purposes, we'll use artist ID 1
  const artistId = 1;
  
  const { data: artist, isLoading: isLoadingArtist } = useQuery<Artist>({
    queryKey: [`/api/artists/${artistId}`],
    enabled: isConnected,
  });
  
  const { data: artistTracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: [`/api/artists/${artistId}/tracks`],
    enabled: isConnected,
  });
  
  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected && !isLoadingArtist) {
      setLocation("/");
    }
  }, [isConnected, isLoadingArtist, setLocation]);
  
  if (!isConnected) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center mt-16">
        <div className="mb-8">
          <div className="h-20 w-20 mx-auto bg-[#644EFF] rounded-full flex items-center justify-center mb-6">
            <i className="ri-user-star-line text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold mb-4">Artist Dashboard</h1>
          <p className="text-[#B3B3B3] mb-8 max-w-lg mx-auto">
            Connect your wallet to access your artist dashboard, manage your music,
            and track your earnings in real-time.
          </p>
        </div>
        
        <Button 
          className="bg-[#644EFF] hover:bg-[#7161FF] px-8 py-6 text-lg" 
          onClick={connectWallet}
        >
          <i className="ri-wallet-line mr-2"></i>
          Connect Wallet to Continue
        </Button>
      </div>
    );
  }
  
  if (isLoadingArtist || isLoadingTracks) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }
  
  if (!artist) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
          <p className="text-[#B3B3B3] mb-8">
            This wallet is not associated with an artist account.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="border-[#644EFF] text-[#644EFF] hover:bg-[#644EFF] hover:text-white"
          onClick={() => setLocation("/")}
        >
          Return Home
        </Button>
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
          <Button 
            className="py-1 px-3 bg-[#1DB954] rounded-full text-xs font-medium text-white hidden md:flex items-center"
          >
            <i className="ri-user-star-line mr-1"></i>
            Artist Mode
          </Button>
          <div className="relative">
            <button className="bg-black bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-8">
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <img 
            src={artist.imageUrl} 
            alt={artist.name} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{artist.name}</h1>
              <Badge className="bg-[#644EFF] text-white">
                <i className="ri-token-swap-line mr-1"></i>
                Blockchain Verified
              </Badge>
            </div>
            <p className="text-[#B3B3B3] text-sm mb-4">{artist.genre} • {artist.followers.toLocaleString()} followers • {artist.monthlyListeners.toLocaleString()} monthly listeners</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-medium">
                Edit Profile
              </Button>
              <Button variant="outline" className="border-[#B3B3B3] text-white hover:border-white">
                <i className="ri-share-line mr-1"></i>
                Share
              </Button>
              <Button variant="outline" className="border-[#B3B3B3] text-white hover:border-white">
                <i className="ri-settings-3-line mr-1"></i>
                Settings
              </Button>
            </div>
          </div>
          <div className="bg-[#181818] rounded-lg p-6 w-full md:w-auto">
            <div className="text-center">
              <p className="text-[#B3B3B3] text-sm">Wallet Address</p>
              <p className="text-sm font-mono mb-2">{account.slice(0, 12)}...{account.slice(-8)}</p>
              <Badge 
                variant="outline" 
                className="border-[#644EFF] text-[#644EFF]"
              >
                <i className="ri-link-m mr-1"></i>
                Connected
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Earnings"
            value={`${artist.earnings.toFixed(3)} ETH`}
            icon={<i className="ri-coin-line text-[#1DB954]"></i>}
            description="Lifetime earnings"
            change={{ value: "0.42 ETH this month", positive: true }}
          />
          <StatsCard
            title="Supporters"
            value={artist.supporters}
            icon={<i className="ri-user-heart-line text-[#644EFF]"></i>}
            description="Unique supporters"
            change={{ value: "24 new this month", positive: true }}
          />
          <StatsCard
            title="Monthly Listeners"
            value={artist.monthlyListeners.toLocaleString()}
            icon={<i className="ri-volume-up-line text-[#FFD600]"></i>}
            change={{ value: "12% increase", positive: true }}
          />
          <StatsCard
            title="Revenue Split"
            value="95%"
            icon={<i className="ri-pie-chart-line text-green-500"></i>}
            description="Direct to your wallet"
          />
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Music</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle>Your Tracks</CardTitle>
                    <CardDescription>
                      Track performance and earnings for your music
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {artistTracks && artistTracks.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#282828] text-[#B3B3B3] text-xs text-left">
                              <th className="py-3 px-2 w-10 text-center">#</th>
                              <th className="py-3 px-4">TITLE</th>
                              <th className="py-3 px-4">DURATION</th>
                              <th className="py-3 px-4 text-right">EARNINGS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {artistTracks.map((track, index) => (
                              <TrackRow key={track.id} track={track} index={index} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <i className="ri-music-2-line text-4xl text-[#B3B3B3] mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
                        <p className="text-[#B3B3B3] mb-4">
                          Upload your first track to start earning
                        </p>
                        <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black">
                          Upload Music
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-[#181818] border-[#282828] mb-6">
                  <CardHeader>
                    <CardTitle>Listener Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>United States</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-[#282828] rounded-full h-2">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>United Kingdom</span>
                          <span>18%</span>
                        </div>
                        <div className="w-full bg-[#282828] rounded-full h-2">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Germany</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-[#282828] rounded-full h-2">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Canada</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-[#282828] rounded-full h-2">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Other</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-[#282828] rounded-full h-2">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center mr-3 mt-1">
                          <i className="ri-user-add-line text-[#1DB954]"></i>
                        </div>
                        <div>
                          <p className="text-sm">+124 new followers this week</p>
                          <p className="text-xs text-[#B3B3B3]">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center mr-3 mt-1">
                          <i className="ri-play-circle-line text-[#1DB954]"></i>
                        </div>
                        <div>
                          <p className="text-sm">"Crypto Symphony" reached 100K plays</p>
                          <p className="text-xs text-[#B3B3B3]">5 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center mr-3 mt-1">
                          <i className="ri-coin-line text-[#644EFF]"></i>
                        </div>
                        <div>
                          <p className="text-sm">Received 0.15 ETH in earnings</p>
                          <p className="text-xs text-[#B3B3B3]">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <UploadMusicForm />
          </TabsContent>
          
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-[#181818] border-[#282828]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#B3B3B3] text-sm font-medium">Available to Withdraw</p>
                    <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center">
                      <i className="ri-bank-line text-[#1DB954]"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{(artist.earnings * 0.8).toFixed(3)} ETH</p>
                  <Button className="mt-3 w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-medium">
                    Withdraw to Wallet
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-[#181818] border-[#282828]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#B3B3B3] text-sm font-medium">This Month</p>
                    <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center">
                      <i className="ri-calendar-line text-[#644EFF]"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold">0.423 ETH</p>
                  <div className="flex items-center mt-3">
                    <div className="h-2 flex-1 bg-[#282828] rounded-full overflow-hidden">
                      <div className="h-full bg-[#644EFF]" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-xs ml-2 text-[#B3B3B3]">+72%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#181818] border-[#282828]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#B3B3B3] text-sm font-medium">Top Earning Track</p>
                    <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center">
                      <i className="ri-trophy-line text-[#FFD600]"></i>
                    </div>
                  </div>
                  <p className="font-bold">Crypto Symphony</p>
                  <p className="text-sm text-[#B3B3B3] mb-2">Generated 0.23 ETH</p>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50"
                      alt="Album cover"
                      className="w-8 h-8 rounded"
                    />
                    <div className="flex-1 h-1 bg-[#282828] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1DB954] to-[#644EFF]" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-[#181818] border-[#282828] mb-6">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  All blockchain payments received from your fans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#282828] text-[#B3B3B3] text-xs text-left">
                        <th className="py-3 px-4">DATE</th>
                        <th className="py-3 px-4">FROM</th>
                        <th className="py-3 px-4">AMOUNT</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">TRANSACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <PaymentRow 
                        tx={{
                          id: 1,
                          artist: artist.name,
                          artistId: artist.id,
                          artistImg: artist.imageUrl,
                          amount: 0.01,
                          date: "2023-04-15",
                          status: "Completed",
                          txHash: "0x1234567890abcdef1234567890abcdef12345678",
                          fromAddress: "0x7890123456789012345678901234567890123456",
                          userId: 1,
                          createdAt: new Date()
                        }}
                        index={0}
                      />
                      <PaymentRow 
                        tx={{
                          id: 2,
                          artist: artist.name,
                          artistId: artist.id,
                          artistImg: artist.imageUrl,
                          amount: 0.005,
                          date: "2023-04-12",
                          status: "Completed",
                          txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
                          fromAddress: "0x8901234567890123456789012345678901234567",
                          userId: 2,
                          createdAt: new Date()
                        }}
                        index={1}
                      />
                      <PaymentRow 
                        tx={{
                          id: 3,
                          artist: artist.name,
                          artistId: artist.id,
                          artistImg: artist.imageUrl,
                          amount: 0.015,
                          date: "2023-04-10",
                          status: "Completed",
                          txHash: "0x9012345678901234567890123456789012345678",
                          fromAddress: "0x9012345678901234567890123456789012345678",
                          userId: 3,
                          createdAt: new Date()
                        }}
                        index={2}
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#181818] border-[#282828]">
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>
                  Configure how you receive your earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#282828] rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#282828] flex items-center justify-center mr-4">
                        <i className="ri-wallet-3-line text-[#644EFF]"></i>
                      </div>
                      <div>
                        <p className="font-medium">ETH Wallet</p>
                        <p className="text-xs text-[#B3B3B3]">{account}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Primary</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-[#644EFF] text-[#644EFF] hover:bg-[#644EFF] hover:text-white"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-[#181818] border-[#282828] mb-6">
                  <CardHeader>
                    <CardTitle>Artist Profile</CardTitle>
                    <CardDescription>
                      Update your artist information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[#B3B3B3] mb-1 block">Artist Name</label>
                          <Input
                            value={artist.name}
                            className="bg-[#282828] border-[#383838]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-[#B3B3B3] mb-1 block">Genre</label>
                          <Input
                            value={artist.genre}
                            className="bg-[#282828] border-[#383838]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-[#B3B3B3] mb-1 block">Bio</label>
                        <Textarea
                          value={artist.bio}
                          className="bg-[#282828] border-[#383838] resize-none h-24"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-medium">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle>Blockchain Settings</CardTitle>
                    <CardDescription>
                      Configure your blockchain preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#B3B3B3] mb-1 block">Connected Wallet</label>
                        <div className="flex">
                          <Input
                            value={account}
                            disabled
                            className="bg-[#282828] border-[#383838] rounded-r-none flex-1"
                          />
                          <Button variant="outline" className="rounded-l-none border-[#383838] border-l-0">
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-[#282828] rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#282828] flex items-center justify-center mr-4">
                            <i className="ri-percent-line text-[#644EFF]"></i>
                          </div>
                          <div>
                            <p className="font-medium">Revenue Split</p>
                            <p className="text-xs text-[#B3B3B3]">You receive 95% of all payments directly to your wallet</p>
                          </div>
                        </div>
                        <Badge className="bg-[#644EFF] text-white">95%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-[#181818] border-[#282828] mb-6">
                  <CardHeader>
                    <CardTitle>Profile Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <img 
                        src={artist.imageUrl} 
                        alt={artist.name} 
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <Button variant="outline" className="border-[#644EFF] text-[#644EFF]">
                        Change Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#181818] border-[#282828]">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#383838]"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Refresh Account Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#383838]"
                      >
                        <i className="ri-lock-line mr-2"></i>
                        Privacy Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#383838] text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500"
                      >
                        <i className="ri-delete-bin-line mr-2"></i>
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ArtistDashboard;