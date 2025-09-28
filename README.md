# MyRecipes

Aplicación **Full-Stack** para gestionar recetas (listar, crear, actualizar y borrar) con **React + Vite** (frontend) y **Supabase** (**Postgres + PostgREST**) como backend.  
Incluye **colección de Postman**, *seed* SQL con **30 recetas**, y componentes de UI reutilizables.

---

## Demo

- [Frontend (Netlify)](https://project3lluc.netlify.app/)
- [Docs Postman (lectura)](https://documenter.getpostman.com/view/19714765/2sB3QDvXzf)
- [Workspace Postman (pruebas)](https://none66-7207.postman.co/workspace/MyRecipes~500187f5-b257-468d-8383-131d401c3807/collection/19714765-bda563f5-c9a0-4b1e-99f3-3b8e099fdb0d)


---

## Tabla de contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Quickstart](#quickstart)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [API (REST)](#api-rest)
- [Frontend](#frontend)
- [Calidad y verificación](#calidad-y-verificación)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Características

- CRUD completo de **recetas** con tipados en JavaScript.
- **Filtro por etiquetas**, **búsqueda** y **paginación** (lado cliente/servidor según configuración).
- **Componente “API Status”** (botón) que consulta `/health` y muestra estado en un *collapsible*.
- **Colección de Postman** para **listar/crear/detallar/actualizar/borrar** + healthcheck.
- **Seed SQL** con 30 recetas.
- Preparado para **Subida de imágenes** a Supabase Storage (`recipes`) *(opcional)*.

---

## Arquitectura

- **Frontend:** React 18 + Vite + JavaScript, TailwindCSS, **shadcn/ui**, **lucide-react**.
- **Datos:** `@supabase/supabase-js` (fetch directo a PostgREST).  
- **Backend:** Supabase (Postgres + PostgREST).  
- **Observabilidad:** healthcheck Supabase + toasts en UI.  
- **Despliegue:** Netlify (FE) + Supabase (BE).

### Diagramas 

#### Contexto
```mermaid
C4Context
title MyRecipes — Diagrama de Contexto
Enterprise_Boundary(boundary0, "MyRecipes") {
  Person(user, "Usuario", "Persona que gestiona recetas desde el navegador")
  System_Boundary(webapp, "MyRecipes Web") {
    System(fe, "Frontend React/Vite", "SPA que muestra y edita recetas")
  }
}
System_Ext(supabase, "Supabase", "Postgres + PostgREST + Storage + Auth")
Rel(user, fe, "Usa", "HTTPS")
Rel(fe, supabase, "REST (PostgREST) + Auth (Bearer ANON)", "HTTPS")
```
#### Contenedores
```mermaid
C4Container
title MyRecipes — Contenedores
Person(user, "Usuario")

System_Boundary(myrecipes, "MyRecipes"){
  Container(frontend, "Web App", "React + Vite + TS", "UI, routing, llamadas a API")
  Container_Ext(postgrest, "PostgREST", "HTTP REST", "CRUD sobre tabla recipes")
  ContainerDb(db, "Postgres", "Supabase", "Esquema public.recipes")
  Container_Ext(storage, "Storage (bucket recipes)", "Supabase", "Imágenes de recetas (opcional)")
}

Rel(user, frontend, "Interacción UI", "HTTPS")
Rel(frontend, postgrest, "REST (apikey + bearer anon)", "HTTPS")
Rel(frontend, storage, "GET/PUT imágenes", "HTTPS")
Rel(postgrest, db, "SQL", "TCP")
```

#### Componentes (frontend)
```mermaid
C4Component
title MyRecipes — Componentes principales (Frontend)
Component(indexPage, "IndexPage", "React", "Orquesta vista: lista / detalle / edición")
Component(recipeCard, "RecipeCard", "React", "Tarjeta de receta en grid")
Component(recipeDetail, "RecipeDetail", "React", "Vista detalle con imagen/props")
Component(recipeForm, "RecipeForm", "React", "Crear/editar receta")
Component(searchBar, "SearchBar", "React", "Búsqueda + filtros por tags")
Component(deleteDialog, "DeleteConfirmDialog", "React", "Confirmación de borrado")
Component(toastHook, "useToast", "Hook", "Notificaciones")
Component(apiSvc, "api/recipes", "Service TS", "listRecipes/getAllTags/upsert/delete")
Component(supabaseClient, "@supabase/supabase-js", "SDK", "Cliente HTTP a PostgREST/Storage")

Rel(indexPage, searchBar, "usa")
Rel(indexPage, recipeCard, "renderiza *")
Rel(indexPage, recipeDetail, "navega/condiciona")
Rel(indexPage, recipeForm, "abre para crear/editar")
Rel(indexPage, deleteDialog, "usa")
Rel(indexPage, toastHook, "usa")
Rel(indexPage, apiSvc, "invoca")
Rel(apiSvc, supabaseClient, "usa")
``` 

#### Mapa de navegación (rutas/estados UI)
```mermaid
flowchart
  A[Lista de recetas] -->|click en tarjeta| B[Detalle de receta]
  A -->|Crear receta| C[Formulario crear]
  B -->|Editar| D[Formulario editar]
  B -->|Borrar| E[Diálogo confirmación]
  C -->|Guardar OK| A
  D -->|Guardar OK| B
  E -->|Confirmar| A
  A -->|Buscar/Filtrar| A
  A -.->|Botón API Status| F[Panel desplegable Health]
``` 

#### Secuencia — Listar recetas
```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as Frontend (React)
  participant API as PostgREST
  participant DB as Postgres

  U->>FE: Abre / (Index)
  FE->>API: GET /recipes?select=*&limit=...&order=created_at.desc
  API->>DB: SELECT * FROM public.recipes ...
  DB-->>API: Filas
  API-->>FE: 200 OK (JSON)
  FE-->>U: Render grid de RecipeCard + paginación/filtros
``` 

#### Secuencia — Crear receta
```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as RecipeForm
  participant API as PostgREST
  participant DB as Postgres

  U->>FE: Completa formulario y envía
  FE->>API: POST /recipes (Prefer:return=representation)
  API->>DB: INSERT INTO public.recipes (...)
  DB-->>API: fila creada
  API-->>FE: 201 Created (JSON receta)
  FE-->>U: Toast éxito + navegación a Detalle/Lista
```

#### Secuencia — Actualizar receta
```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as RecipeForm
  participant API as PostgREST
  participant DB as Postgres

  U->>FE: Edita y guarda
  FE->>API: PATCH /recipes?id=eq:<id>
  API->>DB: UPDATE public.recipes SET ... WHERE id=<id>
  DB-->>API: fila actualizada (trigger updated_at)
  API-->>FE: 200 OK (JSON)
  FE-->>U: Toast éxito + vuelve a Detalle
``` 

#### Secuencia — Borrar receta
```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as IndexPage
  participant D as DeleteConfirmDialog
  participant API as PostgREST
  participant DB as Postgres

  U->>FE: Clic en "Borrar"
  FE->>D: Abrir diálogo
  U->>D: Confirmar
  D->>API: DELETE /recipes?id=eq:<id>
  API->>DB: DELETE FROM public.recipes WHERE id=<id>
  DB-->>API: OK
  API-->>D: 204 No Content
  D-->>FE: Éxito
  FE-->>U: Toast + refresco de lista
``` 

#### Estado — Botón “API Status” (Health)
```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Checking: click botón
  Checking --> Up: 200 OK
  Checking --> Down: error/timeout != 2xx
  Up --> Idle: cerrar panel
  Down --> Idle: cerrar panel
``` 

#### Despliegue (entornos)
```mermaid
flowchart TB
  subgraph Dev["Entorno DEV"]
    FEdev[Netlify - Preview/Dev] -->|HTTPS| SUPABASEdev[Supabase Project DEV]
    SUPABASEdev --> DBdev[(Postgres DEV)]
    SUPABASEdev --> STORdev[(Storage DEV)]
  end

  subgraph Prod["Entorno PROD"]
    FEprod[Netlify - Production] -->|HTTPS| SUPABASEprod[Supabase Project PROD]
    SUPABASEprod --> DBprod[(Postgres PROD)]
    SUPABASEprod --> STORprod[(Storage PROD)]
  end

  CI[CI/CD] --> FEdev
  CI --> FEprod
``` 

## Quickstart


### Requisitos: 
- React
- npm
- JavaScript

#### 1 - Variables de entorno
```
cp .env.example 
```

#### 2 - Instalar y arrancar el frontend
```
npm install @supabase/supabase-js
npm run dev
```

### 3 - Semillas en Supabase
Ejecuta el SQL de /supabase/seed/seed.sql en el dashboard o vía CLI:

```
supabase db execute --file supabase/seed/seed.sql
```

## Variables de entorno

```
# Backend
import { createClient } from '@supabase/supabase-js' 

const supabaseUrl = 'https://ztfucpqgulghmlfufiwe.supabase.co' 
const supabaseKey = process.env.SUPABASE_KEY 
const supabase = createClient(supabaseUrl, supabaseKey)

# Frontend
VITE_SUPABASE_URL=https://ztfucpqgulghmlfufiwe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZnVjcHFndWxnaG1sZnVmaXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzE5NTMsImV4cCI6MjA3NDMwNzk1M30.I_rsvL42yJUa0XM2OdYN5Rv3uQOCeBts7x4wQVATV-8
```

## Base de datos

### Esquema: *public.recipes*

- **uuid** PK default gen_random_uuid()
- **title** text not null
- **description** text
- **tags** text[]
- **ingredients** jsonb
- **notes** text
- **rating** int
- **photo_url** text
- **instructions** text[]
- **prep_time_minutes** int not null check (1..1440)
- **servings** smallint not null check (1..64)
- **created_at** timestamptz default now()
- **updated_at** timestamptz default now() (mantenido por trigger)

### RLS 
RLS activado con policy de lectura pública (SELECT para rol anon).

El archivo [supabase/seed/seed.sql](supabase/seed/seed.sql) incluye:

- creación de tabla limpia,
- trigger updated_at,
- habilitar RLS + policy de lectura,
- 30 inserts de ejemplo.

## ERD (Mermaid)

```mermaid
erDiagram
  RECIPES {
    uuid id PK
    text title
    text description
    text[] tags
    jsonb ingredients
    text notes
    int4 rating
    text photo_url
    text[] instructions
    int4 prep_time_minutes
    int2 servings
    timestamptz created_at
    timestamptz updated_at
  }
```

## API (REST)

Backend expuesto por PostgREST (Supabase).

- Base URL: https://<PROJECT>.supabase.co/rest/v1
- Recurso: /recipes

### Cabeceras obligatorias

```
apikey: <VITE_SUPABASE_ANON_KEY>
Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
Content-Type: application/json
Prefer: return=representation 
```

### Endpoints típicos

- GET /recipes?select=* — Lista (admite filtros de PostgREST).
- GET /recipes?id=eq.<uuid>&select=* — Detalle.
- POST /recipes — Crear.
- PATCH /recipes?id=eq.<uuid> — Actualizar parcial.
- DELETE /recipes?id=eq.<uuid> — Borrar.
- GET https://<PROJECT>.supabase.co/health — Health (servicio Supabase).

![Postman1](BackEnd\postman\images\postman1.png)

#### Ejemplo (cURL – listar)

```
curl -s \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  "https://<PROJECT>.supabase.co/rest/v1/recipes?select=*"
```

![Postman1](BackEnd\postman\images\postman2.png)

La colección de [Postman adjunta](https://none66-7207.postman.co/workspace/MyRecipes~500187f5-b257-468d-8383-131d401c3807/collection/19714765-bda563f5-c9a0-4b1e-99f3-3b8e099fdb0d?action=share&creator=19714765&active-environment=19714765-1793e225-8be3-45c2-9771-59dbddcb581e) ya define estas llamadas.

[Documentación de Postman de la API.](https://documenter.getpostman.com/view/19714765/2sB3QDvXzf)

## Frontend

### Estructura (resumen)

```bash
src/
 ├─ api/ 
 ├─ components/
 │   ├─ RecipeCard.tsx
 │   ├─ RecipeForm.tsx
 │   ├─ RecipeDetail.tsx
 │   ├─ SearchBar.tsx
 │   └─ DeleteConfirmDialog.tsx
 ├─ hooks/use-toast.ts
 ├─ pages/Index.tsx 
 └─ main.tsx
```

#### Tecnologías usadas:

- React 18 + Vite 
- TailwindCSS + shadcn/ui (UI)
- lucide-react (iconos)
- @supabase/supabase-js (cliente)
- Patrón de servicios para acceso a datos y manejo de errores/toasts.

```
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  }
}
```

## Calidad y verificación

- Tests (FE): pnpm test (Vitest)
- Lint: pnpm lint (ESLint)
- Tipos: pnpm typecheck

## Despliegue

### Frontend 


### Backend

- Gestionado por Supabase (DB, API y health).
- RLS y policies.
- Hay storage bucket para los assets.

## Roadmap

- [ ] Storybook para componentes clave (loading/empty/error).
- [ ] Tipos/SDK generados desde contrato (OpenAPI → TypeScript) para evitar divergencias FE/BE.
- [ ] Policies RLS por usuario + Supabase Auth (signin/signup).
- [ ] Subida de imágenes al bucket recipes desde el formulario (con borrado seguro).
- [ ] Métricas de rendimiento (Lighthouse/CWV) y presupuestos por ruta.
- [ ] CI/CD: build + preview deploy + validación de enlaces/markdown.

## Licencia

Este proyecto está bajo la licencia [MIT](./LICENSE).