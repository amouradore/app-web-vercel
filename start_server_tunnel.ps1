# ======================================
# 🚀 SCRIPT DE DÉMARRAGE SERVEUR IPTV
# Avec Cloudflare Tunnel
# ======================================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   🚀 DÉMARRAGE SERVEUR IPTV" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BACKEND_PATH = "$PSScriptRoot\backend"
$TUNNEL_PATH = "C:\cloudflared"
$ACESTREAM_ENGINE = "C:\Program Files\ACEStream\ace_engine.exe"
$PYTHON_ENV = "$BACKEND_PATH\venv"

# ======================================
# 1. VÉRIFIER ACESTREAM ENGINE
# ======================================
Write-Host "📡 Étape 1/4 : Vérification AceStream Engine..." -ForegroundColor Yellow

$aceProcess = Get-Process -Name "ace_engine" -ErrorAction SilentlyContinue

if ($aceProcess) {
    Write-Host "   ✅ AceStream Engine déjà actif (PID: $($aceProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  AceStream Engine non détecté" -ForegroundColor Yellow
    
    if (Test-Path $ACESTREAM_ENGINE) {
        Write-Host "   🔄 Démarrage de AceStream Engine..." -ForegroundColor Yellow
        Start-Process -FilePath $ACESTREAM_ENGINE -WindowStyle Hidden
        Start-Sleep -Seconds 8
        Write-Host "   ✅ AceStream Engine démarré" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ERREUR : AceStream Engine non trouvé à : $ACESTREAM_ENGINE" -ForegroundColor Red
        Write-Host "   ℹ️  Veuillez l'installer depuis : https://www.acestream.org/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Appuyez sur une touche pour fermer..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# Tester la connexion AceStream
Write-Host "   🔍 Test de connexion AceStream (http://127.0.0.1:6878)..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:6878/webui/api/service?method=get_version" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ AceStream Engine répond correctement" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  AceStream Engine ne répond pas encore, attente..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

Write-Host ""

# ======================================
# 2. DÉMARRER BACKEND FASTAPI
# ======================================
Write-Host "🖥️  Étape 2/4 : Démarrage Backend FastAPI..." -ForegroundColor Yellow

# Vérifier si Python est disponible
$pythonCmd = $null
if (Test-Path "$PYTHON_ENV\Scripts\python.exe") {
    $pythonCmd = "$PYTHON_ENV\Scripts\python.exe"
    Write-Host "   ✅ Environnement virtuel Python détecté" -ForegroundColor Green
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
    Write-Host "   ✅ Python système détecté" -ForegroundColor Green
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
    Write-Host "   ✅ Python (py) détecté" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERREUR : Python non trouvé" -ForegroundColor Red
    Write-Host "   ℹ️  Installez Python depuis : https://www.python.org/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Appuyez sur une touche pour fermer..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Démarrer le backend dans une nouvelle fenêtre
Write-Host "   🔄 Lancement du backend sur http://localhost:8000..." -ForegroundColor Yellow

$backendScript = @"
cd '$BACKEND_PATH'
Write-Host '🖥️  Backend FastAPI' -ForegroundColor Green
Write-Host '==================' -ForegroundColor Green
Write-Host ''
& '$pythonCmd' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"@

$backendScriptPath = "$env:TEMP\start_backend.ps1"
Set-Content -Path $backendScriptPath -Value $backendScript

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScriptPath

Start-Sleep -Seconds 3

# Tester si le backend répond
Write-Host "   🔍 Test de connexion Backend..." -ForegroundColor Yellow
$backendReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Backend répond correctement" -ForegroundColor Green
            $backendReady = $true
            break
        }
    } catch {
        Write-Host "   ⏳ Attente du backend... ($i/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "   ⚠️  Backend met du temps à démarrer, mais continuons..." -ForegroundColor Yellow
}

Write-Host ""

# ======================================
# 3. DÉMARRER CLOUDFLARE TUNNEL
# ======================================
Write-Host "🌐 Étape 3/4 : Démarrage Cloudflare Tunnel..." -ForegroundColor Yellow

if (-not (Test-Path "$TUNNEL_PATH\cloudflared.exe")) {
    Write-Host "   ❌ ERREUR : cloudflared.exe non trouvé" -ForegroundColor Red
    Write-Host "   ℹ️  Veuillez l'installer en suivant PLAN_IMPLEMENTATION_TUNNEL.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Appuyez sur une touche pour fermer..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Vérifier si config.yml existe
if (Test-Path "$TUNNEL_PATH\config.yml") {
    Write-Host "   ✅ Configuration tunnel trouvée" -ForegroundColor Green
    Write-Host "   🔄 Démarrage du tunnel..." -ForegroundColor Yellow
    
    $tunnelScript = @"
cd '$TUNNEL_PATH'
Write-Host '🌐 Cloudflare Tunnel' -ForegroundColor Cyan
Write-Host '==================' -ForegroundColor Cyan
Write-Host ''
Write-Host '📝 IMPORTANT : Notez l''URL publique affichée ci-dessous !' -ForegroundColor Yellow
Write-Host ''
.\cloudflared.exe tunnel --config config.yml run
"@
    
    $tunnelScriptPath = "$env:TEMP\start_tunnel.ps1"
    Set-Content -Path $tunnelScriptPath -Value $tunnelScript
    
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $tunnelScriptPath
    
    Start-Sleep -Seconds 5
    Write-Host "   ✅ Cloudflare Tunnel démarré" -ForegroundColor Green
    
} else {
    Write-Host "   ⚠️  Configuration tunnel manquante" -ForegroundColor Yellow
    Write-Host "   🔄 Démarrage en mode quick tunnel (URL temporaire)..." -ForegroundColor Yellow
    
    $quickTunnelScript = @"
cd '$TUNNEL_PATH'
Write-Host '🌐 Cloudflare Quick Tunnel' -ForegroundColor Cyan
Write-Host '===========================' -ForegroundColor Cyan
Write-Host ''
Write-Host '📝 IMPORTANT : Notez l''URL trycloudflare.com affichée ci-dessous !' -ForegroundColor Yellow
Write-Host '⚠️  Cette URL changera à chaque redémarrage' -ForegroundColor Yellow
Write-Host ''
.\cloudflared.exe tunnel --url http://localhost:8000
"@
    
    $quickTunnelScriptPath = "$env:TEMP\start_quick_tunnel.ps1"
    Set-Content -Path $quickTunnelScriptPath -Value $quickTunnelScript
    
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $quickTunnelScriptPath
    
    Start-Sleep -Seconds 5
    Write-Host "   ✅ Quick Tunnel démarré" -ForegroundColor Green
}

Write-Host ""

# ======================================
# 4. RÉSUMÉ ET INSTRUCTIONS
# ======================================
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   ✅ SERVEUR IPTV DÉMARRÉ !" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 SERVICES ACTIFS :" -ForegroundColor Yellow
Write-Host "   📡 AceStream Engine  : http://127.0.0.1:6878" -ForegroundColor White
Write-Host "   🖥️  Backend FastAPI   : http://localhost:8000" -ForegroundColor White
Write-Host "   🌐 Cloudflare Tunnel : Voir fenêtre tunnel pour URL" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLS IMPORTANTES :" -ForegroundColor Yellow
Write-Host "   📊 API Docs (local)  : http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   📊 API Docs (public) : https://[VOTRE-URL-TUNNEL]/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
Write-Host "   1. Notez l'URL publique affichée dans la fenêtre tunnel" -ForegroundColor White
Write-Host "   2. Testez l'API : https://[VOTRE-URL-TUNNEL]/docs" -ForegroundColor White
Write-Host "   3. Configurez Vercel avec cette URL" -ForegroundColor White
Write-Host "   4. Redéployez le frontend sur Vercel" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT :" -ForegroundColor Red
Write-Host "   - Ne fermez pas les fenêtres PowerShell ouvertes" -ForegroundColor White
Write-Host "   - Gardez ce PC allumé pour que le service fonctionne" -ForegroundColor White
Write-Host ""
Write-Host "📖 Pour plus d'infos : PLAN_IMPLEMENTATION_TUNNEL.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
