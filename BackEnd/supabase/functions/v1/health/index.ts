import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async ()=>{
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key);
  const { error } = await supabase.from("recipes").select("id").limit(1);
  if (error) {
    return new Response(JSON.stringify({
      status: "down",
      error: String(error)
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
  return new Response(JSON.stringify({
    status: "ok",
    db: "connected"
  }), {
    headers: {
      "Content-Type": "application/json"
    },
    status: 200
  });
});
