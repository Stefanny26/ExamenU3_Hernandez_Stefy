# Checklist de Migración para Desarrolladores

## ✅ Lista de verificación antes de hacer Git Push

### Archivos de configuración
- [ ] `.env.example` actualizado con todas las variables
- [ ] `.env.development` creado para desarrollo local
- [ ] `.gitignore` ignora `.env` pero no `.env.example`
- [ ] `package.json` tiene scripts útiles para migración

### Scripts de automatización
- [ ] `setup.sh` ejecutable y funcional
- [ ] `verify-setup.sh` ejecutable y funcional
- [ ] Scripts npm configurados correctamente

### Documentación
- [ ] `README.md` completo y actualizado
- [ ] `INSTALLATION.md` con pasos detallados
- [ ] `MIGRATION.md` con guía rápida
- [ ] `QUICKSTART.md` para inicio rápido
- [ ] Documentación OAuth en `docs/`

### Código
- [ ] Todas las dependencias en `package.json`
- [ ] No hay rutas hardcodeadas
- [ ] Variables de entorno usadas correctamente
- [ ] No hay credenciales en el código

## 🧪 Para probar la migración

### Test local (simular clonado)
```bash
# En otra carpeta
git clone [tu-repo] test-migration
cd test-migration
chmod +x *.sh
./setup.sh
./verify-setup.sh
npm start
```

### Verificar que funciona sin tu `.env`
```bash
# Renombrar tu .env temporalmente
mv .env .env.backup
cp .env.example .env
# Editar .env con configuración mínima
npm start
```

## 📋 Configuración mínima para otra persona

### Variables esenciales en `.env`
```bash
MONGODB_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=un_secret_muy_seguro_y_aleatorio
PORT=3000
```

### Variables opcionales
```bash
GOOGLE_CLIENT_ID=opcional_para_oauth
GOOGLE_CLIENT_SECRET=opcional_para_oauth
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## 🚀 Comandos que debe ejecutar la otra persona

```bash
# 1. Clonar
git clone [repo-url]
cd todo-api

# 2. Configurar
./setup.sh

# 3. Configurar .env
cp .env.example .env
# Editar .env con sus datos

# 4. Verificar
./verify-setup.sh

# 5. Ejecutar
npm start
```

---
**Este proyecto está listo para migración si todos los ítems están marcados ✅**
