#!/bin/bash

set -e

echo "🛠  Compilando proyecto..."
pnpm run build

if [ ! -d "dist" ]; then
  echo "❌ ERROR: No se generó la carpeta dist/"
  exit 1
fi

echo "🚀 Haciendo deploy a GitHub Pages..."
pnpm run deploy

echo ""
echo "✅ ¡Deploy exitoso!"
echo "🌐 Tu sitio está en: https://jabernalv.github.io/herramientas-trading/"
