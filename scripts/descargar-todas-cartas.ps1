# scripts/descargar-todas-cartas.ps1

$OutputEncoding = [System.Text.Encoding]::UTF8

# Paso 1: Descargar el archivo comprimido (JSON.gz) - URL limpia
$url = "https://archive.scryfall.com/json/scryfall-all-cards.json.gz"
$outputZip = "$PSScriptRoot\scryfall-all-cards.json.gz"
$outputJson = "$PSScriptRoot\scryfall-all-cards.json"

Write-Host "📥 Descargando base de datos completa de Scryfall..."
try {
    # Usa un User-Agent válido para evitar bloqueos
    $headers = @{ "User-Agent" = "MTGApp/1.0" }
    Invoke-WebRequest -Uri $url -OutFile $outputZip -Headers $headers -TimeoutSec 30
} catch {
    Write-Error "❌ Error al descargar: $_"
    exit 1
}

Write-Host "📦 Descomprimiendo..."
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $inputStream = New-Object System.IO.FileStream($outputZip, [System.IO.FileMode]::Open)
    $gzipStream = New-Object System.IO.Compression.GZipStream($inputStream, [System.IO.Compression.CompressionMode]::Decompress)
    $outputStream = New-Object System.IO.FileStream($outputJson, [System.IO.FileMode]::Create)
    $gzipStream.CopyTo($outputStream)
    $gzipStream.Close()
    $inputStream.Close()
    $outputStream.Close()
    Remove-Item $outputZip
} catch {
    Write-Error "❌ Error al descomprimir: $_"
    exit 1
}

Write-Host "🔍 Procesando cartas y extrayendo solo las valiosas..."
$cartas = Get-Content $outputJson | ConvertFrom-Json

# Filtrar: solo cartas con precio > $5 y no promos masivas
$cartasFiltradas = @()
foreach ($card in $cartas) {
    if ($null -ne $card.prices.usd -and [double]$card.prices.usd -gt 5 -and $card.set_type -ne "promo") {
        # Asigna price_eur si existe
        $precioEur = $null
        if ($null -ne $card.prices.eur_mkm -and $card.prices.eur_mkm -ne "") {
            $precioEur = [double]$card.prices.eur_mkm
        }

        $cartasFiltradas += @{
            name        = $card.name
            set         = $card.set
            set_name    = $card.set_name
            price_usd   = [double]$card.prices.usd
            price_eur   = $precioEur
            rarity      = $card.rarity
            image_url   = $card.image_uris.normal
            oracle_text = $card.oracle_text
            legal       = $card.legalities.standard
        }
    }
}

# Guardar en data/db_full.json
$dbPath = "..\data\db_full.json"
$finalDb = @{
    last_updated = (Get-Date).ToString("yyyy-MM-dd HH:mm")
    total_cards  = $cartasFiltradas.Count
    cards        = $cartasFiltradas
} | ConvertTo-Json -Depth 5 -Compress

Set-Content -Path $dbPath -Value $finalDb -Encoding UTF8

Write-Host "✅ Base de datos lista: $dbPath"
Write-Host "📌 $($cartasFiltradas.Count) cartas con precio > \$5 guardadas."
