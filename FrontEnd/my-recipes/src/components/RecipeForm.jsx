import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RecipeForm({ recipe, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    tags: recipe?.tags.join(", ") || "",
    ingredients: recipe?.ingredients.join("\n") || "",
    instructions: recipe?.instructions || "",
    notes: recipe?.notes || "",
    rating: recipe?.rating || 0,
    prep_time_minutes: recipe?.prep_time_minutes || 5,
    servings: recipe?.servings || 1,
    photo_url: recipe?.photo_url || "",
  });

  const [newTag, setNewTag] = useState("");
  const [newIngredient, setNewIngredient] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    if (!formData.ingredients.trim()) {
      toast({ title: "Error", description: "Los ingredientes son obligatorios", variant: "destructive" });
      return;
    }

    if (!formData.prep_time_minutes || prep_time_minutes < 1) {
        toast({ title: "Error", description: "Indica un tiempo de preparación válido", variant: "destructive" });
      return;
    }

    if (!formData.servings || servings < 1) {
        toast({ title: "Error", description: "Indica un número de comensales válido", variant: "destructive" });
      return;
    }

    onSubmit(formData);
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const currentTags = formData.tags ? formData.tags.split(", ").filter(Boolean) : [];
      const updatedTags = [...currentTags, newTag.trim()].join(", ");
      setFormData(prev => ({ ...prev, tags: updatedTags }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData.tags.split(", ").filter(Boolean);
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove).join(", ");
    setFormData(prev => ({ ...prev, tags: updatedTags }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const currentIngredients = formData.ingredients ? formData.ingredients.split("\n").filter(Boolean) : [];
      const updatedIngredients = [...currentIngredients, newIngredient.trim()].join("\n");
      setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
      setNewIngredient("");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < formData.rating 
            ? "fill-warning text-warning" 
            : "text-muted-foreground hover:text-warning"
        }`}
        onClick={() => handleRatingClick(i + 1)}
      />
    ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-gradient-card shadow-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {recipe ? "Editar Receta" : "Nueva Receta"}
          </h2>
          <p className="text-muted-foreground">
            {recipe ? "Actualiza los detalles de tu receta" : "Comparte tu deliciosa receta con el mundo"}
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Título de la receta *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ej: Pasta Carbonara Clásica"
            className="bg-card border-border/50 focus:border-primary"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Descripción
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe tu receta, su origen, por qué es especial..."
            className="bg-card border-border/50 focus:border-primary min-h-[100px] resize-none"
          />
        </div>

        {/* photo_url */}
        <div className="space-y-2">
          <Label htmlFor="photo_url" className="text-sm font-medium">
            URL de la foto
          </Label>
          <div className="flex gap-2">
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
              placeholder="https://ejemplo.com/mi-receta.jpg"
              className="bg-card border-border/50 focus:border-primary"
            />
            <Button type="button" variant="outline" size="icon" className="shrink-0">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {formData.photo_url && (
            <div className="mt-2">
              <img
                src={formData.photo_url}
                alt="Vista previa"
                className="w-full h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Calificación</Label>
          <div className="flex items-center gap-1">
            {renderStars()}
            <span className="ml-2 text-sm text-muted-foreground">
              ({formData.rating}/5)
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tags *</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Agregar tag (ej: vegetariano, rápido, italiano)"
              className="bg-card border-border/50 focus:border-primary"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.split(", ").filter(Boolean).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-accent/50 text-accent-foreground border-0 pr-1"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ingredientes *</Label>
          <div className="flex gap-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Agregar ingrediente (ej: 200g de pasta)"
              className="bg-card border-border/50 focus:border-primary"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
            />
            <Button type="button" onClick={addIngredient} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={formData.ingredients}
            onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
            placeholder="Lista de ingredientes (uno por línea)&#10;200g pasta&#10;100g bacon&#10;2 huevos&#10;50g queso parmesano"
            className="bg-card border-border/50 focus:border-primary min-h-[120px] resize-none"
          />
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-sm font-medium">
            Instrucciones
          </Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="Instrucciones de preparación"
            className="bg-card border-border/50 focus:border-primary min-h-[150px] resize-none"
          />
        </div>


        {/* Preparation time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prep_time_minutes" className="text-sm font-medium">Tiempo de preparación *</Label>
            <Input
              id="prep_time_minutes"
              type="number"
              min={1}
              value={formData.prep_time_minutes}
              onChange={(e) => setFormData(prev => ({ ...prev, prep_time_minutes: e.target.value }))}
              className="bg-card border-border/50 focus:border-primary"
            />
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label htmlFor="servings" className="text-sm font-medium">Raciones *</Label>
            <Input
              id="servings"
              type="number"
              min={1}
              value={formData.servings}
              onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
              className="bg-card border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notas
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Consejos, variaciones, comentarios..."
            className="bg-card border-border/50 focus:border-primary min-h-[150px] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-warm text-primary-foreground hover:opacity-90"
          >
            {recipe ? "Actualizar" : "Crear"} Receta
          </Button>
        </div>
      </form>
    </Card>
  );
}