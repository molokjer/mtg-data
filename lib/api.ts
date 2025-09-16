// lib/api.ts

import { getCardFromDB } from '@/lib/local-db';

export type MTGCard = {
  name: string;
  setName: string;
  priceUsd: number | null;
  imageUrl: string;
  pricesHistory: { date: string; price: number }[];
  rsi: number;
  recommendation: 'buy' | 'sell' | 'hold';
  change: number;
  volume: string;
  volatility: string;
  aiScore: number;
  isPremium: boolean;
  set: string;
  price: number;
};

/**
 * Carga el historial de precios desde un archivo JSON local
 */
async function cargarHistorial(nombre: string): Promise<{ date: string; price: number }[]> {
  try {
    const res = await fetch('/data/precios_historicos.json');
    if (!res.ok) throw new Error("No se pudo cargar precios_historicos.json");
    
    const data: Record<string, Array<{ fecha: string; precio: string }>> = await res.json();

    // Busca clave que coincida parcialmente (ej: "Black Lotus - lea")
    const clave = Object.keys(data).find(k => 
      k.toLowerCase().includes(nombre.toLowerCase()) ||
      nombre.toLowerCase().includes(k.toLowerCase())
    );
    if (!clave) return [];

    return data[clave]
      .slice(-30)
      .map(registro => ({
        date: registro.fecha.split(' ')[0], // Solo la fecha (sin hora)
        price: parseFloat(registro.precio),
      }))
      .filter(r => !isNaN(r.price));
  } catch (error) {
    console.error('Error cargando precios_historicos.json:', error);
    return [];
  }
}

/**
 * Calcula el RSI (Relative Strength Index)
 */
function calcularRSI(precios: number[]): number {
  if (precios.length < 2) return 50;
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < precios.length; i++) {
    const diff = precios[i] - precios[i - 1];
    if (diff > 0) gains.push(diff);
    else losses.push(Math.abs(diff));
  }

  const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length || 0;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length || 0;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/**
 * Busca una carta: solo en tu base local
 */
export async function fetchCard(name: string): Promise<MTGCard | null> {
  if (!name?.trim()) return null;

  try {
    // 1. Intenta encontrar en tu base local
    let cardData = await getCardFromDB(name);

    if (!cardData) {
      console.warn(`❌ Carta "${name}" no encontrada en tu base local.`);
      return null;
    }

    // 2. Precio definitivo
    const basePrice = cardData.price_usd !== undefined ? Number(cardData.price_usd) : 1;

    // 3. Historial de precios
    const pricesHistory = await cargarHistorial(name);
    if (pricesHistory.length === 0) {
      pricesHistory.push({ 
        date: new Date().toISOString().split('T')[0], 
        price: basePrice 
      });
    }

    const precios = pricesHistory.map(h => h.price);
    const rsi = Math.min(Math.max(calcularRSI(precios), 0), 100);
    const recommendation = rsi < 30 ? 'buy' : rsi > 70 ? 'sell' : 'hold';
    const change = precios.length > 1 
      ? ((precios[precios.length - 1] - precios[0]) / precios[0]) * 100 
      : 0;

    return {
      name: cardData.name,
      setName: cardData.set_name,
      priceUsd: basePrice,
      imageUrl: cardData.image_url?.trim() || '/placeholder.svg',
      pricesHistory,
      rsi: Math.round(rsi),
      recommendation,
      change,
      volume: `${Math.round(Math.random() * 3)}M`,
      volatility: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      aiScore: parseFloat((Math.random() * 3 + 6).toFixed(1)),
      isPremium: cardData.rarity === 'mythic',
      set: cardData.set_name,
      price: basePrice,
    };
  } catch (error: any) {
    console.error('Error fetching card:', error);
    return null;
  }
}

/**
 * Búsqueda simple: filtra cartas destacadas
 */
export async function searchCards(query: string, page = 1): Promise<{ cards: MTGCard[], hasMore: boolean }> {
  if (!query?.trim()) {
    return { cards: [], hasMore: false };
  }

  const featuredNames = [
    "Black Lotus",
    "Ancestral Recall",
    "Mox Sapphire",
    "Mox Ruby",
    "Mox Emerald",
    "Time Walk",
    "Timetwister",
    "Sol Ring",
    "Mana Crypt",
    "Jace, the Mind Sculptor",
    "Force of Will",
    "Brainstorm",
    "Ponder",
    "Counterspell",
    "Lightning Bolt",
    "Thoughtseize",
    "Vendilion Clique",
    "Tarmogoyf",
    "Damnation",
    "Liliana of the Veil",
    "Polluted Delta",
    "Scalding Tarn",
    "Bloodstained Mire"
  ];

  const results = await Promise.all(
    featuredNames
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .map(async (name) => await fetchCard(name))
  );

  const cards = results.filter((card): card is MTGCard => !!card);

  return {
    cards,
    hasMore: false,
  };
}

/**
 * Análisis con IA conectado al endpoint
 */
export async function analizarConIA(card: MTGCard): Promise<string> {
  try {
    const res = await fetch('/api/analizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    const data = await res.json();
    return data.analisis || data.error || 'No se pudo generar el análisis.';
  } catch (error: any) {
    console.error('Error al llamar a /api/analizar:', error);
    return '⚠️ No se pudo conectar con el servicio de IA.';
  }
}