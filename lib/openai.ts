// lib/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generarAnalisisIA(card: any): Promise<string> {
  // Validación segura de datos
  const name = card.name || 'Carta desconocida'
  const set = card.set || 'Edición no disponible'
  const price = typeof card.price === 'number' ? card.price : 0
  const change = typeof card.change === 'number' ? card.change : 0
  const rsi = typeof card.rsi === 'number' ? Math.round(card.rsi) : 50
  const trend = card.trend || 'lateral'
  const volatility = card.volatility || 'Media'
  const volume = card.volume || '1M'
  const isMythic = card.isPremium === true

  // Cálculos profesionales
  const soporte = (price * 0.9).toFixed(2)
  const resistencia = (price * 1.15).toFixed(2)
  const proyeccion30d = ((change * 1.8) + (Math.random() * 2)).toFixed(1)

  const prompt = `
Actúa como un analista financiero senior especializado en activos coleccionables.
Analiza "${name}" (${set}) y responde en exactamente 5 líneas con emojis.

Datos clave:
- Precio actual: $${price.toFixed(2)}
- RSI técnico: ${rsi}
- Tendencia: ${trend}
- Soporte: $${soporte}
- Resistencia: $${resistencia}

Formato de salida:
🟢 Análisis Técnico: [RSI + tendencia]
📘 Evaluación Fundamental: [rareza + demanda]
🎯 Recomendación Estratégica: [acción clara]
📈 Proyección 30 días: ±${proyeccion30d}%
⚠️ Factores Clave: [volatilidad + eventos]

Sé conciso. Máximo 5 líneas.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
      temperature: 0.7,
    })

    if (!response.choices?.[0]?.message?.content) {
      return fallBackAnalysis(name, set, price, rsi, soporte, resistencia)
    }

    const content = response.choices[0].message.content.trim()
    
    // Asegurar solo 5 líneas
    const lines = content.split('\n').slice(0, 5)
    return lines.join('\n')
  } catch (error: any) {
    console.error('Error con OpenAI:', error)
    return fallBackAnalysis(name, set, price, rsi, soporte, resistencia)
  }
}

function fallBackAnalysis(
  name: string,
  set: string,
  price: number,
  rsi: number,
  soporte: string,
  resistencia: string
): string {
  const recomendacion = rsi < 30 ? 'COMPRAR' : rsi > 70 ? 'VENDER' : 'MANTENER'
  const emoji = rsi < 30 ? '🟢' : rsi > 70 ? '🔴' : '🟡'

  return `${emoji} Análisis Técnico: RSI en ${rsi}, precio estable.
📘 Evaluación Fundamental: "${name}" (${set}) es una carta icónica.
🎯 Recomendación Estratégica: ${recomendacion}.
📈 Proyección 30 días: ±${(Math.random() * 10 + 5).toFixed(1)}%
⚠️ Factores Clave: Alta volatilidad, eventos MTG influyen.`
}