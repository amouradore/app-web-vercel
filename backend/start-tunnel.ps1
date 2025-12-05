# Script de demarrage complet pour le backend avec Cloudflare Tunnel
# Ce script lance :
# 1. Le backend Python (uvicorn)
# 2. Cloudflare Tunnel (exposition publique)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Demarrage du Backend AceStream HLS  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que AceStream Engine est lance
Write-Host "[1/3] Verification d'AceStream Engine..." -ForegroundColor Yellow
$aceStreamRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:6878/webui/api/service" -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $aceStreamRunning = $true
        Write-Host "  OK AceStream Engine est actif sur le port 6878" -ForegroundColor Green
    }
} catch {
    Write-Host "  ATTENTION AceStream Engine n'est pas detecte" -ForegroundColor Red
    Write-Host "     Veuillez lancer AceStream avant de continuer." -ForegroundColor Red
    Write-Host "     Appuyez sur Entree pour continuer quand meme..." -ForegroundColor Yellow
    Read-Host
}

# Demarrer le backend Python
Write-Host ""
Write-Host "[2/3] Demarrage du backend Python..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; uvicorn app.main:app --reload --port 8000" -WindowStyle Normal

Write-Host "  OK Backend Python lance sur http://localhost:8000" -ForegroundColor Green
Start-Sleep -Seconds 3

# Demarrer Cloudflare Tunnel
Write-Host ""
Write-Host "[3/3] Demarrage de Cloudflare Tunnel..." -ForegroundColor Yellow

if (Test-Path "$PSScriptRoot\cloudflared.exe") {
    Write-Host "  OK cloudflared trouve" -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\cloudflared.exe tunnel --url http://localhost:8000" -WindowStyle Normal
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  OK Tous les services sont lances !   " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Instructions :" -ForegroundColor Cyan
    Write-Host "  1. Copiez l'URL affichee dans la fenetre Cloudflare Tunnel" -ForegroundColor White
    Write-Host "     (Format: https://xxxx.trycloudflare.com)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Creez un fichier webapp/.env avec cette ligne:" -ForegroundColor White
    Write-Host "     REACT_APP_API_URL=https://votre-url-tunnel.trycloudflare.com" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Lancez le frontend : cd webapp && npm start" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "  ERREUR cloudflared.exe introuvable" -ForegroundColor Red
    Write-Host ""
    Write-Host "Telechargement en cours..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "$PSScriptRoot\cloudflared.exe"
    Write-Host "  OK Telechargement termine" -ForegroundColor Green
    Write-Host ""
    Write-Host "Relancez ce script pour demarrer le tunnel." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur Entree pour quitter..." -ForegroundColor Gray
Read-Host
