// lib/scryfall-sync.ts

/**
 * Busca una carta en Scryfall si no está en la DB local
 */
export async function syncNewCard(name: string) {
  try {
    const response = await fetch(
      https://api.scryfall.com/cards/named?fuzzy=
    );

    if (!response.ok) return null;

    const data = await response.json();

    // Extrae solo los datos útiles
    return {
      name: data.name,
      set: data.set,
      set_name: data.set_name,
      price_usd: parseFloat(data.prices?.usd || '0'),
      price_eur: parseFloat(data.prices?.eur_mkm || '0'),
      rarity: data.rarity,
      image_url: data.image_uris?.normal || data.card_faces?.[0]?.image_uris.normal,
      oracle_text: data.oracle_text,
      trend: "new",
      change_7d: "N/A",
      rsi: 50,
    };
  } catch (error) {
    console.error("Error sincronizando con Scryfall:", error);
    return null;
  }
}
