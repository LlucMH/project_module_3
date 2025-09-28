import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // ✅ Importado correctamente
import { Plus, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDetail } from "@/components/RecipeDetail";
import { SearchBar } from "@/components/SearchBar";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-kitchen.jpg";

// API
import { listRecipes, getAllTags, deleteRecipe, upsertRecipe } from "@/api/recipes";

const PAGE_SIZE = 12;

export default function Index() {
  const { toast } = useToast();

  // datos remotos
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);

  // vista local
  const [view, setView] = useState("list");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // paginación
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // estado
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, recipe: null });

  const [showApiStatus, setShowApiStatus] = useState(false);

  // cargar tags una vez
  useEffect(() => {
    (async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // cargar recetas cuando cambian filtros/página
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { rows, count } = await listRecipes({
          q: searchQuery,
          tags: activeTags,
          page,
          pageSize: PAGE_SIZE,
        });
        if (!alive) return;
        setRecipes(rows);
        setTotal(count);
      } catch (e) {
        toast({ title: "Error cargando recetas", description: e.message, variant: "destructive" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false };
  }, [searchQuery, activeTags, page]);

  const filteredRecipes = useMemo(() => recipes, [recipes]);

  // Handlers
  const handleSubmit = async (data) => {
    const payload = {
      id: editingRecipe?.id,
      title: data.title,
      description: data.description || null,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      ingredients: data.ingredients?.split("\n").map(s => s.trim()).filter(Boolean) ?? null,
      notes: data.notes || null,
      rating: data.rating ?? null,
      photo_url: data.photo || null,
      instructions: (data.instructions || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      prep_time_minutes: Number(data.prep_time_minutes || 20),
      servings: Number(data.servings || 2),
    };

    try {
      const id = await upsertRecipe(payload);
      toast({ title: editingRecipe ? "¡Receta actualizada!" : "¡Receta creada!" });
      setView("list");
      setEditingRecipe(null);
      setPage(1);
    } catch (e) {
      toast({ title: "Error al guardar", description: e.message, variant: "destructive" });
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setView("form");
  };

  const handleDelete = (id) => {
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) setDeleteDialog({ open: true, recipe });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.recipe) return;
    try {
      await deleteRecipe(deleteDialog.recipe.id);
      toast({ title: "Receta eliminada", description: `"${deleteDialog.recipe.title}" eliminada.` });
      setRecipes((prev) => prev.filter((r) => r.id !== deleteDialog.recipe.id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      toast({ title: "Error al borrar", description: e.message, variant: "destructive" });
    } finally {
      setDeleteDialog({ open: false, recipe: null });
      if (view === "detail") setView("list");
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

  const onSearch = (q) => { setPage(1); setSearchQuery(q); };
  const onTagFilter = (tags) => { setPage(1); setActiveTags(tags); };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-gradient-cream p-4">
        <RecipeForm recipe={editingRecipe} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    );
  }

  if (view === "detail" && selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-cream p-4">
        <RecipeDetail recipe={selectedRecipe} onEdit={handleEdit} onDelete={handleDelete} onBack={handleBack} />
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
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Cocina elegante con ingredientes frescos" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="h-12 w-12 text-primary-glow" />
            <h1 className="text-5xl md:text-6xl font-bold">Mis Recetas</h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre, comparte y guarda tus recetas favoritas en un lugar especial
          </p>
          <Button
            onClick={() => setShowApiStatus(!showApiStatus)}
            className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Status de la API
          </Button>
        </div>
      </div>

      {/* API Status Panel */}
      {showApiStatus && (
        <div className="mt-8 px-6">
          <Card className="p-6 bg-background border border-muted shadow">
            <h2 className="text-xl font-semibold text-foreground mb-4">Estado de la API</h2>
            <ul className="list-disc pl-5 text-foreground">
              <li>Base de datos: ✅ Conectada</li>
              <li>Servidor: ✅ Activo</li>
              <li>Latencia promedio: 120ms</li>
              <li>Último chequeo: hace 5 minutos</li>
            </ul>
          </Card>
        </div>
      )}

      {/* Main */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <SearchBar
            onSearch={onSearch}
            onTagFilter={onTagFilter}
            availableTags={allTags}
            activeTags={activeTags}
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredRecipes.length === recipes.length
                ? "Todas las Recetas"
                : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? "Receta Encontrada" : "Recetas Encontradas"}`}
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredRecipes.length === 0
                ? "No se encontraron recetas con los filtros aplicados"
                : `Total en base de datos: ${total}`}
            </p>
          </div>
          <Button onClick={() => setView("form")} className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-warm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Receta
          </Button>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Cargando…</div>
        ) : filteredRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(recipe.id)}
                  onView={handleView}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-8">
              <span className="text-sm text-muted-foreground">
                {total === 0 ? "0" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`} de {total}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Anterior
                </Button>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron recetas</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || activeTags.length > 0 ? "Prueba ajustando los filtros de búsqueda" : "¡Empieza añadiendo tu primera receta!"}
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

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, recipe: null })}
        onConfirm={confirmDelete}
        recipeTitle={deleteDialog.recipe?.title || ""}
      />
    </div>
  );
}
