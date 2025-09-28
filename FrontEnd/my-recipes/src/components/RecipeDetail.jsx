import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2, ArrowLeft, Clock, Users } from "lucide-react";

export function RecipeDetail({ recipe, onEdit, onDelete, onBack }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? "fill-warning text-warning" 
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a recetas
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(recipe)}
            className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(recipe.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gradient-card shadow-hover">
        <img
          src={recipe.photo_url}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(recipe.rating)}
              <span className="ml-2 font-medium">({recipe.rating}/5)</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{recipe.prep_time_minutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Users className="h-4 w-4" />
              <span className="text-sm">{recipe.servings} porciones</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">Descripción</h2>
            <p className="text-foreground leading-relaxed">{recipe.description}</p>
          </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ingredients */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ingredientes</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-foreground leading-relaxed">{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Instrucciones */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Instrucciones</h3>
            <ol className="space-y-3 list-decimal list-inside">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-foreground leading-relaxed">
                  {instruction}
                </li>
              ))}
            </ol>
          </Card>

          {/* Notes */}
          {recipe.notes && (
            <Card className="p-6 bg-gradient-card shadow-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Notas</h2>
              <div className="prose prose-sm max-w-none text-foreground">
                {recipe.notes.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </Card>
          )}
        </div>          

          {/* Tags */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-accent/50 text-accent-foreground border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Recipe Info */}
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creada:</span>
                <span className="text-foreground">{formatDate(recipe.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actualizada:</span>
                <span className="text-foreground">{formatDate(recipe.updatedAt)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}