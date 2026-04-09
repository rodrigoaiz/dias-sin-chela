# Plan de Evolución

## Contexto

Actualmente la app es 100% estática. La fecha de última chela está hardcodeada
en tres componentes y los cálculos se hacen en build time. La app nació como
herramienta personal, pero ya está deployeada al mundo — cualquiera puede llegar
a ella, y tiene sentido que sea útil para esas personas también.

---

## MVP v1 — Fecha personalizada sin auth (localStorage)

**Objetivo:** Que cualquier usuario pueda usar la app con su propia fecha, sin
necesidad de cuenta, login ni backend. Simple, privado, funciona de inmediato.

### Flujo de usuario

1. Primera visita → modal/pantalla de bienvenida pregunta: *"¿Cuándo fue tu última chela?"*
2. Usuario ingresa la fecha → se guarda en `localStorage`
3. La app usa esa fecha para todos los cálculos (días, milestones, fun facts)
4. Visitas siguientes → lee de `localStorage`, va directo al contador
5. Botón discreto para cambiar la fecha (recaída o corrección)

### Cambios técnicos

| Qué | Detalle |
|---|---|
| Componente `Onboarding` (nuevo) | Modal con input de fecha, estilo vintage/bar de la app |
| Helper `getStartDate()` | Lee de `localStorage`, fallback a la fecha hardcodeada |
| Refactor de `Counter`, `Milestones`, `FunFacts` | Mover cálculos de build time a client-side JS |
| Botón "Cambiar fecha" | Footer o settings mínimo, para el caso de recaída |

### Consideraciones

- **Sin persistencia entre dispositivos** — si el usuario cambia de celular, pierde su fecha. Aceptable para este MVP.
- **Sin frameworks nuevos** — se implementa con `<script>` client-side vanilla JS + Astro. Sin React ni Svelte.
- **Privacidad total** — el dato nunca sale del dispositivo del usuario.

### Lo que NO entra en esta versión

- Sincronización entre dispositivos
- Compartir progreso con un link
- Historial o múltiples contadores

---

## MVP v2 — Autenticación Personal (Supabase + Google)

### Alcance

- Login con Google (via Supabase Auth)
- El usuario ingresa manualmente su fecha de última chela
- La app muestra SU contador personal (misma UI, datos dinámicos)
- La página pública `/` sigue existiendo como landing/demo

### Flujo de Usuario

1. Usuario llega a `/` → ve la app demo (con mi fecha, como ahora)
2. Botón "Llevar mi propio contador" → login con Google
3. Primera vez → `/setup`: formulario para ingresar su fecha
4. Guarda en Supabase → redirige a `/dashboard`
5. Visitas siguientes → Google auth → directo a `/dashboard` con su contador

### Arquitectura

#### Stack

| Capa | Tecnología |
|---|---|
| Frontend | Astro (SSR) + Tailwind CSS v4 |
| Auth | Supabase Auth (Google OAuth) |
| Base de datos | Supabase (PostgreSQL) |
| Deploy | Vercel (con `@astrojs/vercel` adapter) |

#### Rutas

| Ruta | Descripción |
|---|---|
| `/` | Landing pública — demo con fecha hardcodeada |
| `/login` | Redirect a Google OAuth via Supabase |
| `/auth/callback` | Callback OAuth, crea sesión, redirige |
| `/setup` | Formulario de primera vez: ingresar fecha |
| `/dashboard` | Contador personal del usuario autenticado |

#### Base de Datos (Supabase)

```sql
-- Tabla: profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  last_beer_date date not null,
  created_at timestamptz default now()
);

-- RLS: cada usuario solo ve su propio registro
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

#### Variables de Entorno

```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

### Seguridad

- Credenciales solo en variables de entorno (nunca en código)
- Row Level Security (RLS) en Supabase — cada usuario solo accede a su fila
- Sesiones manejadas por Supabase Auth (JWT en cookies httpOnly)
- HTTPS enforced por Vercel
- El `anon key` de Supabase es seguro de exponer en cliente (RLS lo protege)

### Cambios Técnicos Necesarios

1. **Migrar de static a SSR** — agregar `output: 'server'` y `@astrojs/vercel`
2. **Instalar Supabase** — `@supabase/supabase-js` + `@supabase/ssr`
3. **Refactorizar `START_DATE`** — extraer a helper compartido que acepta fecha dinámica
4. **Nuevas páginas** — `/login`, `/auth/callback`, `/setup`, `/dashboard`
5. **Middleware de auth** — redirigir a `/login` si usuario no autenticado intenta acceder a `/dashboard`
6. **Variables de entorno** — `.env.example` documentado

### Fases de Implementación

#### Fase 1 — Infraestructura
- Configurar proyecto en Supabase (Auth + tabla + RLS)
- Migrar Astro a SSR con adapter de Vercel
- Instalar y configurar `@supabase/ssr`
- Variables de entorno

#### Fase 2 — Auth
- Ruta `/login` → redirect a Google
- Ruta `/auth/callback` → manejar token, crear sesión
- Middleware de protección de rutas

#### Fase 3 — Flujo de usuario
- Ruta `/setup` — formulario para ingresar fecha
- Ruta `/dashboard` — mismos componentes (Counter, Milestones, FunFacts)
  pero con `START_DATE` dinámico desde la DB
- Botón de logout

### Fase 4 — Landing
- `/` agrega botón "Llevar mi propio contador"
- Detección de sesión activa → redirige directo a `/dashboard`

## Lo que NO entra en el MVP

- Perfil público compartible
- Cambiar la fecha una vez registrada (puede venir en v2)
- Rankings o componente social
- Notificaciones o recordatorios
