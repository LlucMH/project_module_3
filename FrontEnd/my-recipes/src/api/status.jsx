import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase, SUPABASE_URL } from "@/lib/supabase";

/**
 * Comprueba:
 *  - Servidor: fetch a /health con mode:'no-cors' (si resuelve, lo damos por OK)
 *  - DB: HEAD select con count exacto a public.recipes
 */
export async function getApiStatus() {
  const started = performance.now();

  // --- Servidor (/health) ---
  let serverOk = false;
  try {
    // En muchos proyectos /health no expone CORS → usamos 'no-cors'
    await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/health`, {
      cache: "no-store",
      mode: "no-cors",
    });
    serverOk = true; // si resolvió sin throw, lo consideramos reachable
  } catch {
    serverOk = false;
  }

  // --- DB (PostgREST) ---
  try {
    const tDb = performance.now();
    const { error, count } = await supabase
      .from("recipes")
      .select("id", { count: "exact", head: true });
    const dbLatency = Math.round(performance.now() - tDb);

    if (error) {
      return {
        ok: false,
        server: serverOk ? "ok" : "down",
        db: "error",
        dbError: error.message,
        latency: Math.round(performance.now() - started),
        dbLatency,
        source: "supabase",
      };
    }

    // Si la DB respondió, el servidor está realmente up aunque /health esté sin CORS
    if (!serverOk) serverOk = true;

    return {
      ok: serverOk, // ambas condiciones ya cubiertas
      server: serverOk ? "ok" : "down",
      db: "ok",
      count,
      latency: Math.round(performance.now() - started),
      dbLatency,
      source: "supabase",
      url: SUPABASE_URL.replace(/^(https?:\/\/)/, ""),
    };
  } catch (e) {
    return {
      ok: false,
      server: serverOk ? "ok" : "down",
      db: "error",
      error: e?.message ?? "Error de consulta a la base de datos",
      latency: Math.round(performance.now() - started),
      source: "supabase",
    };
  }
}

export default function ApiStatusPanel({
  defaultOpen = false,
  className = "",
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, setState] = useState({ loading: false, data: null, error: null });

  const load = async () => {
    setState({ loading: true, data: null, error: null });
    const res = await getApiStatus();
    if (res.ok) {
      setState({ loading: false, data: res, error: null });
    } else {
      setState({
        loading: false,
        data: res,
        error: res.error || res.dbError || "Fallo de estado",
      });
    }
  };

  useEffect(() => {
    if (open) void load();
  }, [open]);

  return (
    <div className={className}>
      <Button
        onClick={() => setOpen((v) => !v)}
        className={`bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto ${buttonClassName}`}
      >
        {open ? "Ocultar estado de la API" : "Mostrar estado de la API"}
      </Button>

      {open && (
        <div className="mt-8 px-0 md:px-6">
          <Card className="p-6 bg-background border border-muted shadow space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Estado de la API</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={load} disabled={state.loading}>
                  {state.loading ? "Comprobando..." : "Reintentar"}
                </Button>
              </div>
            </div>

            {state.loading && <p className="text-muted-foreground">Comprobando estado…</p>}

            {!state.loading && state.data && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-foreground">
                <li><strong>OK:</strong> {state.data.ok ? "✅ Sí" : "❌ No"}</li>
                {"server" in state.data && (
                  <li><strong>Servidor:</strong> {state.data.server === "ok" ? "✅" : "❌"}</li>
                )}
                {"db" in state.data && (
                  <li><strong>Base de datos:</strong> {state.data.db === "ok" ? "✅" : "❌"}</li>
                )}
                {"count" in state.data && (
                  <li><strong>Recetas (count):</strong> {state.data.count}</li>
                )}
                {"latency" in state.data && (
                  <li><strong>Latencia total:</strong> {state.data.latency} ms</li>
                )}
                {"dbLatency" in state.data && (
                  <li><strong>Latencia DB:</strong> {state.data.dbLatency} ms</li>
                )}
                {"url" in state.data && (
                  <li><strong>Proyecto:</strong> {state.data.url}</li>
                )}
                {"source" in state.data && (
                  <li><strong>Fuente:</strong> {state.data.source}</li>
                )}
              </ul>
            )}

            {!state.loading && state.error && (
              <p className="text-destructive">Error: {state.error}</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
