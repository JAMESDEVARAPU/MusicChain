import { Artist, Track, Playlist, Transaction } from "@shared/schema";

// Featured Artists
export const featuredArtists: Artist[] = [
  {
    id: 1,
    name: "The Blockchain Beats",
    imageUrl: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Electronic • Blockchain",
    followers: 145029,
    monthlyListeners: 2450672,
    bio: "The Blockchain Beats are pioneers in electronic music who have embraced blockchain technology to directly connect with their fans.",
    blockchain: true,
    earnings: 5.432,
    supporters: 1245
  },
  {
    id: 2,
    name: "Crypto Keys",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Piano • Jazz",
    followers: 95483,
    monthlyListeners: 1243892,
    bio: "Crypto Keys blends classical piano with jazz influences, creating a unique sound that has garnered a loyal following on the blockchain.",
    blockchain: true,
    earnings: 3.782,
    supporters: 894
  },
  {
    id: 3,
    name: "Decentralized Sound",
    imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Alternative • Rock",
    followers: 78651,
    monthlyListeners: 987432,
    bio: "Decentralized Sound is an alternative rock band that has embraced Web3 technologies to distribute their music and connect with fans.",
    blockchain: true,
    earnings: 2.531,
    supporters: 671
  },
  {
    id: 4,
    name: "Ethereum Echoes",
    imageUrl: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Electronic • Ambient",
    followers: 67329,
    monthlyListeners: 856421,
    bio: "Ethereum Echoes creates ambient electronic music inspired by the decentralized future promised by blockchain technology.",
    blockchain: true,
    earnings: 4.128,
    supporters: 942
  },
  {
    id: 5,
    name: "Token Tunes",
    imageUrl: "https://images.unsplash.com/photo-1577450845899-5f0abc67c01e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Hip Hop • Rap",
    followers: 154832,
    monthlyListeners: 2142567,
    bio: "Token Tunes is a hip hop collective that writes lyrics about crypto, blockchain, and the future of digital ownership.",
    blockchain: true,
    earnings: 7.219,
    supporters: 1853
  },
  {
    id: 6,
    name: "NFT Symphony",
    imageUrl: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    genre: "Classical • Instrumental",
    followers: 48652,
    monthlyListeners: 529874,
    bio: "NFT Symphony creates orchestral arrangements that are released as limited NFTs, allowing collectors to own a piece of musical history.",
    blockchain: true,
    earnings: 1.862,
    supporters: 412
  }
];

// Recently Played Tracks
export const recentTracks: Track[] = [
  {
    id: 1,
    title: "Crypto Symphony",
    artist: "The Blockchain Beats",
    artistId: 1,
    album: "Digital Assets",
    duration: "3:45",
    albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    audioUrl: "https://example.com/crypto-symphony.mp3",
    earnings: 0.002
  },
  {
    id: 2,
    title: "Smart Contract",
    artist: "Crypto Keys",
    artistId: 2,
    album: "Decentralized",
    duration: "4:20",
    albumCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    audioUrl: "https://example.com/smart-contract.mp3",
    earnings: 0.001
  },
  {
    id: 3,
    title: "Blockchain Ballad",
    artist: "Decentralized Sound",
    artistId: 3,
    album: "Web3 Anthology",
    duration: "3:17",
    albumCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    audioUrl: "https://example.com/blockchain-ballad.mp3",
    earnings: 0.003
  },
  {
    id: 4,
    title: "Distributed Ledger",
    artist: "Ethereum Echoes",
    artistId: 4,
    album: "Tech Beats",
    duration: "2:54",
    albumCover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    audioUrl: "https://example.com/distributed-ledger.mp3",
    earnings: 0.002
  },
  {
    id: 5,
    title: "Tokenized Love",
    artist: "NFT Symphony",
    artistId: 6,
    album: "Digital Assets",
    duration: "3:30",
    albumCover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    audioUrl: "https://example.com/tokenized-love.mp3",
    earnings: 0.005
  }
];

// Recommended Playlists
export const recommendedPlaylists: Playlist[] = [
  {
    id: 1,
    name: "Daily Mix 1",
    description: "The Blockchain Beats, Crypto Keys and more",
    coverUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "BlockBeats",
    trackCount: 15,
    duration: "52 min",
    blockchainArtists: 5
  },
  {
    id: 2,
    name: "Discover Weekly",
    description: "Your weekly mix of fresh music based on your listening",
    coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "BlockBeats",
    trackCount: 30,
    duration: "1 hr 45 min",
    blockchainArtists: 8
  },
  {
    id: 3,
    name: "Blockchain Hits",
    description: "Top tracks from blockchain-supporting artists",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "BlockBeats",
    trackCount: 20,
    duration: "1 hr 12 min",
    blockchainArtists: 12
  },
  {
    id: 4,
    name: "Web3 Artists",
    description: "Emerging talent in the blockchain music space",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "BlockBeats",
    trackCount: 25,
    duration: "1 hr 28 min",
    blockchainArtists: 15
  },
  {
    id: 5,
    name: "Release Radar",
    description: "Catch all the latest releases from artists you follow",
    coverUrl: "https://images.unsplash.com/photo-1526327760257-75f515c74478?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "BlockBeats",
    trackCount: 35,
    duration: "2 hr 10 min",
    blockchainArtists: 7
  }
];

// Artist Playlists
export const artistPlaylists: Playlist[] = [
  {
    id: 6,
    name: "Digital Assets",
    description: "The debut album from The Blockchain Beats",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "The Blockchain Beats",
    trackCount: 12,
    duration: "42 min",
    blockchainArtists: 1
  },
  {
    id: 7,
    name: "Decentralized Remix",
    description: "Remixes of our most popular tracks",
    coverUrl: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "The Blockchain Beats",
    trackCount: 8,
    duration: "34 min",
    blockchainArtists: 1
  },
  {
    id: 8,
    name: "Live on the Chain",
    description: "Recordings from our live blockchain tour",
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "The Blockchain Beats",
    trackCount: 10,
    duration: "50 min",
    blockchainArtists: 1
  }
];

// Transaction History
export const transactions: Transaction[] = [
  {
    id: 1,
    artist: "The Blockchain Beats",
    artistImg: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
    amount: 0.01,
    date: "2023-06-15",
    status: "Completed",
    txHash: "0x1234567890abcdef1234567890abcdef12345678"
  },
  {
    id: 2,
    artist: "Crypto Keys",
    artistImg: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
    amount: 0.005,
    date: "2023-06-12",
    status: "Completed",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef12"
  },
  {
    id: 3,
    artist: "Decentralized Sound",
    artistImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
    amount: 0.008,
    date: "2023-06-05",
    status: "Completed",
    txHash: "0x7890abcdef1234567890abcdef1234567890abcd"
  }
];

// Library Playlists
export const userPlaylists: Playlist[] = [
  {
    id: 9,
    name: "My Favorites",
    description: "A collection of my favorite tracks",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "You",
    trackCount: 37,
    duration: "2 hr 15 min",
    blockchainArtists: 12
  },
  {
    id: 10,
    name: "Workout Mix",
    description: "Energetic tracks for your workout",
    coverUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "You",
    trackCount: 25,
    duration: "1 hr 32 min",
    blockchainArtists: 5
  },
  {
    id: 11,
    name: "Blockchain Discovery",
    description: "New artists using blockchain technology",
    coverUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
    creator: "You",
    trackCount: 18,
    duration: "1 hr 05 min",
    blockchainArtists: 18
  }
];

// Artist Tracks
export const artistTracks: Record<number, Track[]> = {
  1: [
    {
      id: 1,
      title: "Crypto Symphony",
      artist: "The Blockchain Beats",
      artistId: 1,
      album: "Digital Assets",
      duration: "3:45",
      albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
      audioUrl: "https://example.com/crypto-symphony.mp3",
      earnings: 0.002
    },
    {
      id: 6,
      title: "DeFi Dreams",
      artist: "The Blockchain Beats",
      artistId: 1,
      album: "Digital Assets",
      duration: "4:12",
      albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
      audioUrl: "https://example.com/defi-dreams.mp3",
      earnings: 0.003
    },
    {
      id: 7,
      title: "Wallet",
      artist: "The Blockchain Beats",
      artistId: 1,
      album: "Digital Assets",
      duration: "3:28",
      albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
      audioUrl: "https://example.com/wallet.mp3",
      earnings: 0.001
    },
    {
      id: 8,
      title: "Mining",
      artist: "The Blockchain Beats",
      artistId: 1,
      album: "Digital Assets",
      duration: "5:01",
      albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
      audioUrl: "https://example.com/mining.mp3",
      earnings: 0.002
    },
    {
      id: 9,
      title: "Proof of Work",
      artist: "The Blockchain Beats",
      artistId: 1,
      album: "Digital Assets",
      duration: "3:55",
      albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
      audioUrl: "https://example.com/proof-of-work.mp3",
      earnings: 0.004
    }
  ]
};
