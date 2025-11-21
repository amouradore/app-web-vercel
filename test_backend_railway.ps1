# Script de Test Backend Railway
param(
    [Parameter(Mandatory=$false)]
    [string]$BackendUrl
)

Write-Host "TEST BACKEND RAILWAY" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

if (-not $BackendUrl) {
    $BackendUrl = Read-Host "Entrez l'URL de votre backend Railway"
}

$BackendUrl = $BackendUrl.TrimEnd('/')

Write-Host "Testing backend: $BackendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/" -Method Get -TimeoutSec 10
    Write-Host "Backend repond!" -ForegroundColor Green
    Write-Host "   Service: $($response.service)" -ForegroundColor Gray
    Write-Host "   Version: $($response.version)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "Backend ne repond pas" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: AceStream Engine
Write-Host "Test 2: AceStream Engine Status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/health/acestream" -Method Get -TimeoutSec 10
    if ($response.status -eq "healthy") {
        Write-Host "AceStream Engine est operationnel!" -ForegroundColor Green
        Write-Host "   Status: $($response.acestream_engine)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    } else {
        Write-Host "AceStream Engine en demarrage..." -ForegroundColor Yellow
        Write-Host "   Status: $($response.acestream_engine)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
        Write-Host "   Attendez 30-60 secondes et reessayez" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Impossible de verifier AceStream Engine" -ForegroundColor Yellow
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Playlists
Write-Host "Test 3: Recuperation des playlists..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/playlists" -Method Get -TimeoutSec 10
    Write-Host "Playlists disponibles: $($response.total)" -ForegroundColor Green
    if ($response.total -gt 0) {
        Write-Host "   Playlists:" -ForegroundColor Gray
        foreach ($playlist in $response.playlists) {
            Write-Host "     - $($playlist.name)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "   Aucune playlist trouvee" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erreur lors de la recuperation des playlists" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Test de conversion AceStream
Write-Host "Test 4: Test de conversion AceStream..." -ForegroundColor Yellow
$testHash = "f5ad210d79c48a97a978a8b0bdfd7ba20436e6b0"
try {
    $body = @{
        hash = $testHash
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BackendUrl/api/play" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
    
    if ($response.status -eq "success" -or $response.status -eq "partial") {
        Write-Host "Conversion AceStream fonctionne!" -ForegroundColor Green
        Write-Host "   Hash: $($response.hash)" -ForegroundColor Gray
        Write-Host "   Stream URL: $($response.stream_url)" -ForegroundColor Gray
        Write-Host "   Type: $($response.type)" -ForegroundColor Gray
        Write-Host "   Backend: $($response.backend)" -ForegroundColor Gray
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    } else {
        Write-Host "Reponse inattendue du backend" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erreur lors du test de conversion" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Resume
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME DES TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BackendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Si tous les tests sont verts:" -ForegroundColor Green
Write-Host "  -> Votre backend Railway est pret!" -ForegroundColor Green
Write-Host "  -> Configurez maintenant Vercel avec cette URL" -ForegroundColor Green
Write-Host ""
Write-Host "Pour deployer sur Vercel:" -ForegroundColor Cyan
Write-Host "  1. https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Import Project > votre repo GitHub" -ForegroundColor Gray
Write-Host "  3. Root Directory: webapp" -ForegroundColor Gray
Write-Host "  4. Variable: REACT_APP_API_URL = $BackendUrl" -ForegroundColor Gray
Write-Host "  5. Deploy!" -ForegroundColor Gray
Write-Host ""
