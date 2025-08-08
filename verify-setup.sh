#!/bin/bash

# 🔍 Script de Verificación Post-Instalación
echo "🔍 Verificando configuración del proyecto..."
echo "============================================="

# Verificar archivos críticos
echo "📁 Verificando archivos críticos..."

FILES=(".env" "node_modules" "package.json" "src/app.js")
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "  ✅ $file existe"
    else
        echo "  ❌ $file NO encontrado"
        if [ "$file" == ".env" ]; then
            echo "     💡 Ejecuta: cp .env.example .env y configura las variables"
        fi
        if [ "$file" == "node_modules" ]; then
            echo "     💡 Ejecuta: npm install"
        fi
    fi
done

# Verificar variables de entorno críticas
if [ -f ".env" ]; then
    echo ""
    echo "🔧 Verificando variables de entorno..."
    
    REQUIRED_VARS=("MONGODB_URI" "JWT_SECRET" "PORT")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env && ! grep -q "^$var=$" .env; then
            echo "  ✅ $var configurada"
        else
            echo "  ⚠️  $var necesita configuración"
        fi
    done
    
    # Verificar OAuth (opcional)
    if grep -q "^GOOGLE_CLIENT_ID=" .env && ! grep -q "^GOOGLE_CLIENT_ID=$" .env; then
        echo "  ✅ Google OAuth configurado"
    else
        echo "  ℹ️  Google OAuth no configurado (opcional)"
    fi
fi

# Verificar conectividad de servicios
echo ""
echo "🔌 Verificando servicios..."

# MongoDB
if command -v mongod &> /dev/null; then
    echo "  ✅ MongoDB instalado"
    if pgrep mongod > /dev/null; then
        echo "  ✅ MongoDB ejecutándose"
    else
        echo "  ⚠️  MongoDB no está ejecutándose"
        echo "     💡 Ejecuta: npm run mongo:start"
    fi
else
    echo "  ❌ MongoDB no instalado"
    echo "     💡 Instala MongoDB: https://docs.mongodb.com/manual/installation/"
fi

# Node.js versión
echo ""
echo "📋 Información del sistema..."
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"

# Puertos
echo ""
echo "🌐 Verificando puertos..."
if command -v lsof &> /dev/null; then
    PORT=${PORT:-3000}
    if lsof -i :$PORT &> /dev/null; then
        echo "  ⚠️  Puerto $PORT en uso"
        echo "     💡 Cambia PORT en .env o cierra la aplicación que lo usa"
    else
        echo "  ✅ Puerto $PORT disponible"
    fi
else
    echo "  ℹ️  No se puede verificar puertos (lsof no disponible)"
fi

echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm start        # Producción"
echo "   npm run dev      # Desarrollo"
echo ""
echo "📖 Para más ayuda:"
echo "   cat INSTALLATION.md"
echo "   cat QUICKSTART.md"
