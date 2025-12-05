#!/bin/bash

# Script d'installation du CLI Render dans WSL (sans sudo)

echo "🚀 Installation du CLI Render v2.5.0 dans WSL..."

# Créer le dossier bin local si nécessaire
mkdir -p ~/.local/bin

# Télécharger et extraire le CLI
cd /tmp
echo "📥 Téléchargement..."
curl -L -o render-cli.zip "https://github.com/render-oss/cli/releases/download/v2.5.0/cli_2.5.0_linux_amd64.zip"

echo "📦 Extraction..."
unzip -o render-cli.zip

# Le fichier extrait s'appelle cli_v2.5.0, pas render
echo "🔧 Installation..."
chmod +x cli_v2.5.0
mv cli_v2.5.0 ~/.local/bin/render

# Ajouter ~/.local/bin au PATH si ce n'est pas déjà fait
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    echo "✅ PATH mis à jour dans ~/.bashrc"
fi

# Charger le nouveau PATH
export PATH="$HOME/.local/bin:$PATH"

# Nettoyer
rm -f render-cli.zip LICENSE README.md

# Vérifier l'installation
if command -v render &> /dev/null; then
    echo "✅ CLI Render installé avec succès!"
    echo "📋 Version:"
    render --version
    echo ""
    echo "🎯 Prochaines étapes:"
    echo "   1. Fermez et rouvrez votre terminal WSL (ou exécutez: source ~/.bashrc)"
    echo "   2. Exécutez: render login (vous êtes déjà connecté normalement)"
    echo "   3. Puis: cd /mnt/c/Users/DELL/Desktop/git/app2/backend && render deploy"
else
    echo "❌ Erreur lors de l'installation"
    echo "💡 Essayez de fermer et rouvrir votre terminal WSL"
    exit 1
fi
