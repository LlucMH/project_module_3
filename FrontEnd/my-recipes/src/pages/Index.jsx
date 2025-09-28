import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDetail } from "@/components/RecipeDetail";
import { SearchBar } from "@/components/SearchBar";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-kitchen.jpg";
import Footer from "@/components/Footer";

import { listRecipes, getAllTags, deleteRecipe, upsertRecipe } from "@/api/recipes";
import { getApiStatus } from "@/api/status";

const PAGE_SIZE = 12;

export default function Index() {
  const { toast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);

  const [view, setView] = useState("list");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, recipe: null });

  const [showApiStatus, setShowApiStatus] = useState(false);
  const [apiStatus, setApiStatus] = useState({ loading: false, data: null, error: null });

  // Normalizadores
  const normString = (v) => (v == null ? "" : String(v));
  const normArrayFromCSV = (v) =>
    Array.isArray(v)
      ? v.map((s) => String(s).trim()).filter(Boolean)
      : normString(v).split(",").map((s) => s.trim()).filter(Boolean);
  const normArrayFromLines = (v) =>
    Array.isArray(v)
      ? v.map((s) => String(s).trim()).filter(Boolean)
      : normString(v).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  // Ingredientes {qty, unit, name} -> "qty unit name"
  const ingObjToText = (ing) => {
    if (ing && typeof ing === "object") {
      const qty = ing.qty != null && ing.qty !== "" ? String(ing.qty).trim() : "";
      const unit = ing.unit ? String(ing.unit).trim() : "";
      const name = ing.name ? String(ing.name).trim() : "";
      const left = [qty, unit].filter(Boolean).join(" ");
      return [left, name].filter(Boolean).join(" ").trim();
    }
    return String(ing ?? "").trim();
  };

  const toTextArray = (arrOrStr, mode = "lines") => {
    if (Array.isArray(arrOrStr)) {
      return arrOrStr.map(ingObjToText).filter(Boolean);
    }
    const s = normString(arrOrStr);
    return (mode === "csv" ? s.split(",") : s.split(/\r?\n/))
      .map((x) => x.trim())
      .filter(Boolean);
  };

  // Datos
  const refreshTags = async () => {
    try {
      const tags = await getAllTags();
      setAllTags(tags);
    } catch (e) {
      console.error(e);
    }
  };

  const reload = async ({ resetPage = false } = {}) => {
    try {
      setLoading(true);
      const nextPage = resetPage ? 1 : page;
      if (resetPage && page !== 1) setPage(1);

      const { rows, count } = await listRecipes({
        q: searchQuery,
        tags: activeTags,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });

      setRecipes(rows);
      setTotal(count);
    } catch (e) {
      toast({ title: "Error recargando recetas", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshTags();
  }, []);

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
    return () => {
      alive = false;
    };
  }, [searchQuery, activeTags, page]);

  const filteredRecipes = useMemo(() => recipes, [recipes]);

  // API Status
  const loadApiStatus = async () => {
    setApiStatus({ loading: true, data: null, error: null });
    const res = await getApiStatus();
    if (res.ok) setApiStatus({ loading: false, data: res, error: null });
    else setApiStatus({ loading: false, data: res, error: res.error || res.dbError || "Fallo de estado" });
  };

  useEffect(() => {
    if (!showApiStatus) return;
    void loadApiStatus();
    const id = setInterval(loadApiStatus, 60000);
    return () => clearInterval(id);
  }, [showApiStatus]);

  // Submit
  const handleSubmit = async (data) => {
    const isEdit = !!editingRecipe?.id;
    const payload = {
      title: data.title,
      description: data.description || null,
      tags: Array.isArray(data.tags_array) ? data.tags_array : normArrayFromCSV(data.tags),
      ingredients: Array.isArray(data.ingredients_array)
        ? data.ingredients_array.map(ingObjToText)
        : toTextArray(data.ingredients, "lines"),
      instructions: Array.isArray(data.instructions_array)
        ? data.instructions_array.map((x) => String(x).trim()).filter(Boolean)
        : normArrayFromLines(data.instructions),
      notes: data.notes || null,
      rating: typeof data.rating === "number" ? data.rating : Number(data.rating ?? 0),
      photo_url: data.photo_url || null,
      prep_time_minutes: Number(data.prep_time_minutes || 20),
      servings: Number(data.servings || 2),
    };
    if (isEdit) payload.id = editingRecipe.id;

    try {
      await upsertRecipe(payload);
      toast({ title: isEdit ? "¡Receta actualizada!" : "¡Receta creada!" });
      await reload({ resetPage: true });
      await refreshTags();
      setView("list");
      setEditingRecipe(null);
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
      await reload();
      await refreshTags();
    } catch (e) {
      toast({ title: "Error al borrar", description: e.message, variant: "destructive" });
    } finally {
      setDeleteDialog({ open: false, recipe: null });
      if (view === "detail") setView("list");
    }
  };

  const handleView = (recipe) => {
    const normalized = {
      ...recipe,
      tags: Array.isArray(recipe.tags) ? recipe.tags : normArrayFromCSV(recipe.tags),
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : toTextArray(recipe.ingredients, "lines"),
      instructions: Array.isArray(recipe.instructions)
        ? recipe.instructions
        : normArrayFromLines(recipe.instructions),
      rating: typeof recipe.rating === "number" ? recipe.rating : Number(recipe.rating ?? 0),
      prep_time_minutes: Number(recipe.prep_time_minutes ?? 0) || null,
      servings: Number(recipe.servings ?? 0) || null,
    };

    setSelectedRecipe(normalized);
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

  const onSearch = (q) => {
    setPage(1);
    setSearchQuery(q);
  };
  const onTagFilter = (tags) => {
    setPage(1);
    setActiveTags(tags);
  };

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
    <div className="min-h-screen bg-gradient-cream flex flex-col">
      {/* Contenido principal */}
      <div className="flex-1">
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

            {/* Botón de estado de la API */}
            <Button
              onClick={() => setShowApiStatus((prev) => !prev)}
              className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              {showApiStatus ? "Ocultar estado de la API" : "Mostrar estado de la API"}
            </Button>
          </div>
        </div>

        {/* API Status Panel */}
        {showApiStatus && (
          <div className="mt-8 px-6">
            <Card className="p-6 bg-background border border-muted shadow space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Estado de la API</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadApiStatus} disabled={apiStatus.loading}>
                    {apiStatus.loading ? "Comprobando..." : "Reintentar"}
                  </Button>
                </div>
              </div>

              {apiStatus.loading && <p className="text-muted-foreground">Comprobando estado…</p>}

              {!apiStatus.loading && apiStatus.data && (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-foreground">
                  <li><strong>OK:</strong> {apiStatus.data.ok ? "✅ Sí" : "❌ No"}</li>
                  {"server" in apiStatus.data && (
                    <li><strong>Servidor:</strong> {apiStatus.data.server === "ok" ? "✅" : String(apiStatus.data.server)}</li>
                  )}
                  {"db" in apiStatus.data && (
                    <li><strong>Base de datos:</strong> {apiStatus.data.db === "ok" ? "✅" : "❌"}</li>
                  )}
                  {"count" in apiStatus.data && (
                    <li><strong>Recetas (count):</strong> {apiStatus.data.count}</li>
                  )}
                  {"latency" in apiStatus.data && (
                    <li><strong>Latencia total:</strong> {apiStatus.data.latency} ms</li>
                  )}
                  {"dbLatency" in apiStatus.data && (
                    <li><strong>Latencia DB:</strong> {apiStatus.data.dbLatency} ms</li>
                  )}
                  {"url" in apiStatus.data && (
                    <li><strong>Proyecto:</strong> {apiStatus.data.url}</li>
                  )}
                  {"source" in apiStatus.data && (
                    <li><strong>Fuente:</strong> {apiStatus.data.source}</li>
                  )}
                </ul>
              )}

              {!apiStatus.loading && apiStatus.error && (
                <p className="text-destructive">Error: {apiStatus.error}</p>
              )}
            </Card>
          </div>
        )}

        {/* Main */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <SearchBar onSearch={onSearch} onTagFilter={onTagFilter} availableTags={allTags} activeTags={activeTags} />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredRecipes.length === recipes.length
                  ? "Todas las Recetas"
                  : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? "Receta Encontrada" : "Recetas Encontradas"}`}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredRecipes.length === 0 ? "No se encontraron recetas con los filtros aplicados" : `Total en base de datos: ${total}`}
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
      </div>

      {/* Footer */}
      <Footer />

      {/* Diálogo de borrado (fuera del flujo para no cortar el layout) */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, recipe: null })}
        onConfirm={confirmDelete}
        recipeTitle={deleteDialog.recipe?.title || ""}
      />
    </div>
  );
}
