import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ className, onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch && searchQuery) {
        onSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, onSearch]);
  
  return (
    <div className={`relative ${className || "w-full md:w-1/3 max-w-md"}`}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]"></i>
          <Input
            type="text"
            placeholder="Search artists, songs, or playlists"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#282828] rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-white text-sm text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
