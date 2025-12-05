#!/bin/bash

# Script d'installation du CLI Render pour WSL/Linux

echo "🚀 Installation du CLI Render dans WSL..."

# Détecter l'architecture
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    BINARY="render-linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    BINARY="render-linux-arm64"
else
    echo "❌ Architecture non supportée: $ARCH"
    exit 1
fi

echo "📥 Téléchargement de $BINARY..."

# Télécharger le CLI Render
curl -L -o /tmp/render "https://github.com/render-oss/cli/releases/latest/download/$BINARY"

# Rendre exécutable
chmod +x /tmp/render

# Déplacer vers /usr/local/bin (nécessite sudo)
echo "📦 Installation dans /usr/local/bin (nécessite sudo)..."
sudo mv /tmp/render /usr/local/bin/render

# Vérifier l'installation
if command -v render &> /dev/null; then
    echo "✅ CLI Render installé avec succès!"
    echo "📋 Version:"
    render --version
    echo ""
    echo "🎯 Prochaines étapes:"
    echo "   1. Exécutez: render login"
    echo "   2. Puis: render deploy"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi
