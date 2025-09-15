// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  TrendingUp,
  Home,
  Briefcase,
  BarChart3,
  User,
  Moon,
  Sun,
  Zap,
  ArrowUpRight,
  Minus,
  Crown,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"
import { fetchCard, searchCards, MTGCard, analizarConIA } from "@/lib/api"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/Chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

export default function MTGInvestmentApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [featuredCards, setFeaturedCards] = useState<MTGCard[]>([])
  const [allCards, setAllCards] = useState<MTGCard[]>([])
  const [showAll, setShowAll] = useState(false)
  const [selectedCard, setSelectedCard] = useState<MTGCard | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cargarCartas = async () => {
      const nombres = ["Black Lotus", "Lightning Bolt", "Tarmogoyf", "Snapcaster Mage"]
      const cartas = await Promise.all(
        nombres.map(async (name) => {
          const data = await fetchCard(name)
          return data ? { ...data, name } : null
        })
      )
      setFeaturedCards(cartas.filter(Boolean) as MTGCard[])
    }
    cargarCartas()
  }, [])

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) return
    const { cards, hasMore } = await searchCards(searchQuery, page)
    if (page === 1) {
      setAllCards(cards)
    } else {
      setAllCards(prev => [...prev, ...cards])
    }
    setHasMore(hasMore)
    setCurrentPage(page)
    setShowAll(true)
    setActiveTab("home")
  }

  const loadMore = () => {
    handleSearch(currentPage + 1)
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy":
        return "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
      case "sell":
        return "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20"
      case "hold":
        return "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRecommendationText = (rec: string) => {
    return rec === "buy" ? "Comprar" : rec === "sell" ? "Vender" : "Mantener"
  }

  const getRecommendationIcon = (rec: string) => {
    return rec === "buy" ? <ArrowUpRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />
  }

  const runAnalysis = async (card: MTGCard) => {
    setAnalysis("🧠 Analizando con inteligencia artificial...")
    const result = await analizarConIA(card)
    setAnalysis(result)
  }

  const renderContent = () => {
    if (showAll && activeTab === "home") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Resultados para "{searchQuery}"</h2>
          <div className="space-y-4">
            {allCards.map((card) => (
              <Card 
                key={`${card.name}-${card.set}`} 
                className="luxury-card rounded-3xl border-0 hover:shadow-xl cursor-pointer" 
                onClick={() => setSelectedCard(card)}
              >
                <CardContent className="p-6 flex items-center space-x-4">
                  <img src={card.imageUrl} alt={card.name} className="w-16 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">{card.set}</p>
                    <p className="text-lg font-bold text-foreground">${card.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {hasMore && (
            <Button variant="outline" className="w-full" onClick={loadMore}>
              Cargar más...
            </Button>
          )}
        </div>
      )
    }

    if (selectedCard && activeTab === "home") {
      return (
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setSelectedCard(null)}>&larr; Volver</Button>
          <Card className="luxury-card rounded-3xl border-0">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <img src={selectedCard.imageUrl} alt={selectedCard.name} className="w-32 h-48 object-cover rounded-xl shadow-lg" />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-foreground">{selectedCard.name}</h2>
                  <p className="text-lg text-muted-foreground">{selectedCard.setName}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">${selectedCard.priceUsd?.toFixed(2)}</p>
                  <Badge className={getRecommendationColor(selectedCard.recommendation)}>
                    {getRecommendationIcon(selectedCard.recommendation)}
                    <span className="ml-1">{getRecommendationText(selectedCard.recommendation)}</span>
                  </Badge>
                </div>
              </div>

              {/* 🔹 Gráfico */}
              <ChartContainer
                config={{
                  price: { label: "Precio", color: "#00FFCC" },
                }}
                className="h-80 w-full mt-6"
              >
                <AreaChart data={selectedCard.pricesHistory}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(5)}
                    fontSize={12}
                    dy={8}
                    tick={{ fill: "currentColor", opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                    dx={-4}
                    tick={{ fill: "currentColor", opacity: 0.7 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0, 255, 204, 0.1)" }}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    dataKey="price"
                    type="monotone"
                    strokeWidth={3}
                    stroke="var(--color-price)"
                    fill="url(#grad)"
                  >
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-price)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--color-price)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </Area>
                </AreaChart>
              </ChartContainer>

              {/* 🔹 Análisis con IA */}
              <Button
                variant="outline"
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                onClick={() => runAnalysis(selectedCard)}
              >
                🧠 Analizar con IA
              </Button>

              {analysis && (
                <div className="mt-4 p-5 bg-muted rounded-xl border border-border/50">
                  <p className="whitespace-pre-line leading-relaxed text-foreground">
                    {analysis}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-4xl font-bold text-foreground tracking-tight">Buenos días</h1>
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">Descubre oportunidades premium</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-11 w-11 hover:bg-accent/10"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar cartas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(1)}
                className="pl-16 h-16 rounded-3xl bg-card border-0 text-base shadow-sm hover:shadow-md transition-shadow font-medium"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Destacadas</h2>
              </div>
              <div className="space-y-6">
                {featuredCards.map((card) => (
                  <Card
                    key={`${card.name}-${card.set}`}
                    className="luxury-card rounded-3xl border-0 hover:shadow-xl cursor-pointer"
                    onClick={() => setSelectedCard(card)}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-32 rounded-3xl overflow-hidden bg-muted">
                          <img
                            src={card.imageUrl || "/placeholder.svg"}
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-xl">{card.name}</h3>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider">{card.set}</p>
                          <p className="text-3xl font-bold text-foreground mt-2">${card.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "portfolio":
        return <div>Mi seguimiento</div>
      case "market":
        return <div>Análisis de mercado</div>
      case "profile":
        return <div>Perfil</div>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-28">
        <div className="px-8 py-10">{renderContent()}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-2xl border-t border-border/50">
        <div className="flex items-center justify-around py-4 px-8">
          {[
            { id: "home", icon: Home, label: "Inicio" },
            { id: "portfolio", icon: Briefcase, label: "Seguimiento" },
            { id: "market", icon: BarChart3, label: "Mercado" },
            { id: "profile", icon: User, label: "Perfil" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col items-center space-y-2 h-auto py-4 px-6 rounded-3xl ${
                activeTab === tab.id ? "text-accent" : "text-muted-foreground"
              }`}
              onClick={() => {
                setActiveTab(tab.id)
                setShowAll(false)
                setSelectedCard(null)
                setAnalysis(null)
              }}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}