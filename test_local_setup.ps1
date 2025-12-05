# Test de configuration locale
# Verifie que tous les composants sont installes

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   TEST DE CONFIGURATION LOCALE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allOK = $true

# Test 1: AceStream Engine
Write-Host "Test 1/4 : AceStream Engine..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:6878/webui/api/service?method=get_version" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   OK - AceStream Engine fonctionne (Port 6878)" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json
        if ($content.result.version) {
            Write-Host "   Version : $($content.result.version)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   ERREUR - AceStream Engine ne repond pas" -ForegroundColor Red
    Write-Host "   Action: Demarrez AceStream Engine depuis le menu Demarrer" -ForegroundColor Yellow
    $allOK = $false
}
Write-Host ""

# Test 2: FFmpeg
Write-Host "Test 2/4 : FFmpeg..." -ForegroundColor Yellow

try {
    $ffmpegVersion = & ffmpeg -version 2>&1 | Select-Object -First 1
    if ($ffmpegVersion -match "ffmpeg version") {
        Write-Host "   OK - FFmpeg installe et accessible" -ForegroundColor Green
        Write-Host "   $ffmpegVersion" -ForegroundColor Cyan
    } else {
        throw "FFmpeg not found"
    }
} catch {
    Write-Host "   ERREUR - FFmpeg non trouve dans le PATH" -ForegroundColor Red
    Write-Host "   Action: Installez FFmpeg depuis https://ffmpeg.org/download.html" -ForegroundColor Yellow
    $allOK = $false
}
Write-Host ""

# Test 3: Python
Write-Host "Test 3/4 : Python..." -ForegroundColor Yellow

$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

if ($pythonCmd) {
    $pythonVersion = & $pythonCmd --version 2>&1
    Write-Host "   OK - Python installe : $pythonVersion" -ForegroundColor Green
    
    # Verifier les dependances
    Write-Host "   Verification des dependances Python..." -ForegroundColor Yellow
    try {
        $pipList = & $pythonCmd -m pip list 2>&1
        
        $requiredPackages = @("fastapi", "uvicorn", "httpx")
        $missingPackages = @()
        
        foreach ($package in $requiredPackages) {
            if ($pipList -notmatch $package) {
                $missingPackages += $package
            }
        }
        
        if ($missingPackages.Count -eq 0) {
            Write-Host "   OK - Toutes les dependances sont installees" -ForegroundColor Green
        } else {
            Write-Host "   ATTENTION - Dependances manquantes : $($missingPackages -join ', ')" -ForegroundColor Yellow
            Write-Host "   Action: cd backend ; pip install -r requirements.txt" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ATTENTION - Impossible de verifier les dependances" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERREUR - Python non trouve" -ForegroundColor Red
    Write-Host "   Action: Installez Python depuis https://www.python.org/" -ForegroundColor Yellow
    $allOK = $false
}
Write-Host ""

# Test 4: Playlists M3U
Write-Host "Test 4/4 : Playlists M3U..." -ForegroundColor Yellow

$m3uFiles = Get-ChildItem -Path "backend" -Filter "*.m3u" -ErrorAction SilentlyContinue
if ($m3uFiles.Count -gt 0) {
    Write-Host "   OK - $($m3uFiles.Count) fichiers M3U trouves :" -ForegroundColor Green
    foreach ($file in $m3uFiles) {
        $sizeKB = [math]::Round($file.Length / 1KB, 1)
        Write-Host "      * $($file.Name) ($sizeKB KB)" -ForegroundColor Cyan
    }
} else {
    Write-Host "   ATTENTION - Aucun fichier M3U trouve dans backend/" -ForegroundColor Yellow
    Write-Host "   Info: Assurez-vous d'avoir des playlists dans backend/" -ForegroundColor Cyan
}
Write-Host ""

# Resume
Write-Host "======================================" -ForegroundColor Cyan
if ($allOK) {
    Write-Host "   CONFIGURATION OK !" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pret a demarrer !" -ForegroundColor Green
    Write-Host ""
    Write-Host "PROCHAINES ETAPES :" -ForegroundColor Yellow
    Write-Host "   1. Installez Cloudflare Tunnel (EN ADMINISTRATEUR) :" -ForegroundColor White
    Write-Host "      .\install_cloudflared.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   2. Demarrez le serveur :" -ForegroundColor White
    Write-Host "      .\start_server_tunnel.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "   PROBLEMES DETECTES" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ACTIONS REQUISES :" -ForegroundColor Yellow
    Write-Host "   Resolvez les erreurs ci-dessus avant de continuer" -ForegroundColor White
    Write-Host ""
}

Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
