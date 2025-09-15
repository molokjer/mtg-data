"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, Zap } from "lucide-react"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function TopInversiones() {
  const [topCards, setTopCards] = useState<any[]>([])

  useEffect(() => {
    const cargarTop = async () => {
      try {
        const res = await fetch('/data/precios_historicos.json')
        const data = await res.json()

        const resultados = []

        for (const [clave, registros] of Object.entries(data as Record<string, Array<{ fecha: string; precio: string }>>)) {
          if (registros.length < 2) continue

          const primerPrecio = parseFloat(registros[0].precio)
          const ultimoPrecio = parseFloat(registros[registros.length - 1].precio)
          const cambio = ((ultimoPrecio - primerPrecio) / primerPrecio) * 100

          if (cambio >= 0.5) { // Solo subidas significativas
            resultados.push({
              nombre: clave.split(" - ")[0],
              edicion: clave.split(" - ")[1],
              inicio: primerPrecio,
              fin: ultimoPrecio,
              cambio: parseFloat(cambio.toFixed(2))
            })
          }
        }

        // Ordenar por mayor subida
        const top10 = resultados
          .sort((a, b) => b.cambio - a.cambio)
          .slice(0, 10)

        setTopCards(top10)
      } catch (error) {
        console.error("Error cargando top inversiones:", error)
      }
    }

    cargarTop()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="h-8 w-8 text-green-500" />
        📈 Top Inversiones MTG (Última semana)
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topCards.map((item, idx) => (
          <Card key={idx} className="hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-900 to-black text-white border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl">{item.nombre}</h3>
                  <p className="text-sm text-gray-400">{item.edicion}</p>
                </div>
                <Badge className="bg-green-600 text-white">
                  +{item.cambio}%
                </Badge>
              </div>

              <div className="text-sm space-y-1">
                <p><span className="text-gray-400">Inicio:</span> ${item.inicio.toFixed(2)}</p>
                <p><span className="text-gray-400">Actual:</span> ${item.fin.toFixed(2)}</p>
                <p><span className="text-gray-400">Ganancia:</span> ${(item.fin - item.inicio).toFixed(2)}</p>
              </div>

              {/* Mini gráfico */}
              <div className="h-20 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ x: 0, y: item.inicio }, { x: 1, y: item.fin }]}>
                    <Area type="monotone" dataKey="y" stroke="#00FFCC" fill="rgba(0, 255, 204, 0.2)" />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis hide dataKey="x" />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
