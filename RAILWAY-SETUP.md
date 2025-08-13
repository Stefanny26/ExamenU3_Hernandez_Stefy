# 🚀 Configuración Railway - SOLUCIÓN AL ERROR

## ❌ **TU ERROR ACTUAL**: `MONGODB_URI undefined`

```
Error al conectar con MongoDB: El parámetro `uri` de `openUri()` debe ser una cadena; se obtuvo el resultado "undefined"
```

## 🔧 **SOLUCIÓN INMEDIATA:**

### 1. **Ve a Railway Dashboard**
- Abre [railway.app](https://railway.app)
- Entra a tu proyecto `ExamenU3_Hernandez_Stefy`
- Haz clic en la pestaña **"Variables"**

### 2. **Configurar Variables OBLIGATORIAS**
Agrega estas variables en Railway:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/todo-api
JWT_SECRET=mi_super_secreto_jwt_railway_2024
PORT=8080
NODE_ENV=production
```
NODE_ENV=production

# OPCIONALES (para OAuth)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://tu-app.railway.app/api/auth/google/callback
```

### 3. **Obtener MongoDB URI**

#### Opción A: MongoDB Atlas (recomendado)
1. Ve a [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crea cuenta gratis
3. Crea cluster
4. Ve a "Connect" → "Connect your application"
5. Copia la URI: `mongodb+srv://usuario:password@cluster.mongodb.net/todo-api`

#### Opción B: Railway MongoDB Plugin
1. En Railway, ve a tu proyecto
2. Click "Add Service" → "Database" → "MongoDB"
3. Railway generará automáticamente `MONGODB_URI`

### 4. **Generar JWT_SECRET seguro**
```bash
# En tu terminal local, genera un secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. **Redesplegar**
Después de configurar las variables:
1. En Railway, ve a "Deployments"
2. Click "Redeploy"

## 🎯 **Variables mínimas para que funcione:**

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/todo-api
JWT_SECRET=el_secret_que_generaste
PORT=8080
NODE_ENV=production
```

## ✅ **Verificar que funciona:**
1. Espera el redespliegue (2-3 minutos)
2. Ve a los logs de Railway
3. Deberías ver: `✅ Conectado a MongoDB exitosamente`
4. Ve a tu URL de Railway y prueba la aplicación

---

## 🆘 **¿Necesitas ayuda inmediata?**

**Opción rápida - MongoDB Atlas:**
1. Regístrate en [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crea cluster gratuito
3. Obtén la connection string
4. Ponla en Railway como `MONGODB_URI`
5. Regenera `JWT_SECRET` 
6. Redespliega

**¡En 10 minutos tu app estará funcionando! 🚀**
