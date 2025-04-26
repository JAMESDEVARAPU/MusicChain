import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { format } from "date-fns";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";
  
  // User routes
  app.get(`${apiPrefix}/users/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post(`${apiPrefix}/users`, async (req, res) => {
    try {
      const newUser = await storage.createUser(req.body);
      // Don't send the password
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // Artist routes
  app.get(`${apiPrefix}/artists`, async (req, res) => {
    const artists = await storage.getArtists();
    res.json(artists);
  });
  
  app.get(`${apiPrefix}/artists/featured`, async (req, res) => {
    const artists = await storage.getFeaturedArtists();
    res.json(artists);
  });
  
  app.get(`${apiPrefix}/artists/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const artist = await storage.getArtist(id);
    
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    
    res.json(artist);
  });
  
  app.get(`${apiPrefix}/artists/:id/tracks`, async (req, res) => {
    const id = parseInt(req.params.id);
    const tracks = await storage.getTracksByArtist(id);
    res.json(tracks);
  });
  
  app.get(`${apiPrefix}/artists/:id/playlists`, async (req, res) => {
    const id = parseInt(req.params.id);
    const playlists = await storage.getPlaylistsByArtist(id);
    res.json(playlists);
  });
  
  app.post(`${apiPrefix}/artists/:id/pay`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      const { amount, fromAddress } = req.body;
      
      if (!amount || !fromAddress) {
        return res.status(400).json({ message: "Amount and fromAddress are required" });
      }
      
      // Generate a mock transaction hash
      const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
      
      // Create a new transaction
      const transactionData = {
        userId: 1, // Default user for now
        artist: artist.name,
        artistId: artist.id,
        artistImg: artist.imageUrl,
        amount,
        date: format(new Date(), "yyyy-MM-dd"),
        status: "Completed",
        txHash,
        fromAddress
      };
      
      const parsed = insertTransactionSchema.safeParse(transactionData);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid transaction data", errors: parsed.error });
      }
      
      const transaction = await storage.createTransaction(parsed.data);
      
      res.status(201).json({
        message: "Payment successful",
        transaction
      });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ message: "Payment failed" });
    }
  });
  
  // Track routes
  app.get(`${apiPrefix}/tracks`, async (req, res) => {
    const tracks = await storage.getTracks();
    res.json(tracks);
  });
  
  app.get(`${apiPrefix}/tracks/recent`, async (req, res) => {
    const tracks = await storage.getRecentTracks();
    res.json(tracks);
  });
  
  app.get(`${apiPrefix}/tracks/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const track = await storage.getTrack(id);
    
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    
    res.json(track);
  });
  
  // Track upload route
  app.post(`${apiPrefix}/tracks`, async (req, res) => {
    try {
      console.log("Received track upload request:", req.body);
      
      const { title, album, duration, description, artistWallet, audioUrl, albumCover } = req.body;
      
      // Validate required fields
      if (!title || !album || !duration) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: "Title, album, and duration are required" 
        });
      }
      
      // Find the artist by wallet address (using a fake lookup for demo)
      // In a real app, we would get the artist ID from the authenticated user
      const artistId = 1; // Using the first artist for demo purposes
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      // Keep the original audio URL if it's a real URL or use a demo URL that actually works
      const demoAudioUrl = "https://cdn.freesound.org/previews/563/563087_12593596-lq.mp3";
      
      // Create the track with all necessary fields and default values
      const trackData = {
        title,
        album,
        artist: artist.name,
        artistId,
        duration,
        albumCover: albumCover || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
        // Use either the provided audio URL (if not blob or example), or use the demo URL
        audioUrl: (audioUrl && !audioUrl.startsWith('blob:') && !audioUrl.includes('example.com')) 
          ? audioUrl 
          : demoAudioUrl,
        playCount: 0,
        earnings: 0
      };
      
      console.log("Creating track with data:", trackData);
      
      const newTrack = await storage.createTrack(trackData);
      console.log("Track created successfully:", newTrack);
      
      res.status(201).json({
        message: "Track uploaded successfully",
        track: newTrack
      });
    } catch (error) {
      console.error("Track upload error:", error);
      res.status(500).json({ 
        message: "Failed to upload track", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Playlist routes
  app.get(`${apiPrefix}/playlists`, async (req, res) => {
    const playlists = await storage.getPlaylists();
    res.json(playlists);
  });
  
  app.get(`${apiPrefix}/playlists/recommended`, async (req, res) => {
    const playlists = await storage.getRecommendedPlaylists();
    res.json(playlists);
  });
  
  app.get(`${apiPrefix}/playlists/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const playlist = await storage.getPlaylist(id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    
    res.json(playlist);
  });
  
  app.get(`${apiPrefix}/playlists/:id/tracks`, async (req, res) => {
    const id = parseInt(req.params.id);
    const tracks = await storage.getPlaylistTracks(id);
    res.json(tracks);
  });
  
  // Library routes
  app.get(`${apiPrefix}/library/playlists`, async (req, res) => {
    // For now, just returning user 1's playlists
    const playlists = await storage.getUserPlaylists(1);
    res.json(playlists);
  });
  
  app.get(`${apiPrefix}/library/artists`, async (req, res) => {
    // For now, just return all artists (simulating followed artists)
    const artists = await storage.getArtists();
    res.json(artists);
  });
  
  // Transaction routes
  app.get(`${apiPrefix}/transactions`, async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });
  
  // Diagnostic route for debugging
  app.get(`${apiPrefix}/debug/tracks`, async (req, res) => {
    const tracks = await storage.getTracks();
    console.log("All tracks from debug endpoint:", tracks);
    res.json({ 
      count: tracks.length,
      tracks
    });
  });

  // Search route
  app.get(`${apiPrefix}/search`, async (req, res) => {
    const query = req.query.q as string;
    console.log("Search API called with query:", query);
    
    // If no query provided, return everything
    if (!query || query.trim() === '') {
      console.log("No query provided, returning all items");
      const artists = await storage.getArtists();
      const tracks = await storage.getTracks();
      const playlists = await storage.getPlaylists();
      
      return res.json({
        artists,
        tracks,
        playlists
      });
    }
    
    const results = await storage.search(query);
    res.json(results);
  });

  const httpServer = createServer(app);
  return httpServer;
}
