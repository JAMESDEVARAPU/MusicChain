import { Link, useLocation } from "wouter";

const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="sidebar bg-[#121212] md:w-64 w-full md:h-full md:fixed z-40">

      <div className="p-6">
        <div className="flex items-center mb-8">
          <i className="ri-rhythm-line text-[#1DB954] text-2xl mr-2"></i>
          <h1 className="text-2xl font-bold font-heading text-white">BlockBeats</h1>
        </div>

        <nav>
          <ul className="space-y-4">
            <li className="group">
              <Link 
                href="/" 
                className={`flex items-center ${isActive('/') ? 'text-white opacity-90' : 'text-[#B3B3B3] hover:text-white'} font-medium`}
              >
                <i className="ri-home-4-line mr-4 text-xl"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="group">
              <Link 
                href="/search" 
                className={`flex items-center ${isActive('/search') ? 'text-white opacity-90' : 'text-[#B3B3B3] hover:text-white'} font-medium`}
              >
                <i className="ri-search-line mr-4 text-xl"></i>
                <span>Search</span>
              </Link>
            </li>
            <li className="group">
              <Link 
                href="/library" 
                className={`flex items-center ${isActive('/library') ? 'text-white opacity-90' : 'text-[#B3B3B3] hover:text-white'} font-medium`}
              >
                <i className="ri-album-line mr-4 text-xl"></i>
                <span>Your Library</span>
              </Link>
            </li>
            <li className="mt-8 group">
              <a href="#" className="flex items-center text-[#B3B3B3] hover:text-white font-medium">
                <i className="ri-add-box-line mr-4 text-xl"></i>
                <span>Create Playlist</span>
              </a>
            </li>
            <li className="group">
              <a href="#" className="flex items-center text-[#B3B3B3] hover:text-white font-medium">
                <i className="ri-heart-line mr-4 text-xl"></i>
                <span>Liked Songs</span>
              </a>
            </li>
            <li className="group">
              <Link 
                href="/payments" 
                className={`flex items-center ${isActive('/payments') ? 'text-white opacity-90' : 'text-[#B3B3B3] hover:text-white'} font-medium`}
              >
                <div className="w-5 h-5 mr-4 bg-gradient-to-br from-[#1DB954] to-[#644EFF] flex items-center justify-center rounded-sm">
                  <i className="ri-coin-line text-xs text-white"></i>
                </div>
                <span>Artist Payments</span>
              </Link>
            </li>
            <li className="group">
              <Link 
                href="/artist-dashboard" 
                className={`flex items-center ${isActive('/artist-dashboard') ? 'text-white opacity-90' : 'text-[#B3B3B3] hover:text-white'} font-medium`}
              >
                <div className="w-5 h-5 mr-4 bg-[#644EFF] flex items-center justify-center rounded-sm">
                  <i className="ri-user-star-line text-xs text-white"></i>
                </div>
                <span>Artist Dashboard</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-8 border-t border-[#282828] pt-4">
          <h3 className="text-xs text-[#B3B3B3] uppercase font-bold mb-4 tracking-wider">Your Playlists</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-[#B3B3B3] hover:text-white">Chill Vibes</a></li>
            <li><a href="#" className="text-[#B3B3B3] hover:text-white">Workout Mix</a></li>
            <li><a href="#" className="text-[#B3B3B3] hover:text-white">Indie Discoveries</a></li>
            <li><a href="#" className="text-[#B3B3B3] hover:text-white">Electronic Beats</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;