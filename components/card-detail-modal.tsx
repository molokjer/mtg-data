"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, Star, Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface CardDetailModalProps {
  card: {
    id: string
    name: string
    set: string
    price: number
    change: number
    rsi: number
    recommendation: string
    volume: string
    marketCap: string
    volatility: string
    aiScore: number
    image: string
  }
  children: React.ReactNode
}

export function CardDetailModal({ card, children }: CardDetailModalProps) {
  const [timeframe, setTimeframe] = useState("1M")

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy":
        return "bg-primary text-primary-foreground"
      case "sell":
        return "bg-accent text-accent-foreground"
      case "hold":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case "buy":
        return "Comprar"
      case "sell":
        return "Vender"
      case "hold":
        return "Mantener"
      default:
        return "Analizar"
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "buy":
        return <ArrowUpRight className="h-4 w-4" />
      case "sell":
        return <ArrowDownRight className="h-4 w-4" />
      case "hold":
        return <Minus className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  // Mock chart data
  const chartData = [
    { time: "09:00", price: card.price * 0.95 },
    { time: "10:00", price: card.price * 0.97 },
    { time: "11:00", price: card.price * 0.93 },
    { time: "12:00", price: card.price * 0.98 },
    { time: "13:00", price: card.price * 1.02 },
    { time: "14:00", price: card.price },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md mx-auto rounded-3xl border-0 shadow-2xl bg-card">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Image and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-32 rounded-2xl overflow-hidden bg-muted shadow-lg">
              <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{card.set}</p>
              <p className="text-3xl font-bold text-foreground mb-2">${card.price.toLocaleString()}</p>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${card.change >= 0 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}
                >
                  {card.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-bold">
                    {card.change > 0 ? "+" : ""}
                    {card.change}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-secondary fill-current" />
                  <span className="text-sm font-semibold text-foreground">{card.aiScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl border-0 bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Volumen</p>
                <p className="text-lg font-bold text-foreground">{card.volume}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Cap. Mercado</p>
                <p className="text-lg font-bold text-foreground">{card.marketCap}</p>
              </CardContent>
            </Card>
          </div>

          {/* RSI Indicator */}
          <Card className="rounded-2xl border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">RSI</span>
                <span className="text-sm font-bold text-foreground">{card.rsi}</span>
              </div>
              <Progress value={card.rsi} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Sobreventa</span>
                <span>Sobrecompra</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="rounded-2xl border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Análisis IA</span>
              </div>
              <p className="text-sm text-foreground">
                Basado en patrones históricos y volumen actual, esta carta muestra{" "}
                {card.recommendation === "buy"
                  ? "señales alcistas"
                  : card.recommendation === "sell"
                    ? "señales bajistas"
                    : "estabilidad"}{" "}
                con volatilidad {card.volatility.toLowerCase()}.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button className={`flex-1 rounded-2xl font-semibold ${getRecommendationColor(card.recommendation)}`}>
              {getRecommendationIcon(card.recommendation)}
              <span className="ml-2">{getRecommendationText(card.recommendation)}</span>
            </Button>
            <Button variant="outline" className="rounded-2xl px-6 bg-transparent">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
