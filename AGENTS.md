# AGENTS.md

## Resumen del proyecto

- Proyecto Next.js 14 con app router (TypeScript + React).
- UI con Tailwind CSS y variables CSS en `app/globals.css`.
- Datos desde la API de Lorcast mediante server actions.
- Estado cliente con Zustand en `app/store`.
- Tipos compartidos en `app/types`.

## Comandos

- Instalar dependencias: `npm install`
- Servidor de desarrollo: `npm run dev`
- Build de produccion: `npm run build`
- Iniciar servidor de produccion: `npm run start`
- Lint: `npm run lint`
- Tests: no hay runner configurado.
- Test individual: no disponible; agrega un runner antes de tests puntuales.
- Typecheck: se ejecuta dentro de `npm run build`.
- Archivo de entorno: `.env` (opcional, usado por Next).

## Estructura del repo

- `app/` entrada del app router.
- `app/page.tsx` pagina principal.
- `app/layout.tsx` layout raiz y metadata.
- `app/components/` componentes UI.
- `app/components/index.ts` barrel exports.
- `app/hooks/` hooks cliente.
- `app/hooks/index.ts` barrel exports.
- `app/actions/` server actions (`use server`).
- `app/lib/` utilidades.
- `app/store/` store Zustand.
- `app/types/` tipos TypeScript compartidos.
- `tailwind.config.js` configuracion Tailwind.

## TypeScript

- `tsconfig.json` usa `strict: true`.
- Evita `any`; prefiere `unknown` con narrowing.
- Funciones exportadas deben tener retorno explicito.
- Componentes y hooks con tipos de props explicitos.
- Usa `Record<...>` para mapas.
- Centraliza tipos en `app/types` y reutiliza.
- Prefiere `interface` para objetos y `type` para uniones.

## React y Next

- Usa componentes funcionales.
- No uses `React.FC`; tipa props en la firma.
- Componentes cliente deben iniciar con `"use client"`.
- Server actions deben iniciar con `"use server"`.
- No llamar server actions dentro del render.
- Usa `useEffect` solo para side effects.
- Usa `Metadata` y `Viewport` de `next` en el layout.

## Imports

- Orden: React/Next, librerias externas, modulos internos, relativos.
- Usa barrels (`./index`) en limites de carpeta cuando no crea ciclos.
- Componentes hoja importan archivos directos para evitar ciclos.
- Evita paths relativos profundos si hay barrel.
- Ordena imports y separa grupos con linea en blanco.

## Formato

- Indentacion de 2 espacios.
- Usa punto y coma.
- Usa comillas dobles.
- Comas finales en objetos/arrays multilinea.
- Props JSX en lineas separadas si son largas.
- Mantener clases Tailwind en una linea salvo legibilidad.
- Evita bloques comentados.

## Nombres

- Componentes: PascalCase (ej. `GalleryCards`).
- Hooks: prefijo `use` (ej. `useGalleryData`).
- Archivos: PascalCase para componentes, camelCase para hooks/utils.
- Constantes: `UPPER_SNAKE_CASE` para config.
- Variables y funciones: camelCase.
- Tipos/Interfaces: PascalCase.
- Evita abreviaturas no estandar.

## Manejo de errores

- Server actions deben validar `response.ok`.
- Mensajes de error en espanol si se muestran en UI.
- Hooks cliente deben atrapar errores y setear strings.
- No ocultar errores salvo casos esperados.
- Usa optional chaining y defaults para campos API.
- Errores visibles via `StatusCard`.

## Estado y Hooks

- `useGalleryData` es la fuente de filtros.
- Usa `updateFilter` y `resetFilters`.
- Pagination en `usePagination`.
- Usa `useMemo` para listas derivadas.
- Evita deps que causen loops.
- Solo desactiva reglas de hooks con comentario claro.

## UI y estilos

- Mantener el lenguaje visual existente.
- Usar variables CSS actuales.
- Tailwind consistente con componentes existentes.
- Breakpoints con `max-[...]`.
- Botones con estilos `buttonGhost` / `buttonSolid`.
- `CardArtwork` es el renderer de imagen.
- El modal debe cerrar al click en overlay y con escape.
- Respetar comportamiento mobile (sin modal en mobile).

## Datos y entorno

- Base API: `LORCAST_API_BASE` (server-side).
- Tamano de pagina: `NEXT_PUBLIC_PAGE_SIZE` (client-side).
- `process.env` solo en server actions o constantes top-level.
- No exponer secretos en componentes cliente.

## Rendimiento

- Usa `loading="lazy"` en imagenes.
- Evita recomputar listas sin `useMemo`.
- Keys estables al renderizar listas.
- Evita funciones inline en listas profundas si es posible.

## Accesibilidad

- Mantener `aria-*` en botones y modal.
- Labels vinculadas con `htmlFor`.
- Mantener outlines de foco visibles.

## Lint y Typecheck

- `npm run lint` usa reglas de Next.
- `npm run build` ejecuta typecheck.
- Corrige lint antes de hacer commit.

## Reglas Cursor/Copilot

- No se encontraron `.cursor/rules`, `.cursorrules` o `.github/copilot-instructions.md`.
