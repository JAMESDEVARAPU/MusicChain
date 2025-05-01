import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Search, Library, User, Music2 } from "lucide-react";

function Sidebar() {
  const [location] = useLocation();
  const isMobile = window.innerWidth <= 768;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  if (!isMobile) {
    navItems.push({ icon: Music2, label: "Now Playing", path: "/now-playing" });
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col w-60 bg-[#121212] text-white h-screen fixed left-0 top-0 p-6">
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 text-sm font-medium transition-colors hover:text-white",
                location === item.path ? "text-white" : "text-gray-400"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212] text-white p-2 flex justify-around items-center border-t border-[#282828]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2",
              location === item.path ? "text-white" : "text-gray-400"
            )}
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Sidebar;