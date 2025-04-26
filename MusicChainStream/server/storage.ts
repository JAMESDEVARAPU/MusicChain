import { 
  users, User, InsertUser,
  artists, Artist, InsertArtist,
  tracks, Track, InsertTrack,
  playlists, Playlist, InsertPlaylist,
  playlistTracks, PlaylistTrack, InsertPlaylistTrack,
  transactions, Transaction, InsertTransaction
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Artist operations
  getArtists(): Promise<Artist[]>;
  getFeaturedArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtistEarnings(id: number, amount: number): Promise<Artist | undefined>;
  
  // Track operations
  getTracks(): Promise<Track[]>;
  getRecentTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  getTracksByArtist(artistId: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  // Playlist operations
  getPlaylists(): Promise<Playlist[]>;
  getRecommendedPlaylists(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistsByArtist(artistId: number): Promise<Playlist[]>;
  getUserPlaylists(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Playlist tracks operations
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Search operations
  search(query: string): Promise<{
    artists: Artist[],
    tracks: Track[],
    playlists: Playlist[]
  }>;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private artistStore: Map<number, Artist>;
  private trackStore: Map<number, Track>;
  private playlistStore: Map<number, Playlist>;
  private playlistTrackStore: Map<number, PlaylistTrack>;
  private transactionStore: Map<number, Transaction>;
  
  private userId: number;
  private artistId: number;
  private trackId: number;
  private playlistId: number;
  private playlistTrackId: number;
  private transactionId: number;
  
  constructor() {
    this.userStore = new Map();
    this.artistStore = new Map();
    this.trackStore = new Map();
    this.playlistStore = new Map();
    this.playlistTrackStore = new Map();
    this.transactionStore = new Map();
    
    this.userId = 1;
    this.artistId = 1;
    this.trackId = 1;
    this.playlistId = 1;
    this.playlistTrackId = 1;
    this.transactionId = 1;
    
    // Initialize with sample data for development
    this.seedData();
  }
  
  private seedData() {
    // Sample artists
    const artists = [
      {
        name: "The Blockchain Beats",
        imageUrl: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Electronic • Blockchain",
        bio: "The Blockchain Beats are pioneers in electronic music who have embraced blockchain technology to directly connect with their fans.",
        followers: 145029,
        monthlyListeners: 2450672,
        blockchain: true,
        walletAddress: "0x1234567890123456789012345678901234567890",
        earnings: 5.432,
        supporters: 1245
      },
      {
        name: "Crypto Keys",
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Piano • Jazz",
        bio: "Crypto Keys blends classical piano with jazz influences, creating a unique sound that has garnered a loyal following on the blockchain.",
        followers: 95483,
        monthlyListeners: 1243892,
        blockchain: true,
        walletAddress: "0x2345678901234567890123456789012345678901",
        earnings: 3.782,
        supporters: 894
      },
      {
        name: "Decentralized Sound",
        imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Alternative • Rock",
        bio: "Decentralized Sound is an alternative rock band that has embraced Web3 technologies to distribute their music and connect with fans.",
        followers: 78651,
        monthlyListeners: 987432,
        blockchain: true,
        walletAddress: "0x3456789012345678901234567890123456789012",
        earnings: 2.531,
        supporters: 671
      },
      {
        name: "Ethereum Echoes",
        imageUrl: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Electronic • Ambient",
        bio: "Ethereum Echoes creates ambient electronic music inspired by the decentralized future promised by blockchain technology.",
        followers: 67329,
        monthlyListeners: 856421,
        blockchain: true,
        walletAddress: "0x4567890123456789012345678901234567890123",
        earnings: 4.128,
        supporters: 942
      },
      {
        name: "Token Tunes",
        imageUrl: "https://images.unsplash.com/photo-1577450845899-5f0abc67c01e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Hip Hop • Rap",
        bio: "Token Tunes is a hip hop collective that writes lyrics about crypto, blockchain, and the future of digital ownership.",
        followers: 154832,
        monthlyListeners: 2142567,
        blockchain: true,
        walletAddress: "0x5678901234567890123456789012345678901234",
        earnings: 7.219,
        supporters: 1853
      },
      {
        name: "NFT Symphony",
        imageUrl: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        genre: "Classical • Instrumental",
        bio: "NFT Symphony creates orchestral arrangements that are released as limited NFTs, allowing collectors to own a piece of musical history.",
        followers: 48652,
        monthlyListeners: 529874,
        blockchain: true,
        walletAddress: "0x6789012345678901234567890123456789012345",
        earnings: 1.862,
        supporters: 412
      }
    ];
    
    artists.forEach(artist => this.createArtist(artist));
    
    // Sample tracks
    const tracks = [
      {
        title: "Crypto Symphony",
        artist: "The Blockchain Beats",
        artistId: 1,
        album: "Digital Assets",
        duration: "3:45",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/563/563087_12593596-lq.mp3", // Real working audio URL
        earnings: 0.002,
        playCount: 254689
      },
      {
        title: "Smart Contract",
        artist: "Crypto Keys",
        artistId: 2,
        album: "Decentralized",
        duration: "4:20",
        albumCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/649/649408_5674468-lq.mp3", // Real working audio URL
        earnings: 0.001,
        playCount: 187532
      },
      {
        title: "Blockchain Ballad",
        artist: "Decentralized Sound",
        artistId: 3,
        album: "Web3 Anthology",
        duration: "3:17",
        albumCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/648/648347_13898517-lq.mp3", // Real working audio URL // Real working audio URL
        earnings: 0.003,
        playCount: 145698
      },
      {
        title: "Distributed Ledger",
        artist: "Ethereum Echoes",
        artistId: 4,
        album: "Tech Beats",
        duration: "2:54",
        albumCover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/612/612797_5674468-lq.mp3", // Real working audio URL
        earnings: 0.002,
        playCount: 130456
      },
      {
        title: "Tokenized Love",
        artist: "NFT Symphony",
        artistId: 6,
        album: "Digital Assets",
        duration: "3:30",
        albumCover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/636/636726_13167901-lq.mp3", // Real working audio URL
        earnings: 0.005,
        playCount: 110235
      },
      {
        title: "DeFi Dreams",
        artist: "The Blockchain Beats",
        artistId: 1,
        album: "Digital Assets",
        duration: "4:12",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/466/466484_9383800-lq.mp3", // Real working audio URL
        earnings: 0.003,
        playCount: 198752
      },
      {
        title: "Wallet",
        artist: "The Blockchain Beats",
        artistId: 1,
        album: "Digital Assets",
        duration: "3:28",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/467/467018_9383800-lq.mp3", // Real working audio URL
        earnings: 0.001,
        playCount: 167432
      },
      {
        title: "Mining",
        artist: "The Blockchain Beats",
        artistId: 1,
        album: "Digital Assets",
        duration: "5:01",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/396/396096_4024596-lq.mp3", // Real working audio URL
        earnings: 0.002,
        playCount: 142567
      },
      {
        title: "Proof of Work",
        artist: "The Blockchain Beats",
        artistId: 1,
        album: "Digital Assets",
        duration: "3:55",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        audioUrl: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3", // Real working audio URL
        earnings: 0.004,
        playCount: 132456
      }
    ];
    
    tracks.forEach(track => this.createTrack(track));
    
    // Sample playlists
    const playlists = [
      {
        name: "Daily Mix 1",
        description: "The Blockchain Beats, Crypto Keys and more",
        coverUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "BlockBeats",
        trackCount: 15,
        duration: "52 min",
        blockchainArtists: 5
      },
      {
        name: "Discover Weekly",
        description: "Your weekly mix of fresh music based on your listening",
        coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "BlockBeats",
        trackCount: 30,
        duration: "1 hr 45 min",
        blockchainArtists: 8
      },
      {
        name: "Blockchain Hits",
        description: "Top tracks from blockchain-supporting artists",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "BlockBeats",
        trackCount: 20,
        duration: "1 hr 12 min",
        blockchainArtists: 12
      },
      {
        name: "Web3 Artists",
        description: "Emerging talent in the blockchain music space",
        coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "BlockBeats",
        trackCount: 25,
        duration: "1 hr 28 min",
        blockchainArtists: 15
      },
      {
        name: "Release Radar",
        description: "Catch all the latest releases from artists you follow",
        coverUrl: "https://images.unsplash.com/photo-1526327760257-75f515c74478?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "BlockBeats",
        trackCount: 35,
        duration: "2 hr 10 min",
        blockchainArtists: 7
      },
      {
        name: "Digital Assets",
        description: "The debut album from The Blockchain Beats",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "The Blockchain Beats",
        trackCount: 12,
        duration: "42 min",
        blockchainArtists: 1
      },
      {
        name: "Decentralized Remix",
        description: "Remixes of our most popular tracks",
        coverUrl: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "The Blockchain Beats",
        trackCount: 8,
        duration: "34 min",
        blockchainArtists: 1
      },
      {
        name: "Live on the Chain",
        description: "Recordings from our live blockchain tour",
        coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "The Blockchain Beats",
        trackCount: 10,
        duration: "50 min",
        blockchainArtists: 1
      },
      {
        name: "My Favorites",
        description: "A collection of my favorite tracks",
        coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "You",
        trackCount: 37,
        duration: "2 hr 15 min",
        blockchainArtists: 12,
        userId: 1
      },
      {
        name: "Workout Mix",
        description: "Energetic tracks for your workout",
        coverUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "You",
        trackCount: 25,
        duration: "1 hr 32 min",
        blockchainArtists: 5,
        userId: 1
      },
      {
        name: "Blockchain Discovery",
        description: "New artists using blockchain technology",
        coverUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300",
        creator: "You",
        trackCount: 18,
        duration: "1 hr 05 min",
        blockchainArtists: 18,
        userId: 1
      }
    ];
    
    playlists.forEach(playlist => this.createPlaylist(playlist));
    
    // Link tracks to playlists
    // For simplicity, just add all tracks to the first playlist
    const allTracks = Array.from(this.trackStore.values());
    allTracks.forEach((track, index) => {
      this.addTrackToPlaylist({
        playlistId: 1,
        trackId: track.id,
        position: index + 1
      });
    });
    
    // Sample transactions
    const transactions = [
      {
        userId: 1,
        artist: "The Blockchain Beats",
        artistId: 1,
        artistImg: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
        amount: 0.01,
        date: "2023-06-15",
        status: "Completed",
        txHash: "0x1234567890abcdef1234567890abcdef12345678",
        fromAddress: "0x7890123456789012345678901234567890123456"
      },
      {
        userId: 1,
        artist: "Crypto Keys",
        artistId: 2,
        artistImg: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
        amount: 0.005,
        date: "2023-06-12",
        status: "Completed",
        txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        fromAddress: "0x7890123456789012345678901234567890123456"
      },
      {
        userId: 1,
        artist: "Decentralized Sound",
        artistId: 3,
        artistImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50",
        amount: 0.008,
        date: "2023-06-05",
        status: "Completed",
        txHash: "0x7890abcdef1234567890abcdef1234567890abcd",
        fromAddress: "0x7890123456789012345678901234567890123456"
      }
    ];
    
    transactions.forEach(transaction => this.createTransaction(transaction));
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.userStore.set(id, newUser);
    return newUser;
  }
  
  // Artist operations
  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artistStore.values());
  }
  
  async getFeaturedArtists(): Promise<Artist[]> {
    return Array.from(this.artistStore.values()).slice(0, 6);
  }
  
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artistStore.get(id);
  }
  
  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = this.artistId++;
    const newArtist: Artist = { ...artist, id };
    this.artistStore.set(id, newArtist);
    return newArtist;
  }
  
  async updateArtistEarnings(id: number, amount: number): Promise<Artist | undefined> {
    const artist = this.artistStore.get(id);
    if (!artist) return undefined;
    
    const updatedArtist = { 
      ...artist, 
      earnings: artist.earnings + amount,
      supporters: artist.supporters + 1
    };
    
    this.artistStore.set(id, updatedArtist);
    return updatedArtist;
  }
  
  // Track operations
  async getTracks(): Promise<Track[]> {
    return Array.from(this.trackStore.values());
  }
  
  async getRecentTracks(): Promise<Track[]> {
    const allTracks = Array.from(this.trackStore.values());
    console.log("All tracks for Recent Tracks:", allTracks);
    // Return all tracks, most recent first (higher IDs first) 
    return [...allTracks].sort((a, b) => b.id - a.id);
  }
  
  async getTrack(id: number): Promise<Track | undefined> {
    return this.trackStore.get(id);
  }
  
  async getTracksByArtist(artistId: number): Promise<Track[]> {
    return Array.from(this.trackStore.values()).filter(
      track => track.artistId === artistId
    );
  }
  
  async createTrack(track: InsertTrack): Promise<Track> {
    const id = this.trackId++;
    
    // Make sure all required fields have values
    const newTrack: Track = { 
      ...track, 
      id,
      earnings: track.earnings || 0,
      playCount: track.playCount || 0,
      // Convert blob URLs to something more permanent with real working audio file
      audioUrl: track.audioUrl?.startsWith('blob:') 
        ? 'https://cdn.freesound.org/previews/563/563087_12593596-lq.mp3' 
        : track.audioUrl,
      albumCover: track.albumCover?.startsWith('blob:') 
        ? 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300' 
        : track.albumCover
    };
    
    // Log before and after setting in the store
    console.log("About to save track to store:", newTrack);
    this.trackStore.set(id, newTrack);
    
    // Verify it's in the store
    const allTracks = Array.from(this.trackStore.values());
    console.log("All tracks after adding new one:", allTracks);
    
    return newTrack;
  }
  
  // Playlist operations
  async getPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlistStore.values());
  }
  
  async getRecommendedPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlistStore.values()).slice(0, 5);
  }
  
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlistStore.get(id);
  }
  
  async getPlaylistsByArtist(artistId: number): Promise<Playlist[]> {
    const artist = this.artistStore.get(artistId);
    if (!artist) return [];
    
    return Array.from(this.playlistStore.values()).filter(
      playlist => playlist.creator === artist.name
    );
  }
  
  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlistStore.values()).filter(
      playlist => playlist.userId === userId
    );
  }
  
  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistId++;
    const newPlaylist: Playlist = { ...playlist, id };
    this.playlistStore.set(id, newPlaylist);
    return newPlaylist;
  }
  
  // Playlist tracks operations
  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const playlistTrackEntries = Array.from(this.playlistTrackStore.values()).filter(
      pt => pt.playlistId === playlistId
    ).sort((a, b) => a.position - b.position);
    
    const tracks: Track[] = [];
    for (const entry of playlistTrackEntries) {
      const track = this.trackStore.get(entry.trackId);
      if (track) tracks.push(track);
    }
    
    return tracks;
  }
  
  async addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.playlistTrackId++;
    const newPlaylistTrack: PlaylistTrack = { ...playlistTrack, id };
    this.playlistTrackStore.set(id, newPlaylistTrack);
    
    // Update the track count in the playlist
    const playlist = this.playlistStore.get(playlistTrack.playlistId);
    if (playlist) {
      const updatedPlaylist = { ...playlist, trackCount: playlist.trackCount + 1 };
      this.playlistStore.set(playlist.id, updatedPlaylist);
    }
    
    return newPlaylistTrack;
  }
  
  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactionStore.values());
  }
  
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactionStore.values()).filter(
      transaction => transaction.userId === userId
    );
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction: Transaction = { ...transaction, id, createdAt: new Date() };
    this.transactionStore.set(id, newTransaction);
    
    // Update the artist's earnings
    this.updateArtistEarnings(transaction.artistId, transaction.amount);
    
    return newTransaction;
  }
  
  // Search operations
  async search(query: string): Promise<{
    artists: Artist[],
    tracks: Track[],
    playlists: Playlist[]
  }> {
    const lowerQuery = query.toLowerCase();
    console.log("Search query:", query);
    console.log("Available tracks:", Array.from(this.trackStore.values()));
    
    const artists = Array.from(this.artistStore.values()).filter(
      artist => artist.name.toLowerCase().includes(lowerQuery) || 
                (artist.genre && artist.genre.toLowerCase().includes(lowerQuery))
    );
    
    const tracks = Array.from(this.trackStore.values()).filter(
      track => track.title.toLowerCase().includes(lowerQuery) || 
               (track.artist && track.artist.toLowerCase().includes(lowerQuery)) || 
               (track.album && track.album.toLowerCase().includes(lowerQuery))
    );
    
    const playlists = Array.from(this.playlistStore.values()).filter(
      playlist => playlist.name.toLowerCase().includes(lowerQuery) || 
                  (playlist.description && playlist.description.toLowerCase().includes(lowerQuery))
    );
    
    console.log("Search results:", { artists, tracks, playlists });
    return { artists, tracks, playlists };
  }
}

export const storage = new MemStorage();
