#!/bin/bash

# 🚀 Script de Preparación para Deployment
echo "🚀 Preparando proyecto para deployment..."
echo "========================================"

# Verificar que estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo "❌ Este directorio no es un repositorio Git"
    echo "💡 Ejecuta: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Verificar archivos importantes
echo "📁 Verificando archivos de deployment..."

FILES=("package.json" "railway.json" "Procfile" ".env.example" ".env.production")
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "  ✅ $file existe"
    else
        echo "  ❌ $file NO encontrado"
    fi
done

# Verificar que no hay .env en git
if git ls-files | grep -q "^.env$"; then
    echo "  ⚠️  ¡CUIDADO! .env está en Git (debería estar en .gitignore)"
    echo "     💡 Ejecuta: git rm --cached .env"
else
    echo "  ✅ .env no está en Git (correcto)"
fi

# Verificar scripts en package.json
echo ""
echo "📦 Verificando package.json..."
if grep -q '"start".*"node src/app.js"' package.json; then
    echo "  ✅ Script 'start' configurado"
else
    echo "  ❌ Script 'start' no encontrado o incorrecto"
fi

# Sugerir plataformas
echo ""
echo "🌐 Plataformas recomendadas para deployment:"
echo "  1. 🔥 Railway (railway.app) - Más fácil"
echo "  2. 🚀 Render (render.com) - Muy confiable" 
echo "  3. ⚡ Cyclic (cyclic.sh) - Completamente gratis"
echo "  4. 🟦 Vercel (vercel.com) - Para frontend"

# Preparar commit
echo ""
echo "📤 Preparando para subir a Git..."
echo "¿Quieres hacer commit de los cambios? (y/n): "
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    git add .
    git status
    echo ""
    echo "Mensaje de commit (o Enter para usar mensaje automático): "
    read -r commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="feat: add deployment configuration for Railway, Render, and Cyclic"
    fi
    
    git commit -m "$commit_msg"
    echo "✅ Commit realizado"
    echo ""
    echo "🚀 Ahora puedes:"
    echo "   git push origin main"
    echo "   Luego ir a tu plataforma de hosting favorita"
else
    echo "ℹ️  Commit cancelado"
fi

echo ""
echo "📖 Para instrucciones detalladas, lee:"
echo "   cat DEPLOYMENT.md"
echo ""
echo "🎉 ¡Tu proyecto está listo para deployment!"
