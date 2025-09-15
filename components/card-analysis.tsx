import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, BarChart3 } from "lucide-react"

interface CardAnalysisProps {
  selectedCard: string | null
}

export function CardAnalysis({ selectedCard }: CardAnalysisProps) {
  // Mock detailed analysis data
  const cardData = {
    name: "Lightning Bolt",
    set: "Beta",
    price: 850,
    change: -5.2,
    rsi: 25,
    recommendation: "buy",
    volume: 1250,
    marketCap: 2100000,
    volatility: 15.8,
    support: 800,
    resistance: 950,
    prediction6m: 1100,
    metaScore: 85,
    reprintRisk: "low",
    image: "/lightning-bolt-magic-card.png",
  }

  const technicalIndicators = [
    {
      name: "RSI (14)",
      value: cardData.rsi,
      status: cardData.rsi < 30 ? "oversold" : cardData.rsi > 70 ? "overbought" : "neutral",
    },
    { name: "Volatilidad", value: cardData.volatility, status: "moderate" },
    { name: "Volumen", value: cardData.volume, status: "high" },
    { name: "Score Meta", value: cardData.metaScore, status: "excellent" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "oversold":
        return "text-accent"
      case "overbought":
        return "text-destructive"
      case "excellent":
        return "text-accent"
      case "high":
        return "text-accent"
      case "moderate":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "oversold":
        return "bg-accent/10 text-accent"
      case "overbought":
        return "bg-destructive/10 text-destructive"
      case "excellent":
        return "bg-accent/10 text-accent"
      case "high":
        return "bg-accent/10 text-accent"
      case "moderate":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-muted/10 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Image and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {cardData.name}
              <Badge
                className={
                  cardData.recommendation === "buy"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Comprar
              </Badge>
            </CardTitle>
            <CardDescription>{cardData.set}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[3/4] relative">
              <img
                src={cardData.image || "/placeholder.svg"}
                alt={cardData.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Precio Actual</span>
                <span className="text-xl font-bold text-primary">${cardData.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cambio 24h</span>
                <span className={`text-sm font-medium ${cardData.change >= 0 ? "text-accent" : "text-destructive"}`}>
                  {cardData.change > 0 ? "+" : ""}
                  {cardData.change}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Predicción 6M</span>
                <span className="text-sm font-medium text-accent">
                  ${cardData.prediction6m} (+
                  {Math.round(((cardData.prediction6m - cardData.price) / cardData.price) * 100)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Análisis Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalIndicators.map((indicator, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{indicator.name}</span>
                  <Badge className={getStatusBadge(indicator.status)}>
                    {indicator.status === "oversold"
                      ? "Sobrevendido"
                      : indicator.status === "overbought"
                        ? "Sobrecomprado"
                        : indicator.status === "excellent"
                          ? "Excelente"
                          : indicator.status === "high"
                            ? "Alto"
                            : indicator.status === "moderate"
                              ? "Moderado"
                              : "Neutral"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <Progress value={indicator.value} className="flex-1 mr-2" />
                  <span className={`text-sm font-medium ${getStatusColor(indicator.status)}`}>
                    {indicator.value}
                    {indicator.name.includes("RSI") || indicator.name.includes("Score")
                      ? ""
                      : indicator.name.includes("Volatilidad")
                        ? "%"
                        : ""}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Investment Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recomendación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-accent">COMPRA FUERTE</h3>
              <p className="text-xs text-muted-foreground mt-1">RSI indica sobrevendido con potencial alcista</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Soporte</span>
                <span className="text-sm font-medium">${cardData.support}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resistencia</span>
                <span className="text-sm font-medium">${cardData.resistance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Riesgo Reimpresión</span>
                <Badge className="bg-accent/10 text-accent">Bajo</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium mb-2">Razones para Comprar:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• RSI en zona de sobrevendido (25)</li>
                <li>• Alta demanda en formatos Legacy/Vintage</li>
                <li>• Carta icónica con historial sólido</li>
                <li>• Bajo riesgo de reimpresión</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
