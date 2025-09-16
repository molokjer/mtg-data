// app/api/analizar/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { generarAnalisisIA } from '@/lib/openai'

export async function POST(req: NextRequest) {
  console.log('🔍 /api/analizar recibió una solicitud')
  console.log('🔑 OPENAI_API_KEY presente:', !!process.env.OPENAI_API_KEY)

  try {
    const card = await req.json()
    console.log('📦 Carta recibida:', card.name, card.price)

    if (!card || !card.name || typeof card.price !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const analisis = await generarAnalisisIA(card)
    console.log('💡 Análisis generado:', analisis.substring(0, 100) + '...')

    return NextResponse.json({ analisis })
  } catch (error: any) {
    console.error('❌ Error en /api/analizar:', error)
    return NextResponse.json(
      { error: 'No se pudo conectar con IA.' },
      { status: 500 }
    )
  }
}