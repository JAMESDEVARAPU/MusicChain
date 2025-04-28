
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
          <h3 className="text-xs text-[#B3B3B3] uppercase font-bold mb-4 tracking-wider">Components</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/components/audio-player" className="text-[#B3B3B3] hover:text-white">Audio Player</Link></li>
            <li><Link href="/components/artist-card" className="text-[#B3B3B3] hover:text-white">Artist Card</Link></li>
            <li><Link href="/components/playlist-card" className="text-[#B3B3B3] hover:text-white">Playlist Card</Link></li>
            <li><Link href="/components/track-list" className="text-[#B3B3B3] hover:text-white">Track List</Link></li>
            <li><Link href="/components/search-bar" className="text-[#B3B3B3] hover:text-white">Search Bar</Link></li>
            <li><Link href="/components/upload-form" className="text-[#B3B3B3] hover:text-white">Upload Form</Link></li>
            <li><Link href="/components/stats-card" className="text-[#B3B3B3] hover:text-white">Stats Card</Link></li>
          </ul>
        </div>

        <div className="mt-8 border-t border-[#282828] pt-4">
          <h3 className="text-xs text-[#B3B3B3] uppercase font-bold mb-4 tracking-wider">UI Components</h3>
          <ul className="space-y-3 text-sm max-h-48 overflow-y-auto">
            <li><Link href="/ui/accordion" className="text-[#B3B3B3] hover:text-white">Accordion</Link></li>
            <li><Link href="/ui/alert" className="text-[#B3B3B3] hover:text-white">Alert</Link></li>
            <li><Link href="/ui/avatar" className="text-[#B3B3B3] hover:text-white">Avatar</Link></li>
            <li><Link href="/ui/button" className="text-[#B3B3B3] hover:text-white">Button</Link></li>
            <li><Link href="/ui/card" className="text-[#B3B3B3] hover:text-white">Card</Link></li>
            <li><Link href="/ui/dialog" className="text-[#B3B3B3] hover:text-white">Dialog</Link></li>
            <li><Link href="/ui/dropdown" className="text-[#B3B3B3] hover:text-white">Dropdown</Link></li>
            <li><Link href="/ui/input" className="text-[#B3B3B3] hover:text-white">Input</Link></li>
            <li><Link href="/ui/tabs" className="text-[#B3B3B3] hover:text-white">Tabs</Link></li>
            <li><Link href="/ui/toast" className="text-[#B3B3B3] hover:text-white">Toast</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
