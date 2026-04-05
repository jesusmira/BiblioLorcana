# Archivo del Reino de Lorcana

Galería de cartas de Lorcana con filtros, búsqueda por imagen OCR, recuperación de contraseña y modo claro/oscuro.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **Zustand** (estado global)
- **Prisma** (ORM + PostgreSQL)
- **Anthropic Claude Vision** (OCR)
- **Resend** (emails transaccionales)
- **Axios** (HTTP client)
- **Upstash Redis** (rate limiting en producción)
- **clsx** + **tailwind-merge** (utilidades de clases)
- **Heroicons** (iconos)

## Requisitos

- Node.js 18+
- PostgreSQL (Docker o local)
- npm
- API key de Anthropic (opcional, para OCR)
- API key de Resend (para recuperación de contraseña)

## Instalación

1. **Clonar el proyecto**
   ```bash
   git clone https://github.com/jesusmira/BiblioLorcana.git
   cd BiblioLorcana
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   
   # OCR (opcional)
   # NEXT_PUBLIC_ANTHROPIC_API_KEY=tu_api_key
   
   # Email (para recuperación de contraseña)
   # RESEND_API_KEY=re_xxx
   # APP_URL=http://localhost:3000
   ```

4. **Iniciar la base de datos**
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar migraciones de Prisma**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

La app estará disponible en: `http://localhost:3000`

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `LORCAST_API_BASE` | URL de la API de Lorcast | `https://api.lorcast.com/v0` |
| `NEXT_PUBLIC_PAGE_SIZE` | Cartas por página en la galería | `16` |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | API key para Claude Vision (opcional) | - |
| `RESEND_API_KEY` | API key para emails (Recuperar contraseña) | - |
| `APP_URL` | URL de la app (para enlaces de email) | `http://localhost:3000` |
| `UPSTASH_REDIS_REST_URL` | URL de Upstash Redis (producción) | - |
| `UPSTASH_REDIS_REST_TOKEN` | Token de Upstash Redis (producción) | - |

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción + typecheck |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |
| `npx prisma studio` | UI de Prisma para la DB |
| `npx prisma migrate dev` | Crear migración |
| `npx prisma db push` | Sincronizar schema con DB |
| `npx prisma generate` | Regenerar cliente Prisma |

## Páginas

- `/` - Galería principal de cartas (por defecto Winterspell)
- `/buscar-imagen` - Búsqueda de cartas por imagen (OCR)
- `/mis-cartas` - Colección personal del usuario
- `/mis-mazos` - Gestión de mazos
- `/login` - Inicio de sesión
- `/registro` - Registro de usuarios
- `/olvide-contrasena` - Recuperar contraseña
- `/restablecer-contrasena/[token]` - Nueva contraseña
- `/como-jugar` - Manual del juego

## Estructura del Proyecto

```
app/
├── _shared/                 # Componentes reutilizados entre páginas
│   ├── _components/        # CardRow, InkDot, ManaCurve, etc.
├── actions/                 # Server Actions
├── api/                    # API Routes
│   ├── auth/              # Autenticación
│   ├── lorcast/           # Proxy a API de Lorcast
│   └── ocr/               # OCR con Claude Vision
├── buscar-imagen/          # Página de búsqueda por imagen
│   └── _hooks/            # Hook específico de la página
├── como-jugar/             # Página cómo jugar
│   └── components/         # Componentes de sección
├── components/              # Componentes React globales
│   ├── Gallery/           # Subcarpeta de componentes de galería
│   │   ├── components/    # GalleryCards, GalleryCardItem, GalleryCardModal
│   │   ├── header/        # GalleryHeader, GallerySectionHeader
│   │   └── styles.ts      # Estilos compartidos
│   ├── SiteHeader/        # Header con navegación
│   │   ├── HeaderLogo.tsx
│   │   ├── HeaderNav.tsx
│   │   ├── HeaderActions.tsx
│   │   ├── HeaderMobileNav.tsx
│   │   ├── UserMenuContent.tsx
│   │   └── useHeaderScroll.ts
│   └── CookieBanner/      # Banner de cookies
├── hooks/                  # Custom Hooks globales
├── lib/                    # Utilidades, constantes, auth, email
│   ├── styles.ts          # Estilos compartidos (clsx utilities)
│   ├── cn.ts              # Función classNames
│   └── constants.ts        # Constantes del proyecto
├── login/                  # Página de login
│   └── _hooks/            # Hook específico
├── mis-cartas/             # Página de colección personal
│   └── _hooks/            # Hook específico
├── mis-mazos/             # Página de gestión de mazos
│   └── _hooks/            # Hook específico
├── olvide-contrasena/     # Página de recuperación
│   └── _hooks/            # Hook específico
├── registro/               # Página de registro
│   └── _hooks/            # Hook específico
├── restablecer-contrasena/[token]/ # Nueva contraseña
│   └── _hooks/            # Hook específico
├── services/              # Servicios (lorcastService)
├── store/                 # Zustand stores
│   ├── cookieConsentStore.ts
│   ├── favoritesStore.ts
│   ├── galleryStore.ts
│   ├── themeStore.ts
│   └── userCardsStore.ts
└── types/                 # Tipos TypeScript
```

## Principios y Buenas Prácticas

El proyecto sigue principios de Clean Code y SOLID:

- **SRP**: Cada componente tiene responsabilidad única
- **OCP**: Componentes extensibles sin modificar existentes
- **DIP**: Dependencias a través de abstracciones (props/hooks)
- **ISP**: Interfaces pequeñas y específicas
- **DRY**: Código重复ido minimizado con hooks y componentes compartidos

### Estructura de Componentes

Los componentes complejos están organizados en carpetas con:
- `index.ts` - Barrel exports
- Componentes hijos en subcarpetas
- Tipos en `types.ts`
- Estilos en `styles.ts`
- Hooks personalizados cuando corresponde

## Constantes

Todas las constantes del proyecto están centralizadas en `app/lib/constants.ts`:

- `APP` - DEFAULT_SET_CODE, PAGE_SIZE
- `STORAGE_KEYS` - OCR_IMAGE, THEME
- `API` - LORCAST_BASE
- `THEME` - DEFAULT

Los colores de inks están en `app/lib/styles.ts`:
- `INK_COLORS` - Mapa de colores por tinta

## Validación

Validación de formularios con Zod en `app/lib/schemas.ts`:
- Login: email y password requeridos
- Registro: contraseña robusta (8+ caracteres, mayúscula, minúscula, número, especial)
- Recuperación de contraseña: misma validación robusta

## Características

- Galería de cartas con paginación infinita
- Set por defecto: **Winterspell**
- Filtros por tinta, tipo, rareza y búsqueda
- Selector de set de cartas
- Modal con detalles de carta
- Traducción de texto de cartas (inglés a español)
- Botón scroll-to-top
- Tema claro/oscuro con persistencia
- Menú responsive
- Banner de cookies con gestión de consentimiento
- Registro y login de usuarios
- Recuperación de contraseña por email (Resend)
- Validación robusta de contraseñas con Zod
- Diseño con tipografía Cinzel + Work Sans
- Favoritos guardados en localStorage
- Colección personal guardada en BD
- Gestión de mazos con plantillas
- Contador en tiempo real de cartas en colección
- Rate limiting con Upstash Redis (producción)
- Caching de API con memoria
- Arquitectura limpia: hooks específicos por página, componentes compartidos

## Usuario de Prueba

- **Email:** test@lorcana.es
- **Contraseña:** Test1234!

## Licencia

MIT
