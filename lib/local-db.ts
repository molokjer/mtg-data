// lib/local-db.ts

let dbCache: any = null;

/**
 * Carga la base de datos desde /data/db.json (con caché)
 */
async function cargarDB() {
  if (dbCache) return dbCache;

  try {
    const res = await fetch('/data/db.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    dbCache = await res.json();
    return dbCache;
  } catch (error) {
    console.error('Error cargando db.json:', error);
    // Retornar estructura vacía segura
    dbCache = { cards: [] };
    return dbCache;
  }
}

/**
 * Busca una carta por nombre en la base de datos local
 */
export async function getCardFromDB(name: string) {
  try {
    const db = await cargarDB();

    return db.cards.find((card: any) =>
      card.name.toLowerCase().includes(name.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando carta por nombre:', error);
    return null;
  }
}

/**
 * Busca una carta por nombre + edición
 */
export async function findCardByNameAndSet(name: string, set: string) {
  try {
    const db = await cargarDB();

    return db.cards.find((card: any) =>
      card.name.toLowerCase().includes(name.toLowerCase()) &&
      card.set_name?.toLowerCase().includes(set.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando carta por nombre y edición:', error);
    return null;
  }
}

/**
 * Busca cartas relacionadas (para autocompletado o búsqueda global)
 */
export async function searchAllCards(query: string) {
  try {
    const db = await cargarDB();
    
    // Filtra localmente primero
    let results = db.cards.filter((card: any) =>
      card.name.toLowerCase().includes(query.toLowerCase())
    );

    // Si hay pocos resultados, complementa con Scryfall
    if (results.length < 5) {
      const scryfallRes = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=prints`
      );
      const scryfallData = await scryfallRes.json();

      if (scryfallData.data && scryfallData.data.length > 0) {
        const scryfallResults = scryfallData.data.slice(0, 10).map((card: any) => ({
          name: card.name,
          set: card.set,
          set_name: card.set_name,
          price_usd: card.prices?.usd ? parseFloat(card.prices.usd) : 0,
          image_url: card.image_uris?.normal || card.card_faces?.[0]?.image_uris.normal,
          rarity: card.rarity,
          oracle_text: card.oracle_text,
        })).filter((c: any) => c.price_usd > 0);

        // Combina y elimina duplicados por nombre
        const seen = new Set<string>();
        results = [...results, ...scryfallResults]
          .filter(item => {
            const duplicate = seen.has(item.name);
            seen.add(item.name);
            return !duplicate;
          })
          .slice(0, 20);
      }
    }

    return results;
  } catch (error) {
    console.error('Error en searchAllCards:', error);
    return [];
  }
}