# Archivo del Reino de Lorcana

Galeria de cartas de Lorcana con filtros, busqueda y modo claro/oscuro.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **Zustand** (estado global)
- **Prisma** (ORM + PostgreSQL)
- **Docker** (PostgreSQL)

## Requisitos

- Node.js 18+
- Docker / Docker Desktop
- npm

## Instalacion

1. **Clonar el proyecto**
   ```bash
   git clone <repo-url>
   cd Ant-opencode
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el ejemplo
   cp .env.example .env
   
   # Editar .env si es necesario (ya viene configurado para Docker local)
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

La app estara disponible en: `http://localhost:3000`

## Variables de Entorno

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `LORCAST_API_BASE` | URL de la API de Lorcast | `https://api.lorcast.com/v0` |
| `NEXT_PUBLIC_PAGE_SIZE` | Cartas por pagina en la galeria | `24` |
| `DATABASE_URL` | Conexion a PostgreSQL | `postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor` |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | API key para Claude Vision (opcional) | - |

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run lint` | Ejecutar linter |
| `npx prisma studio` | UI de Prisma para la DB |
| `npx prisma migrate dev` | Crear migracion |
| `npx prisma generate` | Regenerar cliente de Prisma |

## Estructura del Proyecto

```
app/
├── actions/          # Server Actions
├── components/       # Componentes React
├── hooks/            # Custom Hooks
├── lib/              # Utilidades y cliente Prisma
├── store/            # Zustand stores
├── types/            # Tipos TypeScript
├── globals.css       # Estilos globales y variables CSS
├── layout.tsx        # Layout raiz
└── page.tsx          # Pagina principal

prisma/
├── schema.prisma     # Esquema de la base de datos
└── migrations/       # Migraciones de la DB

public/
└── images/           # Imagenes estaticas
```

## Base de Datos

- **Contenedor Docker**: PostgreSQL 16-alpine
- **Puerto**: 5432
- **Usuario**: biblioLor_user
- **Contrasena**: biblioLor_pass
- **Base de datos**: biblioLor

### Tablas

#### users
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| name | String | Nombre del usuario |
| email | String | Email (unico) |
| password | String | Contrasena hasheada |
| role | Enum | USER o ADMIN |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Fecha de actualizacion |

#### cards
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
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
| collectorNumber | String? | Numero de carta |
| classifications | String[] | Clasificaciones |
| imageUrl | String? | URL de imagen |
| promoSet | String? | Set promocional |
| nonPromoSet | String? | Set no promocional |
| createdAt | DateTime | Fecha de creacion |

#### user_cards
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| userId | String | FK a users |
| cardId | String | FK a cards |
| createdAt | DateTime | Fecha de creacion |

## Caracteristicas

- Galeria de cartas con paginacion infinita
- Filtros por tinta, tipo, rareza y busqueda
- Selector de set de cartas
- Modal con detalles de carta
- Tema claro/oscuro con toggle animado
- Menu responsive con hamburguesa
- Registro y login de usuarios
- Diseño con tipografia Cinzel + Work Sans
- Favoritos guardados en localStorage
- Traduccion de texto de cartas (ingles a español) con MyMemory API
- Iconos Heroicons
- Busqueda de cartas por imagen (OCR con Claude Vision)
  - Compresion de imagenes para optimizar rendimiento
  - Detector de numeros de carta con correccion (l → 1, I → 1)
  - Busqueda en API de Lorcast y base de datos local
  - Soporte para cartas especiales (promocionales) con promo_set y non_promo_set
- Coleccion personal de cartas guardadas en BD
- Pagina "Mis Cartas" con galeria de cartas guardadas
- GitHub Actions workflow para OpenCode AI
- API Routes para OCR, busqueda de cartas y gestion de usuario
- Base de datos con soporte para cartas promocionales

## Licencia

MIT
