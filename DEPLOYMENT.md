# 🚀 Guía de Deployment - Múltiples Opciones

## 🎯 Opciones de Deployment Gratuitas

### 1. 🔥 **Railway** (Más fácil - Recomendado)
### 2. � **Render** (Muy confiable)
### 3. ⚡ **Cyclic** (Completamente gratis)
### 4. 🟦 **Vercel + MongoDB Atlas** (Separado)

---

## 🔥 Opción 1: Railway (Recomendado)

### ✅ Ventajas de Railway:
- 🆓 500 horas gratis/mes
- 🗄️ MongoDB incluido
- 🔄 Auto-deploy desde GitHub
- ⚙️ Variables de entorno fáciles
- 🌐 SSL automático

### � Prerrequisitos:
1. Proyecto subido a GitHub
2. Cuenta en [railway.app](https://railway.app)

### 🔧 Pasos para Railway:

#### Paso 1: Crear archivo de configuración

Crea `railway.json` (ya creado):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Paso 2: Subir a GitHub
```bash
git add .
git commit -m "feat: add deployment configuration"
git push origin main
```

#### Paso 3: Configurar en Railway
1. Ve a [railway.app](https://railway.app)
2. **Login** con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecciona tu repositorio `todo-api`
5. **Deploy Now**

#### Paso 4: Configurar Variables de Entorno
En Railway Dashboard → **Variables**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo-api
JWT_SECRET=tu_secret_super_seguro_para_produccion
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://tu-app.railway.app
```

#### Paso 5: Configurar MongoDB
Railway te dará una base de datos automáticamente, o puedes usar MongoDB Atlas gratis.

---

## 🚀 Opción 2: Render

### 🔧 Pasos para Render:

#### Paso 1: Ir a [render.com](https://render.com)
1. **Sign up** con GitHub
2. **New** → **Web Service**
3. Conectar tu repositorio
4. Configurar:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Paso 2: Variables de entorno en Render
Ir a **Environment** y añadir:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo-api
JWT_SECRET=secret_seguro_render
NODE_ENV=production
PORT=3000
```

---

## ⚡ Opción 3: Cyclic

### 🔧 Pasos para Cyclic:

1. Ve a [cyclic.sh](https://cyclic.sh)
2. **Deploy** → Conectar GitHub
3. Selecciona tu repo
4. **Deploy**
5. Configurar variables en **Settings** → **Environment**

---

## 🟦 Opción 4: Vercel (Solo Frontend) + MongoDB Atlas

### Para Frontend en Vercel:
```bash
# En la carpeta public/
npx vercel
```

### Para Backend:
Usar Railway o Render para el backend.

---

## 🗄️ Base de Datos MongoDB

### Opción A: Railway (incluido)
Railway incluye MongoDB automáticamente.

### Opción B: MongoDB Atlas (gratis)
1. [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crear cluster gratis
3. Obtener connection string
4. Añadir a variables de entorno

---

## ✅ Verificación de Deployment

Después del deployment, verifica:
- [ ] La app carga en la URL
- [ ] Login/registro funciona
- [ ] Tareas se crean/editan/borran
- [ ] Google OAuth funciona (si configurado)
- [ ] Socket.IO funciona (notificaciones tiempo real)

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verificar `MONGODB_URI` en variables de entorno
- Verificar whitelist de IPs en MongoDB Atlas

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- No cambiar `PORT` en Railway

### OAuth no funciona
- Actualizar URLs en Google Cloud Console
- Usar HTTPS en producción

---

## 🎉 ¡Listo!

Tu aplicación ya está en línea y accesible para cualquier persona en internet.

**URLs de ejemplo:**
- Railway: `https://tu-app.railway.app`
- Render: `https://tu-app.onrender.com`
- Cyclic: `https://tu-app.cyclic.app`
