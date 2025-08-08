#!/bin/bash

# 🚀 Script de Setup Automático para TODO API
echo "🚀 Configurando TODO API con OAuth y Socket.IO..."
echo "=================================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v16+ desde https://nodejs.org/"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está disponible. Reinstala Node.js."
    exit 1
fi

# Mostrar versiones
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias. Verifica tu conexión a internet."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creando archivo de configuración .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Puedes editarlo para personalizar la configuración."
else
    echo "✅ Archivo .env ya existe."
fi

# Verificar MongoDB
echo ""
echo "🔍 Verificando MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB está instalado"
    
    # Intentar iniciar MongoDB
    if command -v systemctl &> /dev/null; then
        echo "🔄 Intentando iniciar MongoDB..."
        sudo systemctl start mongod 2>/dev/null || echo "⚠️  No se pudo iniciar MongoDB automáticamente"
    fi
else
    echo "⚠️  MongoDB no está instalado. Instálalo desde https://www.mongodb.com/try/download/community"
    echo "   O usa MongoDB Atlas (servicio en la nube) actualizando MONGODB_URI en .env"
fi

echo ""
echo "🎉 ¡Setup completado!"
echo "=================================================="
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita .env con tus configuraciones (opcional)"
echo "2. Ejecuta: npm start"
echo "3. Abre: http://localhost:3000"
echo ""
echo "📚 Documentación:"
echo "- Instalación completa: ./INSTALLATION.md"
echo "- Configuración OAuth: ./docs/GOOGLE-CLOUD-SETUP.md"
echo ""
echo "🚀 Para iniciar ahora:"
echo "   npm start"
