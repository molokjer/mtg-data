// lib/openai.ts

import OpenAI from 'openai'

// Verifica que la API Key esté disponible
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY no encontrada. Análisis desactivado.')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ← Leído desde .env.local (nunca en código)
})

/**
 * Crea el prompt para el análisis de IA
 */
function crearPrompt(card: any): string {
  const name = card.name || 'Carta desconocida'
  const set = card.set || 'Edición no disponible'
  const price = typeof card.price === 'number' ? card.price : 0
  const rsi = typeof card.rsi === 'number' ? Math.round(card.rsi) : 50
  const change = typeof card.change === 'number' ? card.change : 0
  const volatility = card.volatility || 'Media'
  const volume = card.volume || '1M'
  const isMythic = card.isPremium === true

  const soporte = (price * 0.9).toFixed(2)
  const resistencia = (price * 1.15).toFixed(2)
  const proyeccion30d = ((Math.abs(change) * 1.8) + (Math.random() * 2)).toFixed(1)

  return `
Actúa como un analista financiero senior especializado en activos coleccionables.
Analiza "${name}" (${set}) y responde en exactamente 5 líneas con emojis.

Datos clave:
- Precio actual: $${price.toFixed(2)}
- RSI técnico: ${rsi}
- Tendencia: ${change > 0 ? 'alcista' : change < 0 ? 'bajista' : 'lateral'}
- Soporte: $${soporte}
- Resistencia: $${resistencia}

Formato de salida:
🟢 Análisis Técnico: [RSI + tendencia]
📘 Evaluación Fundamental: [rareza + demanda]
🎯 Recomendación Estratégica: [acción clara]
📈 Proyección 30 días: ±${proyeccion30d}%
⚠️ Factores Clave: [volatilidad + eventos]

Sé conciso. Máximo 5 líneas.`
}

/**
 * Genera análisis con IA o usa fallback si falla
 */
export async function generarAnalisisIA(card: any): Promise<string> {
  // Fallback si no hay API Key
  if (!process.env.OPENAI_API_KEY) {
    const rsi = typeof card.rsi === 'number' ? Math.round(card.rsi) : 50
    const recomendacion = rsi < 30 ? 'COMPRAR' : rsi > 70 ? 'VENDER' : 'MANTENER'
    const emoji = rsi < 30 ? '🟢' : rsi > 70 ? '🔴' : '🟡'

    return `${emoji} Análisis Técnico: RSI en ${rsi}, precio estable.
📘 Evaluación Fundamental: "${card.name}" (${card.set || 'N/A'}) es una carta icónica.
🎯 Recomendación Estratégica: ${recomendacion}.
📈 Proyección 30 días: ±${(Math.random() * 10 + 5).toFixed(1)}%
⚠️ Factores Clave: Alta volatilidad, eventos MTG influyen.`
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: crearPrompt(card) }],
      max_tokens: 250,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) throw new Error('Respuesta vacía')

    // Asegura solo 5 líneas
    return content.split('\n').slice(0, 5).join('\n')
  } catch (error: any) {
    console.error('❌ Error al conectar con OpenAI:', error.message)
    return `⚠️ No se pudo conectar con IA (${error.message}). Revisa tu conexión o configura correctamente OPENAI_API_KEY.`
  }
}