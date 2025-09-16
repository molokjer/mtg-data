// lib/local-db.ts

let dbCache: any = null;

/**
 * Carga la base de datos desde /data/db_full.json (local)
 * 
 * Este método prioriza tu archivo local para:
 * - Evitar bloqueos de red
 * - No depender de GitHub ni CORS
 * - Funcionar sin internet después del primer uso
 */
async function cargarDB() {
  if (dbCache) return dbCache;

  try {
    const res = await fetch('/data/db_full.json');
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} al cargar db_full.json`);
    }

    dbCache = await res.json();
    console.log(`✅ Base de datos cargada: ${dbCache.cards.length} cartas`);
    return dbCache;
  } catch (error) {
    console.error('❌ Error cargando db_full.json:', error);
    // Fallback: base vacía
    dbCache = { cards: [] };
    return dbCache;
  }
}

/**
 * Busca una carta por nombre (búsqueda parcial insensible a mayúsculas)
 * 
 * Ejemplo: "lotus" → encuentra "Black Lotus"
 */
export async function getCardFromDB(name: string): Promise<any> {
  if (!name || typeof name !== 'string') return null;
  
  const db = await cargarDB();

  return db.cards.find((card: any) =>
    card.name.toLowerCase().includes(name.toLowerCase())
  );
}

/**
 * Busca una carta por nombre + edición
 * 
 * Útil si hay varias versiones (ej: "Lightning Bolt" en "lea" vs "ons")
 */
export async function findCardByNameAndSet(name: string, set: string): Promise<any> {
  if (!name || !set || typeof name !== 'string' || typeof set !== 'string') return null;
  
  const db = await cargarDB();

  return db.cards.find((card: any) =>
    card.name.toLowerCase().includes(name.toLowerCase()) &&
    card.set_name?.toLowerCase().includes(set.toLowerCase())
  );
}