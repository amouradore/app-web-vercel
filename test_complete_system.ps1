# ======================================
# 🧪 TEST COMPLET DU SYSTÈME
# Teste tous les composants après installation
# ======================================

param(
    [string]$TunnelUrl = ""
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   🧪 TEST COMPLET DU SYSTÈME" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allTests = @()
$passedTests = 0
$totalTests = 0

function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedContent = "",
        [int]$Timeout = 5
    )
    
    $global:totalTests++
    
    Write-Host "🔍 Test $global:totalTests : $Name" -ForegroundColor Yellow
    Write-Host "   URL : $Url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $Timeout -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            if ($ExpectedContent -eq "" -or $response.Content -match $ExpectedContent) {
                Write-Host "   ✅ PASS - Service répond correctement" -ForegroundColor Green
                $global:passedTests++
                $global:allTests += @{Name=$Name; Status="PASS"; Message="OK"}
                return $true
            } else {
                Write-Host "   ⚠️ PASS (mais contenu inattendu)" -ForegroundColor Yellow
                $global:passedTests++
                $global:allTests += @{Name=$Name; Status="PASS"; Message="Contenu inattendu"}
                return $true
            }
        } else {
            Write-Host "   ❌ FAIL - HTTP $($response.StatusCode)" -ForegroundColor Red
            $global:allTests += @{Name=$Name; Status="FAIL"; Message="HTTP $($response.StatusCode)"}
            return $false
        }
    } catch {
        Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
        $global:allTests += @{Name=$Name; Status="FAIL"; Message=$_.Exception.Message}
        return $false
    }
    
    Write-Host ""
}

# ======================================
# TESTS LOCAUX
# ======================================
Write-Host "📋 PHASE 1 : TESTS LOCAUX" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Test 1 : AceStream Engine
Test-Service -Name "AceStream Engine" -Url "http://127.0.0.1:6878/webui/api/service?method=get_version" -ExpectedContent "version"
Start-Sleep -Seconds 1

# Test 2 : Backend Health
Test-Service -Name "Backend Health" -Url "http://localhost:8000/health" -ExpectedContent "healthy"
Start-Sleep -Seconds 1

# Test 3 : Backend Root
Test-Service -Name "Backend Root" -Url "http://localhost:8000/" -ExpectedContent "AceStream"
Start-Sleep -Seconds 1

# Test 4 : API Playlists
Test-Service -Name "API Playlists" -Url "http://localhost:8000/api/playlists" -ExpectedContent "playlists"
Start-Sleep -Seconds 1

# Test 5 : AceStream Health Check
Test-Service -Name "AceStream Health API" -Url "http://localhost:8000/api/health/acestream"
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# ======================================
# TESTS VIA TUNNEL (si URL fournie)
# ======================================
if ($TunnelUrl -ne "") {
    Write-Host "📋 PHASE 2 : TESTS VIA TUNNEL PUBLIC" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    
    # Nettoyer l'URL
    $TunnelUrl = $TunnelUrl.TrimEnd('/')
    
    # Test 6 : Backend via Tunnel
    Test-Service -Name "Backend via Tunnel" -Url "$TunnelUrl/health" -ExpectedContent "healthy" -Timeout 10
    Start-Sleep -Seconds 1
    
    # Test 7 : API Docs via Tunnel
    Test-Service -Name "API Docs via Tunnel" -Url "$TunnelUrl/docs" -Timeout 10
    Start-Sleep -Seconds 1
    
    # Test 8 : Playlists via Tunnel
    Test-Service -Name "Playlists via Tunnel" -Url "$TunnelUrl/api/playlists" -ExpectedContent "playlists" -Timeout 10
    Start-Sleep -Seconds 1
    
    # Test 9 : AceStream Health via Tunnel
    Test-Service -Name "AceStream via Tunnel" -Url "$TunnelUrl/api/health/acestream" -Timeout 10
    Start-Sleep -Seconds 1
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⏭️ PHASE 2 : IGNORÉE (pas d'URL tunnel fournie)" -ForegroundColor Yellow
    Write-Host "   Pour tester le tunnel, relancez avec :" -ForegroundColor Cyan
    Write-Host "   .\test_complete_system.ps1 -TunnelUrl 'https://votre-tunnel.trycloudflare.com'" -ForegroundColor Cyan
    Write-Host ""
}

# ======================================
# RÉSUMÉ FINAL
# ======================================
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   📊 RÉSUMÉ DES TESTS" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }

Write-Host "Total : $totalTests tests" -ForegroundColor White
Write-Host "Réussis : $passedTests" -ForegroundColor Green
Write-Host "Échoués : $($totalTests - $passedTests)" -ForegroundColor Red
Write-Host "Taux de réussite : $successRate%" -ForegroundColor $(if ($successRate -eq 100) { "Green" } elseif ($successRate -ge 80) { "Yellow" } else { "Red" })
Write-Host ""

# Afficher détails des tests échoués
$failedTests = $allTests | Where-Object { $_.Status -eq "FAIL" }
if ($failedTests.Count -gt 0) {
    Write-Host "❌ Tests échoués :" -ForegroundColor Red
    foreach ($test in $failedTests) {
        Write-Host "   • $($test.Name) : $($test.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# ======================================
# RECOMMANDATIONS
# ======================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($passedTests -eq $totalTests) {
    Write-Host "✅ TOUS LES TESTS PASSENT !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Votre système est opérationnel !" -ForegroundColor Green
    Write-Host ""
    
    if ($TunnelUrl -ne "") {
        Write-Host "📝 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
        Write-Host "   1. Configurer Vercel avec cette URL :" -ForegroundColor White
        Write-Host "      $TunnelUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   2. Lancer configure_vercel.ps1 :" -ForegroundColor White
        Write-Host "      .\configure_vercel.ps1" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   3. Déployer sur Vercel :" -ForegroundColor White
        Write-Host "      cd webapp" -ForegroundColor Cyan
        Write-Host "      vercel --prod" -ForegroundColor Cyan
    } else {
        Write-Host "📝 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
        Write-Host "   1. Démarrer le tunnel Cloudflare :" -ForegroundColor White
        Write-Host "      .\start_server_tunnel.ps1" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   2. Noter l'URL du tunnel" -ForegroundColor White
        Write-Host ""
        Write-Host "   3. Relancer ce test avec l'URL :" -ForegroundColor White
        Write-Host "      .\test_complete_system.ps1 -TunnelUrl 'https://xxx.trycloudflare.com'" -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️ CERTAINS TESTS ONT ÉCHOUÉ" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 ACTIONS RECOMMANDÉES :" -ForegroundColor Yellow
    Write-Host ""
    
    # Recommandations spécifiques
    $aceStreamFailed = $allTests | Where-Object { $_.Name -like "*AceStream*" -and $_.Status -eq "FAIL" }
    if ($aceStreamFailed) {
        Write-Host "   📡 AceStream Engine :" -ForegroundColor Red
        Write-Host "      ➜ Démarrer manuellement :" -ForegroundColor White
        Write-Host "        Start-Process 'C:\Program Files\ACEStream\ace_engine.exe'" -ForegroundColor Cyan
        Write-Host ""
    }
    
    $backendFailed = $allTests | Where-Object { $_.Name -like "*Backend*" -and $_.Status -eq "FAIL" }
    if ($backendFailed) {
        Write-Host "   🖥️ Backend FastAPI :" -ForegroundColor Red
        Write-Host "      ➜ Vérifier les dépendances :" -ForegroundColor White
        Write-Host "        cd backend" -ForegroundColor Cyan
        Write-Host "        pip install -r requirements.txt" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "      ➜ Démarrer manuellement :" -ForegroundColor White
        Write-Host "        python -m uvicorn app.main:app --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
        Write-Host ""
    }
    
    $tunnelFailed = $allTests | Where-Object { $_.Name -like "*Tunnel*" -and $_.Status -eq "FAIL" }
    if ($tunnelFailed) {
        Write-Host "   🌐 Cloudflare Tunnel :" -ForegroundColor Red
        Write-Host "      ➜ Vérifier que le tunnel est démarré" -ForegroundColor White
        Write-Host "      ➜ Vérifier l'URL fournie" -ForegroundColor White
        Write-Host "      ➜ Attendre quelques secondes et retester" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host ""
Write-Host "📖 Pour plus d'aide : GUIDE_DEMARRAGE_RAPIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
