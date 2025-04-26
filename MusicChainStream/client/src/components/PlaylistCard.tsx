import { Playlist } from "@shared/schema";
import { Link } from "wouter";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <a className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition duration-200 cursor-pointer group">
        <div className="relative mb-4">
          <img 
            src={playlist.coverUrl} 
            alt={playlist.name}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-2 right-2 h-10 w-10 bg-[#1DB954] rounded-full shadow-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <i className="ri-play-fill text-black text-xl"></i>
          </div>
        </div>
        <h3 className="font-bold text-white truncate">{playlist.name}</h3>
        <p className="text-[#B3B3B3] text-sm mt-1 line-clamp-2">{playlist.description}</p>
      </a>
    </Link>
  );
};

export default PlaylistCard;
