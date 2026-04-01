# Archivo del Reino de Lorcana

Galería de cartas de Lorcana con filtros, búsqueda por imagen OCR y modo claro/oscuro.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **Zustand** (estado global)
- **Prisma** (ORM + PostgreSQL)
- **Anthropic Claude Vision** (OCR)

## Requisitos

- Node.js 18+
- PostgreSQL (Docker o local)
- npm
- API key de Anthropic (opcional, para OCR)

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
   
   # Añadir tu API key de Anthropic para OCR (opcional)
   # NEXT_PUBLIC_ANTHROPIC_API_KEY=tu_api_key
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
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | API key para Claude Vision (opcional) | - |
| `JWT_SECRET` | Clave secreta para JWT | - |

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción + typecheck |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |
| `npx prisma studio` | UI de Prisma para la DB |
| `npx prisma migrate dev` | Crear migración |

## Páginas

- `/` - Galería principal de cartas
- `/buscar-imagen` - Búsqueda de cartas por imagen (OCR)
- `/mis-cartas` - Colección personal del usuario
- `/mis-mazos` - Gestión de mazos
- `/login` - Inicio de sesión
- `/registro` - Registro de usuarios
- `/como-jugar` - Manual del juego

## Estructura del Proyecto

```
app/
├── actions/              # Server Actions
├── api/                  # API Routes
│   ├── auth/             # Autenticación
│   ├── lorcast/          # Proxy a API de Lorcast
│   └── ocr/              # OCR con Claude Vision
├── buscar-imagen/        # Página de búsqueda por imagen
├── como-jugar/           # Página cómo jugar
│   └── components/       # Componentes de sección
├── components/           # Componentes React globales
├── hooks/                # Custom Hooks
├── lib/                  # Utilidades, constantes, auth
├── login/                # Página de login
├── mis-cartas/            # Página de colección personal
├── mis-mazos/            # Página de gestión de mazos
├── registro/             # Página de registro
├── store/                # Zustand stores
└── types/                # Tipos TypeScript
```

## Constantes

Todas las constantes del proyecto están centralizadas en `app/lib/constants.ts`:

- `APP` - DEFAULT_SET_CODE, PAGE_SIZE
- `STORAGE_KEYS` - OCR_IMAGE, THEME
- `API` - LORCAST_BASE
- `THEME` - DEFAULT

## Características

- Galería de cartas con paginación infinita
- Filtros por tinta, tipo, rareza y búsqueda
- Selector de set de cartas
- Modal con detalles de carta
- Tema claro/oscuro con toggle animado
- Menú responsive
- Registro y login de usuarios
- Diseño con tipografía Cinzel + Work Sans
- Favoritos guardados en localStorage
- Traducción de texto de cartas (inglés a español)
- Búsqueda por imagen (OCR con Claude Vision)
- Colección personal guardada en BD
- Gestión de mazos con plantillas

## Licencia

MIT
