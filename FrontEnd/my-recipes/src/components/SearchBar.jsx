import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Tag } from "lucide-react";
import { useState } from "react";

export function SearchBar({ onSearch, onTagFilter, availableTags, activeTags }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTags, setShowTags] = useState(false);

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleTagToggle = (tag) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    onTagFilter(newTags);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    onSearch("");
    onTagFilter([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar recetas por nombre, ingredientes o descripción..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12 h-12 bg-card border-border/50 focus:border-primary focus:ring-primary/20 text-base"
        />
        {(searchQuery || activeTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tags Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTags(!showTags)}
          className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Tag className="h-4 w-4 mr-2" />
          Filtrar por tags
        </Button>
        
        {activeTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Activos:</span>
            <div className="flex flex-wrap gap-1">
              {activeTags.map(tag => (
                <Badge
                  key={tag}
                  variant="default"
                  className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Tags */}
      {showTags && (
        <div className="bg-card border rounded-lg p-4 shadow-card">
          <h4 className="font-medium text-sm text-foreground mb-3">Tags disponibles:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  activeTags.includes(tag)
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}