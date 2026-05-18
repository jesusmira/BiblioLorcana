# Archivo del Reino de Lorcana

Galería de cartas de Lorcana con filtros, búsqueda por imagen OCR, gestión de mazos y colección personal.

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase Auth** (Google, GitHub, Email/Password)
- **TypeScript**
- **Prisma** (ORM + PostgreSQL en Supabase)
- **Tailwind CSS**
- **Zustand** (Estado global persistente)
- **Anthropic Claude Vision** (OCR para búsqueda por imagen)
- **Resend** (Emails transaccionales)
- **Upstash Redis** (Rate limiting)
- **Heroicons** + **Headless UI**

## Requisitos

- Node.js 18+
- Proyecto en **Supabase** (Base de datos + Auth)
- npm o pnpm
- API keys para servicios externos (opcionales para dev local)

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
   # Configura las variables de Supabase, Prisma y APIs externas
   ```

4. **Sincronizar Base de Datos**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## Estructura del Proyecto (Refactoreado)

El proyecto sigue una arquitectura modular con la lógica centralizada en `app/src`:

```
app/
├── (auth)/                  # Rutas de autenticación (login, registro)
├── (main)/                  # Galería principal y buscador OCR
├── (user)/                  # Mis Mazos, Mis Cartas, Perfil
├── src/                     # Núcleo de la aplicación
│   ├── actions/            # Server Actions unificados
│   ├── components/         # Componentes UI y Lógica Lorcana (Barrels)
│   ├── hooks/              # Custom Hooks compartidos
│   ├── lib/                # Configuración (Supabase, Prisma, Estilos)
│   ├── store/              # Stores de Zustand
│   └── types/              # Definiciones de TypeScript
└── layout.tsx               # Root Layout con Providers
```

## Características

- **Galería Pro**: Paginación optimizada, filtros avanzados por tinta, tipo y rareza.
- **Constructor de Mazos**: Modular y potente, con validación de reglas de Lorcana (máx. 2 colores).
- **Búsqueda OCR**: Identificación de cartas mediante fotos usando Claude Vision.
- **Colección Personal**: Sincronización en tiempo real con Supabase.
- **Autenticación Social**: Integración con Google y GitHub.
- **Diseño Premium**: Dark mode nativo, tipografía cuidada (Cinzel) y animaciones fluidas.
- **SEO & Perf**: Metadata dinámica, optimización de imágenes y carga diferida.

## Variables de Entorno Clave

| Variable                        | Descripción                                     |
| ------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`                  | URL de conexión directa a PostgreSQL (Supabase) |
| `DIRECT_URL`                    | URL para migraciones Prisma                     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Endpoint de tu proyecto Supabase                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key pública de Supabase                         |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Para el servicio de OCR                         |

## Usuarios de Prueba

- **Email:** `test@lorcana.es` / **Password:** `Test1234!`
- **User:** `userDemo@test.com` / **Password:** `Lorcana2025!`

## Licencia

MIT
