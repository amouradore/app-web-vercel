# 🧪 Script de Test Backend Railway
# Teste si votre backend Railway fonctionne correctement

param(
    [Parameter(Mandatory=$false)]
    [string]$BackendUrl
)

Write-Host "🧪 TEST BACKEND RAILWAY" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Demander l'URL si non fournie
if (-not $BackendUrl) {
    $BackendUrl = Read-Host "Entrez l'URL de votre backend Railway (ex: https://votre-projet.up.railway.app)"
}

# Enlever le slash final si présent
$BackendUrl = $BackendUrl.TrimEnd('/')

Write-Host "Testing backend: $BackendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend répond!" -ForegroundColor Green
    Write-Host "   Service: $($response.service)" -ForegroundColor Gray
    Write-Host "   Version: $($response.version)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend ne répond pas" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez:" -ForegroundColor Yellow
    Write-Host "  1. Que Railway a bien déployé (vérifier les logs)" -ForegroundColor Gray
    Write-Host "  2. Que l'URL est correcte" -ForegroundColor Gray
    Write-Host "  3. Que le domaine est généré dans Railway" -ForegroundColor Gray
    exit 1
}
Write-Host ""

# Test 2: AceStream Engine
Write-Host "Test 2: AceStream Engine Status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/health/acestream" -Method Get -TimeoutSec 10
    if ($response.status -eq "healthy") {
        Write-Host "✅ AceStream Engine est opérationnel!" -ForegroundColor Green
        Write-Host "   Status: $($response.acestream_engine)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  AceStream Engine en démarrage..." -ForegroundColor Yellow
        Write-Host "   Status: $($response.acestream_engine)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Attendez 30-60 secondes et réessayez" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier AceStream Engine" -ForegroundColor Yellow
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Playlists
Write-Host "Test 3: Récupération des playlists..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/playlists" -Method Get -TimeoutSec 10
    Write-Host "✅ Playlists disponibles: $($response.total)" -ForegroundColor Green
    if ($response.total -gt 0) {
        Write-Host "   Playlists:" -ForegroundColor Gray
        foreach ($playlist in $response.playlists) {
            Write-Host "     - $($playlist.name)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "⚠️  Aucune playlist trouvée" -ForegroundColor Yellow
        Write-Host "   Assurez-vous que les fichiers .m3u sont dans backend/" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération des playlists" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Test de conversion AceStream
Write-Host "Test 4: Test de conversion AceStream..." -ForegroundColor Yellow
$testHash = "f5ad210d79c48a97a978a8b0bdfd7ba20436e6b0"  # Hash de test connu
try {
    $body = @{
        hash = $testHash
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BackendUrl/api/play" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
    
    if ($response.status -eq "success" -or $response.status -eq "partial") {
        Write-Host "✅ Conversion AceStream fonctionne!" -ForegroundColor Green
        Write-Host "   Hash: $($response.hash)" -ForegroundColor Gray
        Write-Host "   Stream URL: $($response.stream_url)" -ForegroundColor Gray
        Write-Host "   Type: $($response.type)" -ForegroundColor Gray
        Write-Host "   Backend: $($response.backend)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Réponse inattendue du backend" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors du test de conversion" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Résumé
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BackendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Si tous les tests sont ✅ verts:" -ForegroundColor Green
Write-Host "  → Votre backend Railway est prêt!" -ForegroundColor Green
Write-Host "  → Configurez maintenant Vercel avec cette URL" -ForegroundColor Green
Write-Host ""
Write-Host "Si certains tests sont ⚠️  ou ❌:" -ForegroundColor Yellow
Write-Host "  → Vérifiez les logs Railway" -ForegroundColor Yellow
Write-Host "  → Attendez que AceStream Engine démarre complètement" -ForegroundColor Yellow
Write-Host "  → Relancez ce script dans 1-2 minutes" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour tester à nouveau:" -ForegroundColor Cyan
Write-Host "  .\test_backend_railway.ps1 -BackendUrl `"$BackendUrl`"" -ForegroundColor Gray
Write-Host ""
