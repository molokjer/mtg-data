// lib/cardmarket.ts

const cache = new Map<string, number>();

/**
 * Usa eur_mkm de Scryfall como proxy del precio real de CardMarket
 */
export async function fetchCardPriceFromMkm(name: string): Promise<number | null> {
  const key = name.toLowerCase().trim();
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    // URL limpia sin espacios extra
    const response = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
    );
    
    if (!response.ok) return null;

    const data = await response.json();
    
    // Usamos eur_mkm como mejor aproximación al precio de CardMarket
    const priceEur = data.prices?.eur_mkm ? parseFloat(data.prices.eur_mkm) : null;
    
    // Convertimos a USD (ajusta factor si prefieres otro)
    const priceUsd = priceEur ? priceEur * 1.1 : null;

    if (priceUsd) {
      cache.set(key, priceUsd);
    }

    return priceUsd;
  } catch (error) {
    console.error('Error fetching from Scryfall MKM:', error);
    return null;
  }
}

// Para limpiar la caché si es necesario
export function clearPriceCache() {
  cache.clear();
}