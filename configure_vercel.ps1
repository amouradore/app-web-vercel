# ======================================
# ⚙️ CONFIGURATION VERCEL
# ======================================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   ⚙️ CONFIGURATION VERCEL" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Demander l'URL du tunnel
Write-Host "📝 Entrez l'URL de votre tunnel Cloudflare" -ForegroundColor Yellow
Write-Host "   Exemple : https://iptv-app-xyz.trycloudflare.com" -ForegroundColor Cyan
Write-Host ""
$tunnelUrl = Read-Host "   URL du tunnel"

if ([string]::IsNullOrWhiteSpace($tunnelUrl)) {
    Write-Host ""
    Write-Host "❌ URL invalide" -ForegroundColor Red
    Write-Host ""
    Write-Host "Appuyez sur une touche pour fermer..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Nettoyer l'URL (enlever le / à la fin si présent)
$tunnelUrl = $tunnelUrl.TrimEnd('/')

Write-Host ""
Write-Host "✅ URL configurée : $tunnelUrl" -ForegroundColor Green
Write-Host ""

# ======================================
# 1. CRÉER .env.production
# ======================================
Write-Host "📝 Étape 1/3 : Création de .env.production..." -ForegroundColor Yellow

$envContent = @"
# Configuration pour production (Vercel)
REACT_APP_API_URL=$tunnelUrl

# Ne pas modifier les lignes ci-dessous
REACT_APP_ENABLE_HLS=true
REACT_APP_ENABLE_PROXY=true
"@

$envPath = "webapp\.env.production"
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "   ✅ Fichier créé : $envPath" -ForegroundColor Green
Write-Host ""

# ======================================
# 2. CRÉER .env.local (pour test local)
# ======================================
Write-Host "📝 Étape 2/3 : Création de .env.local (pour tests locaux)..." -ForegroundColor Yellow

$envLocalContent = @"
# Configuration pour développement local
REACT_APP_API_URL=$tunnelUrl

# Ne pas modifier les lignes ci-dessous
REACT_APP_ENABLE_HLS=true
REACT_APP_ENABLE_PROXY=true
"@

$envLocalPath = "webapp\.env.local"
Set-Content -Path $envLocalPath -Value $envLocalContent -Encoding UTF8

Write-Host "   ✅ Fichier créé : $envLocalPath" -ForegroundColor Green
Write-Host ""

# ======================================
# 3. AFFICHER INSTRUCTIONS VERCEL
# ======================================
Write-Host "📝 Étape 3/3 : Instructions de déploiement..." -ForegroundColor Yellow
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   📦 DÉPLOYER SUR VERCEL" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Option 1 : Via CLI (Recommandé)" -ForegroundColor Yellow
Write-Host "---------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Installer Vercel CLI (si pas déjà fait) :" -ForegroundColor White
Write-Host "   npm install -g vercel" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Se connecter à Vercel :" -ForegroundColor White
Write-Host "   vercel login" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Déployer le frontend :" -ForegroundColor White
Write-Host "   cd webapp" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Lors du déploiement, Vercel utilisera automatiquement .env.production" -ForegroundColor Yellow
Write-Host ""

Write-Host "Option 2 : Via Interface Web" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur : https://vercel.com" -ForegroundColor White
Write-Host "2. Connectez-vous avec GitHub" -ForegroundColor White
Write-Host "3. Importez votre repository" -ForegroundColor White
Write-Host "4. Dans les paramètres du projet :" -ForegroundColor White
Write-Host "   • Root Directory : webapp" -ForegroundColor Cyan
Write-Host "   • Build Command : npm run build" -ForegroundColor Cyan
Write-Host "   • Output Directory : build" -ForegroundColor Cyan
Write-Host "5. Dans Environment Variables, ajoutez :" -ForegroundColor White
Write-Host "   • REACT_APP_API_URL = $tunnelUrl" -ForegroundColor Cyan
Write-Host "6. Déployez !" -ForegroundColor White
Write-Host ""

Write-Host "Option 3 : Tester en local d'abord" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Installer les dépendances :" -ForegroundColor White
Write-Host "   cd webapp" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Démarrer le serveur de développement :" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Ouvrir : http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   ✅ CONFIGURATION TERMINÉE !" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 FICHIERS CRÉÉS :" -ForegroundColor Yellow
Write-Host "   • webapp\.env.production (pour Vercel)" -ForegroundColor Cyan
Write-Host "   • webapp\.env.local (pour tests locaux)" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔗 URL DU BACKEND : $tunnelUrl" -ForegroundColor Yellow
Write-Host ""

Write-Host "📖 Pour plus d'infos : PLAN_IMPLEMENTATION_TUNNEL.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
