# ⚡ Guía Rápida de Migración

## Para otra persona que clona el repositorio:

### 1. Paso 1: Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd todo-api
```

### 2. Paso 2: Configuración automática
```bash
# Opción A: Script automático (recomendado)
chmod +x setup.sh
./setup.sh

# Opción B: Manual
npm install
cp .env.example .env
```

### 3. Paso 3: Configurar variables de entorno
```bash
# Editar .env con tu editor favorito
nano .env

# Mínimo requerido:
# - MONGODB_URI (tu conexión MongoDB)
# - JWT_SECRET (generar uno seguro)
# - PORT (por defecto 3000)
```

### 4. Paso 4: Verificar configuración
```bash
./verify-setup.sh
```

### 5. Paso 5: Iniciar MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS con Homebrew
brew services start mongodb-community

# Windows
net start MongoDB

# O usar npm script
npm run mongo:start
```

### 6. Paso 6: Ejecutar la aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### 7. Paso 7: Abrir en navegador
```
http://localhost:3000
```

## ⚠️ Problemas Comunes

### MongoDB no se conecta
- Verificar que MongoDB esté ejecutándose
- Verificar MONGODB_URI en .env
- Ver: `docs/SOLUCION-ERROR-403.md`

### Google OAuth no funciona
- Configurar credenciales en Google Cloud Console
- Ver: `docs/GOOGLE-CLOUD-SETUP.md`

### Puerto en uso
```bash
# Cambiar PORT en .env o matar proceso
lsof -ti:3000 | xargs kill -9
```

## 📞 Scripts Útiles

```bash
npm run reset          # Reinstalar dependencias
npm run mongo:status   # Ver estado MongoDB
npm run check:deps     # Verificar actualizaciones
./verify-setup.sh      # Verificar configuración
```

---
**¿Necesitas ayuda?** Lee `INSTALLATION.md` o `README.md`
