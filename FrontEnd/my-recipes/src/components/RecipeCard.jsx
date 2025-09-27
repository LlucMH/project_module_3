import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from "lucide-react";

export function RecipeCard({ recipe, onEdit, onDelete, onView }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? "fill-warning text-warning" 
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.photo_url}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(recipe);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0 bg-destructive/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Rating */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            {renderStars(recipe.rating)}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs px-2 py-1 bg-accent/50 text-accent-foreground border-0"
            >
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted text-muted-foreground">
              +{recipe.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* View Button */}
        <Button
          variant="outline"
          className="w-full mt-4 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onView(recipe)}
        >
          Ver Receta
        </Button>
      </div>
    </Card>
  );
}