import { notFound } from "next/navigation"
import { MTGCard, fetchCard } from "@/lib/api"
import { Card, Badge, Button } from "@/components/ui"
import { ArrowUpRight, Minus, TrendingUp } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/Chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

// Genera metadatos dinámicos
export async function generateMetadata({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name)
  return {
    title: `${name} | Análisis MTG`,
    description: `Precio, historial y análisis de ${name}`,
  }
}

export default async function CardDetail({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name)
  const card: MTGCard | null = await fetchCard(name)

  if (!card) {
    notFound()
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy": return "bg-green-500 text-white"
      case "sell": return "bg-red-500 text-white"
      default: return "bg-yellow-500 text-white"
    }
  }

  const getRecommendationIcon = (rec: string) => {
    return rec === "buy" ? <ArrowUpRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">{card.name}</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-start space-x-4">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-24 h-32 object-cover rounded-lg shadow-md"
          />
          <div>
            <h2 className="font-bold text-xl">{card.setName}</h2>
            <p className="text-2xl font-bold text-green-600 mt-2">${card.priceUsd?.toFixed(2)}</p>
            <Badge className={getRecommendationColor(card.recommendation)}>
              {getRecommendationIcon(card.recommendation)}
              <span className="ml-1">
                {card.recommendation === 'buy' ? 'Comprar' : card.recommendation === 'sell' ? 'Vender' : 'Mantener'}
              </span>
            </Badge>
          </div>
        </div>

        {/* Gráfico de precios */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Historial de Precios</h3>
          <ChartContainer
            config={{
              price: { label: "Precio", color: "#00FFCC" },
            }}
            className="h-60 w-full"
          >
            <AreaChart data={card.pricesHistory}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value.slice(5)}
                tick={{ fill: "currentColor", opacity: 0.7 }}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "currentColor", opacity: 0.7 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00FFCC"
                strokeWidth={3}
                fill="url(#grad)"
              >
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00FFCC" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00FFCC" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </Area>
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Botón de IA */}
        <Button
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white"
          onClick={async () => {
            const res = await fetch("/api/analizar", {
              method: "POST",
              body: JSON.stringify(card),
              headers: { "Content-Type": "application/json" },
            })
            const data = await res.json()
            alert(data.analisis)
          }}
        >
          🧠 Analizar con IA
        </Button>
      </Card>
    </div>
  )
}