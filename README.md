# Mosconi Servicios

PWA para conectar vecinos del Barrio General Mosconi (Comodoro Rivadavia) con trabajadores de confianza.

## Requisitos previos

- [Node.js 20+](https://nodejs.org/) — instalá la versión LTS
- Cuenta gratuita en [Supabase](https://supabase.com/)

## Setup en 5 pasos

### 1. Instalar Node.js

Descargá e instalá Node.js desde https://nodejs.org/  
Elegí la versión **LTS**. Reiniciá la terminal después de instalarlo.

### 2. Crear proyecto en Supabase

1. Entrá a https://supabase.com/ y creá una cuenta gratuita
2. Creá un nuevo proyecto (guardá la contraseña de base de datos)
3. En el dashboard, andá a **SQL Editor**
4. Copiá y ejecutá el contenido de `supabase/migrations/001_initial_schema.sql`

### 3. Configurar variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_WHATSAPP_ADMIN=5492974XXXXXX
```

Los valores de Supabase los encontrás en: **Settings → API**

### 4. Crear usuario admin

En Supabase: **Authentication → Users → Add user**  
Creá un usuario con email y contraseña para el panel de administración.

### 5. Levantar el proyecto

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Abrir en http://localhost:5173
```

## Deploy en Vercel (gratuito)

1. Subí el proyecto a GitHub
2. En https://vercel.com/ importá el repositorio
3. Agregá las variables de entorno del `.env`
4. Deploy automático en cada push

## Rutas de la app

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/trabajadores` | Listado con filtros |
| `/trabajador/:id` | Perfil del trabajador |
| `/registrar` | Registro de trabajador |
| `/solicitar/:id` | Solicitud de servicio |
| `/calificar/:id` | Calificación |
| `/admin` | Panel de administración |

## Estructura del proyecto

```
src/
├── components/    # WorkerCard, StarRating, WhatsAppButton, FilterBar, Navbar, Spinner
├── pages/         # Home, Register, Workers, WorkerProfile, ServiceRequest, Rate, Admin
├── hooks/         # useWorkers, useCategories
└── lib/           # supabase.js, whatsapp.js
```
