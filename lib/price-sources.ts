// lib/price-sources.ts

const cache = new Map<string, number>()

/**
 * Obtiene precio desde Scryfall (prioritario)
 */
async function fetchFromScryfall(name: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
    )
    if (!res.ok) return null

    const data = await res.json()

    // Prioriza eur_mkm (CardMarket) → más estable
    if (data.prices?.eur_mkm) return parseFloat(data.prices.eur_mkm) * 1.1
    if (data.prices?.usd) return parseFloat(data.prices.usd)

    return null
  } catch (error) {
    console.error('[Scryfall] Error:', error)
    return null
  }
}

/**
 * Lee precios de respaldo local si falla Scryfall
 */
async function fetchFromLocalFallback(name: string): Promise<number | null> {
  try {
    const res = await fetch('/data/fallback-prices.json')
    const data: Record<string, number> = await res.json()

    // Busca coincidencia parcial
    const clave = Object.keys(data).find(k => 
      k.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(k.toLowerCase())
    )

    return clave ? data[clave] : null
  } catch (error) {
    console.error('[Fallback] Error:', error)
    return null
  }
}

/**
 * Obtiene mejor precio disponible
 */
export async function getBestPrice(name: string): Promise<number> {
  const key = name.toLowerCase().trim()
  const cached = cache.get(key)
  if (cached) return cached

  // Fuente 1: Scryfall
  const price1 = await fetchFromScryfall(name)
  if (typeof price1 === 'number' && !isNaN(price1) && price1 > 0.5) {
    cache.set(key, price1)
    return price1
  }

  // Fuente 2: Fallback local
  const price2 = await fetchFromLocalFallback(name)
  if (typeof price2 === 'number' && !isNaN(price2) && price2 > 0.5) {
    cache.set(key, price2)
    return price2
  }

  // Último fallback
  const fallback = 1
  cache.set(key, fallback)
  return fallback
}