# Archivo del Reino de Lorcana

Galería de cartas de Lorcana con filtros, búsqueda por imagen OCR y modo claro/oscuro.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **Zustand** (estado global)
- **Prisma** (ORM + PostgreSQL)
- **Docker** (PostgreSQL)
- **Anthropic Claude Vision** (OCR)

## Requisitos

- Node.js 18+
- Docker / Docker Desktop
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
| `NEXT_PUBLIC_PAGE_SIZE` | Cartas por página en la galería | `24` |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor` |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | API key para Claude Vision (opcional) | - |
| `JWT_SECRET` | Clave secreta para JWT | - |

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npx prisma studio` | UI de Prisma para la DB |
| `npx prisma migrate dev` | Crear migración |
| `npx prisma generate` | Regenerar cliente de Prisma |

## Páginas

- `/` - Galería principal de cartas
- `/buscar-imagen` - Búsqueda de cartas por imagen (OCR)
- `/mis-cartas` - Colección personal del usuario
- `/login` - Inicio de sesión
- `/registro` - Registro de usuarios
- `/como-jugar` - Información del juego

## Estructura del Proyecto

```
app/
├── actions/           # Server Actions
├── api/              # API Routes
│   ├── auth/         # Autenticación
│   ├── cards/        # Cartas locales
│   ├── lorcast/      # Proxy a API de Lorcast
│   └── ocr/          # OCR con Claude Vision
├── buscar-imagen/    # Página de búsqueda por imagen
├── components/       # Componentes React
├── hooks/            # Custom Hooks
├── lib/              # Utilidades y cliente Prisma
├── login/            # Página de login
├── mis-cartas/       # Página de colección personal
├── registro/        # Página de registro
├── store/            # Zustand stores
└── types/            # Tipos TypeScript
```

## Características

- **Galería de cartas** con paginación infinita
- **Filtros** por tinta, tipo, rareza y búsqueda
- **Selector de set** de cartas
- **Modal** con detalles de carta
- **Tema claro/oscuro** con toggle animado
- **Menú responsive** con hamburguesa
- **Registro y login** de usuarios
- **Diseño** con tipografía Cinzel + Work Sans
- **Favoritos** guardados en localStorage
- **Traducción** de texto de cartas (inglés a español) con MyMemory API
- **Búsqueda por imagen** (OCR con Claude Vision)
  - Compresión de imágenes para optimizar rendimiento
  - Detección automática de números de carta
  - Soporte para cartas normales y promocionales
  - Búsqueda en API de Lorcast y base de datos local
- **Colección personal** de cartas guardadas en BD
- **Página "Mis Cartas"** con galería de cartas guardadas

## Base de Datos

- **Contenedor Docker**: PostgreSQL 16-alpine
- **Puerto**: 5432
- **Usuario**: biblioLor_user
- **Contraseña**: biblioLor_pass
- **Base de datos**: biblioLor

### Tablas

#### users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | String | Nombre del usuario |
| email | String | Email (único) |
| password | String | Contraseña hasheada |
| role | Enum | USER o ADMIN |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Fecha de actualización |

#### cards
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | String? | Nombre de la carta |
| text | String? | Texto de habilidad |
| flavorText | String? | Texto de sabor |
| ink | String? | Tinta |
| cost | Int? | Coste de ink |
| rarity | String? | Rareza |
| type | String[] | Tipos |
| strength | Int? | Fuerza |
| willpower | Int? | Voluntad |
| lore | Int? | Historia |
| collectorNumber | String? | Número de carta |
| classifications | String[] | Clasificaciones |
| imageUrl | String? | URL de imagen |
| promoSet | String? | Set promocional |
| nonPromoSet | String? | Set no promocional |
| createdAt | DateTime | Fecha de creación |

#### user_cards
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| userId | String | FK a users |
| cardId | String | FK a cards |
| createdAt | DateTime | Fecha de creación |

## Licencia

MIT
