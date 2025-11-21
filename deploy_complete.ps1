# Script de Deploiement Complet - Railway + Vercel
# Ce script automatise le deploiement de votre application

Write-Host "DEPLOIEMENT COMPLET - Railway + Vercel" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Verifier Git
Write-Host "Etape 1/5: Verification de Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git n'est pas installe. Veuillez installer Git d'abord." -ForegroundColor Red
    exit 1
}
Write-Host "Git est installe" -ForegroundColor Green
Write-Host ""

# Etape 2: Verifier les modifications
Write-Host "Etape 2/5: Preparation des fichiers..." -ForegroundColor Yellow
Write-Host "Fichiers modifies:" -ForegroundColor Gray
git status --short

$modified = @(
    "backend/app/main.py",
    "backend/Dockerfile",
    "backend/requirements.txt",
    "webapp/src/UnifiedStreamPlayer.js",
    "GUIDE_DEPLOIEMENT_COMPLET.md"
)

Write-Host ""
Write-Host "Fichiers cles mis a jour:" -ForegroundColor Gray
foreach ($file in $modified) {
    if (Test-Path $file) {
        Write-Host "  OK $file" -ForegroundColor Green
    } else {
        Write-Host "  ATTENTION $file (non trouve)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Etape 3: Commit et Push vers GitHub
Write-Host "Etape 3/5: Push vers GitHub..." -ForegroundColor Yellow
Write-Host ""

$commitMessage = "Backend complet avec AceStream Engine pour Railway + Frontend ameliore

- Backend: Vraie conversion AceStream vers HLS via Railway
- Frontend: Correction du probleme d'ecran noir
- Dockerfile: Installation complete d'AceStream Engine
- API: Endpoints /api/play et /api/health/acestream
- Documentation: Guide de deploiement complet

Objectif: Streaming SANS installation AceStream cote client"

Write-Host "Message du commit:" -ForegroundColor Gray
Write-Host $commitMessage -ForegroundColor DarkGray
Write-Host ""

$confirm = Read-Host "Voulez-vous pousser ces modifications vers GitHub? (O/n)"
if ($confirm -eq "" -or $confirm -eq "O" -or $confirm -eq "o") {
    
    # Copier les playlists dans backend/ si elles existent
    Write-Host "Copie des playlists M3U vers backend/..." -ForegroundColor Gray
    $playlists = @("lista.m3u", "canales_acestream.m3u", "lista_web.m3u", "lista_icastresana.m3u")
    foreach ($playlist in $playlists) {
        if (Test-Path $playlist) {
            Copy-Item $playlist "backend/" -Force
            Write-Host "  Copie: $playlist" -ForegroundColor Green
        }
    }
    
    # Git add
    Write-Host ""
    Write-Host "Ajout des fichiers..." -ForegroundColor Gray
    git add backend/app/main.py
    git add backend/Dockerfile
    git add backend/requirements.txt
    git add backend/start.sh
    git add backend/*.m3u
    git add webapp/src/UnifiedStreamPlayer.js
    git add GUIDE_DEPLOIEMENT_COMPLET.md
    git add deploy_complete.ps1
    git add README_DEPLOIEMENT.md
    git add DEPLOIEMENT_RAPIDE.md
    git add test_backend_railway.ps1
    
    # Git commit
    Write-Host "Creation du commit..." -ForegroundColor Gray
    git commit -m $commitMessage
    
    # Git push
    Write-Host "Push vers GitHub..." -ForegroundColor Gray
    git push origin main
    
    Write-Host ""
    Write-Host "Modifications poussees vers GitHub!" -ForegroundColor Green
} else {
    Write-Host "Push annule" -ForegroundColor Yellow
}
Write-Host ""

# Etape 4: Instructions Railway
Write-Host "Etape 4/5: Configuration Railway..." -ForegroundColor Yellow
Write-Host ""
Write-Host "RAILWAY - Backend Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si Railway est deja configure:" -ForegroundColor White
Write-Host "  1. Aller sur: https://railway.app/dashboard" -ForegroundColor Gray
Write-Host "  2. Railway va AUTOMATIQUEMENT detecter les changements" -ForegroundColor Gray
Write-Host "  3. Attendre 2-3 minutes pour le redeploiement" -ForegroundColor Gray
Write-Host "  4. Verifier les logs pour voir 'AceStream Engine demarre'" -ForegroundColor Gray
Write-Host ""
Write-Host "Si Railway N'EST PAS configure:" -ForegroundColor White
Write-Host "  1. Creer compte sur: https://railway.app" -ForegroundColor Gray
Write-Host "  2. New Project -> Deploy from GitHub" -ForegroundColor Gray
Write-Host "  3. Selectionner votre repository" -ForegroundColor Gray
Write-Host "  4. Root Directory: backend" -ForegroundColor Gray
Write-Host "  5. Ajouter les variables d'environnement:" -ForegroundColor Gray
Write-Host "     - PORT=8000" -ForegroundColor DarkGray
Write-Host "     - ACESTREAM_BASE_URL=http://127.0.0.1:6878" -ForegroundColor DarkGray
Write-Host "     - STORAGE_DIR=/app/storage" -ForegroundColor DarkGray
Write-Host "  6. Generate Domain (copier l'URL)" -ForegroundColor Gray
Write-Host ""

$railwayUrl = Read-Host "Entrez votre URL Railway (ou appuyez sur Entree pour configurer plus tard)"
Write-Host ""

# Etape 5: Configuration Vercel
Write-Host "Etape 5/5: Configuration Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "VERCEL - Frontend Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($railwayUrl) {
    # Creer .env.production
    Write-Host "Creation de webapp/.env.production..." -ForegroundColor Gray
    Set-Content -Path "webapp/.env.production" -Value "REACT_APP_API_URL=$railwayUrl"
    Write-Host "Fichier .env.production cree avec l'URL Railway" -ForegroundColor Green
    Write-Host ""
    
    # Ajouter au git
    git add webapp/.env.production
    git commit -m "Configure frontend avec URL Railway: $railwayUrl"
    git push origin main
    Write-Host "Configuration poussee vers GitHub" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Deploiement Vercel:" -ForegroundColor White
Write-Host "  1. Aller sur: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Import Project -> Selectionner votre repo GitHub" -ForegroundColor Gray
Write-Host "  3. Configuration:" -ForegroundColor Gray
Write-Host "     - Framework: Create React App" -ForegroundColor DarkGray
Write-Host "     - Root Directory: webapp" -ForegroundColor DarkGray
Write-Host "     - Build Command: npm run build" -ForegroundColor DarkGray
Write-Host "     - Output Directory: build" -ForegroundColor DarkGray
Write-Host "  4. Environment Variables:" -ForegroundColor Gray
if ($railwayUrl) {
    Write-Host "     - REACT_APP_API_URL = $railwayUrl" -ForegroundColor DarkGray
} else {
    Write-Host "     - REACT_APP_API_URL = [VOTRE_URL_RAILWAY]" -ForegroundColor DarkGray
}
Write-Host "  5. Deploy!" -ForegroundColor Gray
Write-Host ""

# Resume final
Write-Host ""
Write-Host "DEPLOIEMENT EN COURS!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "Etape 1: Code pousse vers GitHub" -ForegroundColor Green
Write-Host "Etape 2: Railway redeploie automatiquement le backend" -ForegroundColor Yellow
Write-Host "Etape 3: Configurer Vercel manuellement (voir instructions ci-dessus)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour plus de details, consultez: GUIDE_DEPLOIEMENT_COMPLET.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Une fois deploye, testez votre app:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez votre URL Vercel" -ForegroundColor Gray
Write-Host "   2. Selectionnez une chaine/match" -ForegroundColor Gray
Write-Host "   3. Cliquez sur 'Navigateur'" -ForegroundColor Gray
Write-Host "   4. Le stream devrait demarrer SANS installer AceStream!" -ForegroundColor Gray
Write-Host ""
Write-Host "Besoin d'aide? Consultez le fichier GUIDE_DEPLOIEMENT_COMPLET.md" -ForegroundColor Yellow
Write-Host ""
