## Goal

Mantener y mejorar la app "Días Sin Chela" — un contador de sobriedad con estética vintage/bar. El objetivo actual es corregir dos anti-patrones detectados por `npx impeccable detect src/`:

1. **`[side-tab]`** en `Milestones.astro` línea 84 — `border-left: 4px solid var(--color-amber)` en el card "Próximo logro" (tell clásico de UI generada por IA). Ya se aplicó el fix: cambiado a `border-top: 2px solid var(--color-amber)`.
2. **`[flat-type-hierarchy]`** en `index.astro` línea 107 — demasiados tamaños de fuente muy cercanos (ratio 1.8:1, varios entre 10–16px). Pendiente de corregir.

## Instructions

- **Framework**: Astro + Tailwind CSS v4
- **Lenguaje de la app**: Español, expresiones locales, humor autocrítico
- **Estética**: Vintage bar / etiqueta de cerveza — paleta amber/cream/dark wood
- **Fonts**: Barlow Condensed (`font-display`) + Playfair Display (`font-serif`) + Barlow (`font-body`)
- **Colores**: OKLCH — tokens en `global.css` bajo `@theme {}`
- **NO**: Sin cyan/purple gradients, sin glassmorphism, sin estéticas genéricas de IA
- **Deploy**: `https://dias-sin-chela.vercel.app/` (Vercel, repo GitHub `rodrigoaiz/dias-sin-chela`)
- **Fecha del dueño (Rodrigo)**: `2026-01-13` — hardcodeada como `DEV_DATE` en `dateStore.js`
- Siempre hacer `git push` al terminar cambios

## Discoveries

- `npx impeccable detect src/` es una herramienta que detecta anti-patrones de UI generada por IA — el usuario la usa para auditar la app
- El `border-left` grueso en cards es uno de los tells más reconocibles de UI de IA — reemplazado por `border-top`
- La jerarquía tipográfica plana (`flat-type-hierarchy`) ocurre cuando hay muchos tamaños muy cercanos entre sí — se necesita consolidar a pocos tamaños con ratio mínimo de 1.25 entre pasos
- Los cálculos de días/milestones/funfacts se movieron de build-time (Astro frontmatter) a client-side JS para soportar `localStorage`
- El sistema de modos (`mine` / `dev`) se guarda en `localStorage` con key `dias-sin-chela:mode`
- La fecha del usuario se guarda en `localStorage` con key `dias-sin-chela:last-beer-date`
- El evento `window.dispatchEvent(new CustomEvent('date-updated'))` sincroniza todos los componentes cuando cambia la fecha o el modo

## Relevant files / directories

```
/home/rodrigo-aizpuru/Documentos/Dev/dias-sin-chela/
├── src/
│   ├── styles/
│   │   └── global.css                  — tokens de color OKLCH bajo @theme {}
│   ├── scripts/
│   │   └── dateStore.js                — helpers: getStartDate, setStartDate, clearStartDate,
│   │                                     calcDays, formatDate, getMode, setMode, DEV_DATE
│   ├── pages/
│   │   └── index.astro                 — toggle header, botón reset, script de modos
│   └── components/
│       ├── Counter.astro               — client-side JS, lee localStorage
│       ├── Milestones.astro            — client-side JS, milestones y progreso
│       ├── FunFacts.astro              — client-side JS, lee localStorage
│       └── Onboarding.astro            — modal primera visita, input de fecha
├── public/
│   └── robots.txt                      — permite todo, referencia sitemap
├── .impeccable.md                      — design context (brand, aesthetic, principles)
└── astro.config.mjs                    — site URL + @astrojs/sitemap
```

## Design Context

### Users

**Who:** Spanish-speaking adults (Mexico-first) who are personally tracking sobriety from beer. Not clinical users, not people in crisis — people who decided, quietly and on their own terms, to see how long they can go without a chela. The author is the archetypal user: tech-savvy, self-aware, has a sense of humor about himself.

**Context of use:** Alone, on a phone or desktop, usually checking their streak. A quick glance, not a long session. They're not here to process feelings — they're here to see the number and feel a small, private satisfaction.

**Job to be done:** Know exactly how many days it's been. Celebrate milestones without ceremony. Keep going.

**Emotional goal:** A mix of quiet pride and wry self-deprecation. The interface should feel like looking at your own tally marks on a cantina wall — not a wellness app, not a support group.

---

### Brand Personality

**Three words:** Honesta, seca, cantinera.

**Voice:** The app doesn't congratulate you effusively. It counts. If you hit a milestone, it acknowledges it — drily, like a bartender sliding you a glass of water. The humor is Mexican-casual and autocrítico: self-aware without being self-pitying. Never preachy.

**Tone:** Like a beer label on a bottle that's been sitting on a shelf for thirty years. Slightly weathered. Handmade-feeling even when it's digital. Unpretentious.

**Emotional register:** Private achievement. The app is your quiet witness, not your cheerleader.

---

### Aesthetic Direction

**Theme:** Dark only. These are streaks you check at night, in a bar you didn't go to, on a phone you're not drunk-texting from.

**Visual tone:** Vintage beer label packaging — kraft paper warmth, amber-and-gold monochromatic palette, condensed type with wide tracking, ornamental rules and frames. The aesthetic touchstones are craft beer label design (illustrated, typographically rich, earthy) and Mexican cantina signage (bold, legible, slightly rough).

**Anti-references (hard constraints):**
- Nothing clinical, wellness-adjacent, or "health app" (no greens, no blues, no progress rings)
- Nothing AA/12-step adjacent (no hopeful sunrise imagery, no "you can do it" energy)
- Nothing startup/SaaS generic (no Inter, no purple gradients, no glassmorphism, no rounded-everything)
- Nothing AI-slop typical (no side-stripe cards, no gradient text, no hero-metric templates, no "same card grid" layouts)

**Palette:** Warm amber/gold as the single accent hue against near-black warm backgrounds. No secondary hue. OKLCH throughout. Tint all neutrals toward hue 60 (amber). Colors are already well-defined in `global.css` — do not introduce new hue families.

**Typography in use:**
- `Barlow Condensed` — display/UI voice: uppercase, wide-tracked, bold or black weight
- `Playfair Display` — editorial/emotional moments only: italic, quotes, milestone flavor text
- `Barlow` — body text: readable, unremarkable, lets the display type lead

**Note on fonts:** These are already established. When considering new type decisions, stay within this system. Do NOT introduce Playfair Display for UI chrome — it's reserved for emotional/quoted moments only. Do NOT use Barlow Condensed at small sizes without adequate tracking.

---

### Design Principles

1. **El número manda.** The day count is the entire product. Every design decision should serve the legibility and emotional weight of that number. Never compete with it.

2. **La cantina, no el spa.** The aesthetic is a weathered dive bar, not a wellness retreat. Warm, slightly rough, monochromatic amber. If a design choice looks "healthy" or "calming" in a medical sense, it's wrong.

3. **Sin aplausos.** The app doesn't cheer. Milestones are acknowledged, not celebrated with fanfare. Restraint in copy, restraint in UI feedback, restraint in animation. One thing at a time.

4. **Tipografía como identidad.** Barlow Condensed + extreme tracking-widest IS the brand voice. It should feel like a stamp, a label, a sign — not a screen. Preserve and strengthen this system; don't dilute it with soft type choices.

5. **Solo un color de acento.** Amber/gold is the only chromatic accent. This constraint is a feature — it makes every amber element feel meaningful. Do not introduce secondary accent colors.

---

### Technical Constraints

- **Framework:** Astro 6.x, static (no SSR), Tailwind CSS v4
- **Interactivity:** Vanilla JS only, no React/Svelte/Vue
- **Colors:** OKLCH, defined as `@theme` tokens in `src/styles/global.css`
- **Accessibility:** WCAG AA minimum (4.5:1 for normal text, 3:1 for large text and UI components)
- **Reduced motion:** Prefer `@media (prefers-reduced-motion: reduce)` wrapping on non-essential animations
- **Deploy:** Vercel, `https://dias-sin-chela.vercel.app/`
- **Language:** Spanish (es-MX) throughout

---

### What Makes It Unforgettable

The mega-counter. `clamp(9rem, 28vw, 22rem)` — a number so large it's almost abstract. The day count as a raw typographic statement, not a dashboard widget. That scale, paired with the vintage-label framing, is what makes the product feel like a personal artifact rather than an app.

Protect this. Any redesign or new feature that shrinks or fragments the counter is wrong.
