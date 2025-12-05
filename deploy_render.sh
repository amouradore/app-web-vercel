#!/bin/bash

# Script de déploiement automatique sur Render.com
# Utilisation : ./deploy_render.sh

echo ""
echo "=========================================="
echo "  🚀 DEPLOIEMENT SUR RENDER.COM"
echo "=========================================="
echo ""

# Vérifier que le CLI Render est installé
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI n'est pas installé"
    echo ""
    echo "Installez-le avec l'une de ces commandes :"
    echo "  npm install -g @render/cli"
    echo "  ou"
    echo "  curl -sL https://render.com/install.sh | bash"
    echo ""
    exit 1
fi

echo "✅ Render CLI détecté"
echo ""

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "backend/render.yaml" ]; then
    echo "❌ Fichier backend/render.yaml introuvable"
    echo "Assurez-vous d'être à la racine du projet"
    exit 1
fi

echo "✅ Fichier render.yaml trouvé"
echo ""

# Aller dans le dossier backend
cd backend || exit 1

echo "📦 Déploiement en cours..."
echo "Cela peut prendre 5-10 minutes..."
echo ""

# Déployer sur Render
render deploy

# Vérifier le code de retour
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ DEPLOIEMENT REUSSI !"
    echo "=========================================="
    echo ""
    
    # Attendre un peu pour que le service soit prêt
    sleep 3
    
    # Obtenir l'URL du service
    echo "🌐 Informations du service :"
    echo ""
    render services list
    
    echo ""
    echo "=========================================="
    echo "  📝 PROCHAINES ETAPES"
    echo "=========================================="
    echo ""
    echo "1. Copiez l'URL de votre service (ci-dessus)"
    echo ""
    echo "2. Configurez le frontend :"
    echo "   cd ../webapp"
    echo "   echo 'REACT_APP_API_URL=https://votre-url.onrender.com' > .env"
    echo ""
    echo "3. Testez en local :"
    echo "   npm start"
    echo ""
    echo "4. Testez le backend :"
    echo "   curl https://votre-url.onrender.com/health"
    echo ""
    echo "=========================================="
    echo ""
else
    echo ""
    echo "❌ Le déploiement a échoué"
    echo ""
    echo "Vérifiez :"
    echo "  - Que vous êtes connecté : render config"
    echo "  - Les logs : render logs -f"
    echo "  - Le fichier render.yaml"
    echo ""
    exit 1
fi
