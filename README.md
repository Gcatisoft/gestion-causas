# ⚖️ Sistema de Causas — Aldana Cativa

## Instalación rápida (5 pasos)

### 1. Instalar Node.js
Descargá desde https://nodejs.org (versión LTS)

### 2. Abrir terminal en esta carpeta y ejecutar:
```
npm install
```

### 3. Configurar Supabase
- Creá una cuenta gratis en https://supabase.com
- Creá un nuevo proyecto
- Andá a **SQL Editor** y ejecutá este código:

```sql
CREATE TABLE causas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_expediente TEXT,
  victima TEXT NOT NULL,
  sindicado TEXT NOT NULL,
  delito TEXT NOT NULL,
  tipo_privacion TEXT CHECK (tipo_privacion IN ('aprehension', 'arresto', 'detencion')),
  fecha_privacion DATE,
  fecha_liberacion DATE,
  inspeccion_ocular TEXT,
  camara TEXT,
  testigos TEXT,
  peritos TEXT,
  comision TEXT,
  testimonios TEXT,
  informacion_adicional TEXT,
  estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'cerrada', 'archivada')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE causas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus propias causas" ON causas
  FOR ALL USING (auth.uid() = user_id);
```

### 4. Poner tus credenciales
- En Supabase andá a **Settings → API**
- Copiá la **Project URL** y la **anon public key**
- Abrí el archivo `src/App.jsx` y reemplazá las líneas 10 y 11:

```js
const SUPABASE_URL = "https://tuproyecto.supabase.co";
const SUPABASE_ANON_KEY = "eyJ...tu_clave...";
```

### 5. Correr el sistema
```
npm run dev
```
Abrí http://localhost:5173 en el navegador.

---

## Publicar en internet (gratis con Vercel)
```
npm install -g vercel
vercel
```
Te da una URL pública para usar desde cualquier dispositivo.
