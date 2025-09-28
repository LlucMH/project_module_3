import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  process.env.SUPABASE_URL ||
  "https://ztfucpqgulghmlfufiwe.supabase.co";

const SUPABASE_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  process.env.SUPABASE_KEY ||
  "";

export async function getApiStatus() {
  const started = performance.now();

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return {
      ok: false,
      server: "unknown",
      db: "error",
      error:
        "Falta configuración de Supabase (SUPABASE_URL / SUPABASE_KEY o VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
      latency: Math.round(performance.now() - started),
      source: "supabase",
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const dbStarted = performance.now();
    const { error, count } = await supabase
      .from("recipes")
      .select("id", { count: "exact", head: true });
    const dbLatency = Math.round(performance.now() - dbStarted);

    if (error) {
      return {
        ok: false,
        server: "ok",
        db: "error",
        dbError: error.message,
        latency: Math.round(performance.now() - started),
        dbLatency,
        source: "supabase",
      };
    }

    return {
      ok: true,
      server: "ok",
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
      server: "ok",
      db: "error",
      error: e.message,
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
      setState({ loading: false, data: res, error: res.error || res.dbError || "Fallo de estado" });
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
                <li>
                  <strong>OK:</strong> {state.data.ok ? "✅ Sí" : "❌ No"}
                </li>
                {"server" in state.data && (
                  <li>
                    <strong>Servidor:</strong>{" "}
                    {state.data.server === "ok" ? "✅" : String(state.data.server)}
                  </li>
                )}
                {"db" in state.data && (
                  <li>
                    <strong>Base de datos:</strong>{" "}
                    {state.data.db === "ok" ? "✅" : "❌"}
                  </li>
                )}
                {"count" in state.data && (
                  <li>
                    <strong>Recetas (count):</strong> {state.data.count}
                  </li>
                )}
                {"latency" in state.data && (
                  <li>
                    <strong>Latencia total:</strong> {state.data.latency} ms
                  </li>
                )}
                {"dbLatency" in state.data && (
                  <li>
                    <strong>Latencia DB:</strong> {state.data.dbLatency} ms
                  </li>
                )}
                {"url" in state.data && (
                  <li>
                    <strong>Proyecto:</strong> {state.data.url}
                  </li>
                )}
                {"source" in state.data && (
                  <li>
                    <strong>Fuente:</strong> {state.data.source}
                  </li>
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
