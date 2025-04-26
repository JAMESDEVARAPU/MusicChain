import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  walletAddress: true,
});

// Artist table
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  genre: text("genre").notNull(),
  bio: text("bio"),
  followers: integer("followers").default(0).notNull(),
  monthlyListeners: integer("monthly_listeners").default(0).notNull(),
  blockchain: boolean("blockchain").default(false).notNull(),
  walletAddress: text("wallet_address"),
  earnings: real("earnings").default(0).notNull(),
  supporters: integer("supporters").default(0).notNull(),
});

export const insertArtistSchema = createInsertSchema(artists).pick({
  name: true,
  imageUrl: true,
  genre: true,
  bio: true,
  followers: true,
  monthlyListeners: true,
  blockchain: true,
  walletAddress: true,
  earnings: true,
  supporters: true,
});

// Track table
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  artistId: integer("artist_id").notNull(),
  album: text("album").notNull(),
  duration: text("duration").notNull(),
  albumCover: text("album_cover").notNull(),
  audioUrl: text("audio_url").notNull(),
  earnings: real("earnings").default(0).notNull(),
  playCount: integer("play_count").default(0).notNull(),
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  title: true,
  artist: true,
  artistId: true,
  album: true,
  duration: true,
  albumCover: true,
  audioUrl: true,
  earnings: true,
  playCount: true,
});

// Playlist table
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url").notNull(),
  creator: text("creator").notNull(),
  trackCount: integer("track_count").default(0).notNull(),
  duration: text("duration").notNull(),
  blockchainArtists: integer("blockchain_artists").default(0).notNull(),
  userId: integer("user_id"),
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  name: true,
  description: true,
  coverUrl: true,
  creator: true,
  trackCount: true,
  duration: true,
  blockchainArtists: true,
  userId: true,
});

// Playlist tracks junction table
export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull(),
  trackId: integer("track_id").notNull(),
  position: integer("position").notNull(),
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).pick({
  playlistId: true,
  trackId: true,
  position: true,
});

// Transactions table for blockchain payments
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  artist: text("artist").notNull(),
  artistId: integer("artist_id").notNull(),
  artistImg: text("artist_img").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  txHash: text("tx_hash").notNull(),
  fromAddress: text("from_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  artist: true,
  artistId: true,
  artistImg: true,
  amount: true,
  date: true,
  status: true,
  txHash: true,
  fromAddress: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;

export type PlaylistTrack = typeof playlistTracks.$inferSelect;
export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
