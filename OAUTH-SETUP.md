# 🔐 Configuración Google OAuth 2.0 - Guía Esencial

## 🎯 Resumen

Esta guía te ayuda a configurar Google OAuth 2.0 para tu TodoApp. Tienes 3 opciones:

1. **🧪 Modo Demo** - Funciona inmediatamente (sin configuración)
2. **🔑 OAuth Real** - Autenticación con tu cuenta Google (requiere setup)
3. **📧 Login Tradicional** - Email y contraseña (sin OAuth)

## � Opción 1: Modo Demo (Más Fácil)

**Usa esto si solo quieres probar la aplicación:**

1. Ve a http://localhost:3000
2. Haz clic en **"Demo Mode (Sin credenciales)"**
3. ¡Listo! Ya tienes acceso completo

✅ **Sin configuración necesaria**
✅ **Funciona inmediatamente**
✅ **Demuestra todas las funcionalidades**

## � Opción 2: OAuth Real con Google

**Usa esto si quieres autenticación real con Google:**

### Paso 1: Google Cloud Console
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo o usa uno existente
3. Habilita estas APIs en "APIs y servicios" → "Biblioteca":
   - **People API**
   - **Google+ API**

### Paso 2: Configurar OAuth Consent Screen
1. "APIs y servicios" → "Pantalla de consentimiento OAuth"
2. Selecciona **"Externo"**
3. Completa información básica:
   ```
   Nombre de la aplicación: TodoApp
   Correo de asistencia: tu_email@gmail.com
   ```
4. En **"Usuarios de prueba"** → Agregar tu email
5. Guardar

### Paso 3: Crear Credenciales
1. "APIs y servicios" → "Credenciales"
2. "Crear credenciales" → "ID de cliente OAuth 2.0"
3. Tipo: **"Aplicación web"**
4. Configurar:
   ```
   URIs de JavaScript autorizados:
   http://localhost:3000
   
   URIs de redireccionamiento autorizados:
   http://localhost:3000/api/auth/google/callback
   ```
5. Copiar **Client ID** y **Client Secret**

### Paso 4: Actualizar .env
```env
GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_client_secret_aqui
```

### Paso 5: Reiniciar servidor
```bash
npm run dev
```

## 📧 Opción 3: Login Tradicional

**Usa esto si prefieres email y contraseña:**

1. Ve a http://localhost:3000
2. Haz clic en **"Usar Email y Contraseña"**
3. Regístrate con tu email
4. ¡Listo!

## � Troubleshooting

### Error 403: "access_denied"
**Causa:** Tu email no está en usuarios de prueba
**Solución:** 
1. Google Cloud Console → "Pantalla de consentimiento OAuth"
2. "Usuarios de prueba" → Agregar tu email
3. Esperar 5-10 minutos

### Error: "Failed to fetch user profile"
**Causa:** APIs no habilitadas
**Solución:**
1. Google Cloud Console → "APIs y servicios" → "Biblioteca"
2. Buscar y habilitar **"People API"**
3. Reiniciar servidor

### Error: "Invalid credentials"
**Causa:** Client ID/Secret incorrectos
**Solución:**
1. Verificar credenciales en Google Cloud Console
2. Copiar exactamente a `.env`
3. Reiniciar servidor

## ⏰ Tiempos de Propagación

- **Habilitar APIs:** 5-10 minutos
- **Agregar usuarios de prueba:** 5-10 minutos
- **Cambios de credenciales:** Inmediato

## 💡 Recomendación

Para un examen o demostración rápida:
1. **Usar "Demo Mode"** primero para mostrar funcionalidad
2. Configurar OAuth real después si es necesario

¡Tu aplicación funciona perfectamente con cualquiera de estas opciones! 🎉
