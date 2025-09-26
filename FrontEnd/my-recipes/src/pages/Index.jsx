import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDetail } from "@/components/RecipeDetail";
import { SearchBar } from "@/components/SearchBar";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-kitchen.jpg";

// Mock data for demonstration
const mockRecipes = [
  {
    id: "1",
    title: "Pasta Carbonara Clásica",
    description: "La auténtica receta romana de carbonara con huevos, queso pecorino, guanciale y pimienta negra. Simple pero llena de sabor.",
    tags: ["italiana", "pasta", "rápida", "tradicional"],
    ingredients: [
      "400g de spaghetti",
      "200g de guanciale o panceta",
      "4 huevos enteros",
      "100g de queso pecorino romano",
      "Pimienta negra recién molida",
      "Sal"
    ],
    notes: "1. Hierve la pasta en agua con sal hasta que esté al dente.\n2. Mientras tanto, corta el guanciale en cubos y fríelo hasta que esté dorado.\n3. Bate los huevos con el queso rallado y pimienta.\n4. Escurre la pasta y mézclala con el guanciale caliente.\n5. Retira del fuego y agrega la mezcla de huevos, removiendo rápidamente.\n6. Sirve inmediatamente con más queso y pimienta.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Paella Valenciana",
    description: "La paella tradicional española con pollo, conejo, judías verdes, garrofón, azafrán y arroz bomba. Un clásico mediterráneo.",
    tags: ["española", "arroz", "mediterránea", "festiva"],
    ingredients: [
      "400g de arroz bomba",
      "1 pollo troceado",
      "500g de conejo troceado",
      "200g de judías verdes",
      "100g de garrofón",
      "1 pimiento rojo",
      "Tomate rallado",
      "Azafrán",
      "Aceite de oliva",
      "Sal y limón"
    ],
    notes: "1. Calienta aceite en la paellera y dora el pollo y conejo.\n2. Añade las judías, garrofón y pimiento.\n3. Incorpora el tomate y sofríe.\n4. Agrega el arroz y el azafrán disuelto en caldo caliente.\n5. Cocina a fuego fuerte 10 min, luego suave 10-15 min.\n6. Deja reposar 5 minutos antes de servir.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "3",
    title: "Tarta de Santiago",
    description: "El postre gallego más famoso, elaborado con almendras molidas, huevos, azúcar y un toque de limón. Decorada con la cruz de Santiago.",
    tags: ["postre", "gallega", "almendras", "tradicional"],
    ingredients: [
      "250g de almendras molidas",
      "250g de azúcar",
      "5 huevos",
      "Ralladura de 1 limón",
      "Mantequilla para el molde",
      "Azúcar glas para decorar"
    ],
    notes: "1. Precalienta el horno a 180°C.\n2. Bate los huevos con el azúcar hasta que blanqueen.\n3. Añade las almendras molidas y la ralladura de limón.\n4. Vierte en un molde engrasado y enharinado.\n5. Hornea 25-30 minutos hasta que esté dorada.\n6. Desmolda cuando esté fría y espolvorea con azúcar glas usando una plantilla de la cruz de Santiago.",
    rating: 4,
    photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  }
];

export default function Index() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState(mockRecipes);
  const [view, setView] = useState("list");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ 
    open: false, 
    recipe: null 
  });

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Filter recipes based on search and tags
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTags = activeTags.length === 0 || 
        activeTags.every(tag => recipe.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [recipes, searchQuery, activeTags]);

  const handleSubmit = (data) => {
    const newRecipe = {
      id: editingRecipe?.id || Date.now().toString(),
      title: data.title,
      description: data.description,
      tags: data.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      ingredients: data.ingredients.split("\n").map(ing => ing.trim()).filter(Boolean),
      notes: data.notes,
      rating: data.rating,
      photo: data.photo,
      createdAt: editingRecipe?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingRecipe) {
      setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? newRecipe : r));
      toast({
        title: "¡Receta actualizada!",
        description: `"${newRecipe.title}" ha sido actualizada exitosamente.`
      });
    } else {
      setRecipes(prev => [newRecipe, ...prev]);
      toast({
        title: "¡Receta creada!",
        description: `"${newRecipe.title}" ha sido añadida a tu colección.`
      });
    }

    setView("list");
    setEditingRecipe(null);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setView("form");
  };

  const handleDelete = (id) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      setDeleteDialog({ open: true, recipe });
    }
  };

  const confirmDelete = () => {
    if (deleteDialog.recipe) {
      setRecipes(prev => prev.filter(r => r.id !== deleteDialog.recipe?.id));
      toast({
        title: "Receta eliminada",
        description: `"${deleteDialog.recipe.title}" ha sido eliminada de tu colección.`,
        variant: "destructive"
      });
    }
    setDeleteDialog({ open: false, recipe: null });
    if (view === "detail") {
      setView("list");
    }
  };

  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setView("detail");
  };

  const handleCancel = () => {
    setView("list");
    setEditingRecipe(null);
  };

  const handleBack = () => {
    setView("list");
    setSelectedRecipe(null);
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-gradient-cream p-4">
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (view === "detail" && selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-cream p-4">
        <RecipeDetail
          recipe={selectedRecipe}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
        <DeleteConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, recipe: null })}
          onConfirm={confirmDelete}
          recipeTitle={deleteDialog.recipe?.title || ""}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cream">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Cocina elegante con ingredientes frescos"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="h-12 w-12 text-primary-glow" />
            <h1 className="text-5xl md:text-6xl font-bold">
              Mis Recetas
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre, comparte y guarda tus recetas favoritas en un lugar especial
          </p>
          <Button
            onClick={() => setView("form")}
            className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Añadir Nueva Receta
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <SearchBar
            onSearch={setSearchQuery}
            onTagFilter={setActiveTags}
            availableTags={allTags}
            activeTags={activeTags}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredRecipes.length === recipes.length 
                ? "Todas las Recetas" 
                : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'Receta Encontrada' : 'Recetas Encontradas'}`
              }
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredRecipes.length === 0 
                ? "No se encontraron recetas con los filtros aplicados"
                : `Colección de ${recipes.length} ${recipes.length === 1 ? 'receta' : 'recetas'}`
              }
            </p>
          </div>
          
          <Button
            onClick={() => setView("form")}
            className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Receta
          </Button>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron recetas
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || activeTags.length > 0
                ? "Prueba ajustando los filtros de búsqueda"
                : "¡Empieza añadiendo tu primera receta!"
              }
            </p>
            <Button
              onClick={() => setView("form")}
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Primera Receta
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, recipe: null })}
        onConfirm={confirmDelete}
        recipeTitle={deleteDialog.recipe?.title || ""}
      />
    </div>
  );
}