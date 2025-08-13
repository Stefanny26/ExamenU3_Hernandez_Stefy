#!/bin/bash

echo "🔍 Verificando configuración de Railway..."
echo ""

echo "📁 Estructura de archivos críticos:"
echo "✅ package.json: $([ -f package.json ] && echo "Existe" || echo "❌ No existe")"
echo "✅ src/app.js: $([ -f src/app.js ] && echo "Existe" || echo "❌ No existe")"
echo "✅ public/index.html: $([ -f public/index.html ] && echo "Existe" || echo "❌ No existe")"
echo "✅ railway.json: $([ -f railway.json ] && echo "Existe" || echo "❌ No existe")"
echo "✅ Procfile: $([ -f Procfile ] && echo "Existe" || echo "❌ No existe")"
echo "✅ nixpacks.toml: $([ -f nixpacks.toml ] && echo "Existe" || echo "❌ No existe")"
echo ""

echo "📦 Verificando package.json:"
if [ -f package.json ]; then
    echo "  - Start script: $(grep '"start"' package.json | cut -d':' -f2 | tr -d '", ')"
    echo "  - Main file: $(grep '"main"' package.json | cut -d':' -f2 | tr -d '", ')"
    echo "  - Node version: $(grep '"node"' package.json | cut -d':' -f2 | tr -d '", ')"
fi
echo ""

echo "🚀 Railway configuration files:"
if [ -f railway.json ]; then
    echo "  - Build command: $(grep 'buildCommand' railway.json | cut -d':' -f2 | tr -d '", ')"
    echo "  - Start command: $(grep 'startCommand' railway.json | cut -d':' -f2 | tr -d '", ')"
fi
echo ""

if [ -f Procfile ]; then
    echo "  - Procfile: $(cat Procfile)"
fi
echo ""

echo "🌐 Verificando conectividad a Railway:"
echo "  - URL: https://examenu3-hernandez-stefy-production.up.railway.app/"
echo "  - Testing connection..."
curl -s -I https://examenu3-hernandez-stefy-production.up.railway.app/ | head -5
echo ""

echo "✅ Verificación completa!"
