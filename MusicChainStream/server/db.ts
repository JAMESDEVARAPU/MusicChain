
// In-memory storage implementation
const store = {
  users: new Map(),
  artists: new Map(),
  tracks: new Map(),
  playlists: new Map(),
  transactions: new Map()
};

export const db = {
  // User operations
  getUser: (id: number) => store.users.get(id),
  createUser: (data: any) => {
    const id = store.users.size + 1;
    store.users.set(id, { ...data, id });
    return { id, ...data };
  },

  // Artist operations
  getArtist: (id: number) => store.artists.get(id),
  createArtist: (data: any) => {
    const id = store.artists.size + 1;
    store.artists.set(id, { ...data, id });
    return { id, ...data };
  },

  // Track operations
  getTrack: (id: number) => store.tracks.get(id),
  createTrack: (data: any) => {
    const id = store.tracks.size + 1;
    store.tracks.set(id, { ...data, id });
    return { id, ...data };
  },

  // Playlist operations
  getPlaylist: (id: number) => store.playlists.get(id),
  createPlaylist: (data: any) => {
    const id = store.playlists.size + 1;
    store.playlists.set(id, { ...data, id });
    return { id, ...data };
  },

  // Transaction operations
  getTransaction: (id: number) => store.transactions.get(id),
  createTransaction: (data: any) => {
    const id = store.transactions.size + 1;
    store.transactions.set(id, { ...data, id });
    return { id, ...data };
  }
};

// No need for connection check since we're using in-memory storage
export async function checkDatabaseConnection() {
  return true;
}
