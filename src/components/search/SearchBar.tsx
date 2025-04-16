
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search documents by name, client, content, or tags...",
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter((s) => s !== term),
    ].slice(0, 5); // Keep only the 5 most recent searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
      onSearch(searchTerm);
      setShowSuggestions(false);
    } else {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
              if (!e.target.value) {
                onSearch("");
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="pl-9 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} className="bg-legal-primary hover:bg-legal-secondary">
          Search
        </Button>
      </div>

      {showSuggestions && recentSearches.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-popover border border-border rounded-md shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="py-1 px-2 text-xs font-medium text-muted-foreground">
            Recent Searches
          </div>
          <ul>
            {recentSearches.map((search, index) => (
              <li
                key={index}
                className="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(search)}
              >
                <SearchIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
