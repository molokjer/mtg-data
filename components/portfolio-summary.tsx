import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus } from "lucide-react"

export function PortfolioSummary() {
  const portfolioStats = {
    totalValue: 15750,
    totalChange: 8.5,
    totalCards: 47,
    topGainer: "Snapcaster Mage",
    topGainerChange: 15.2,
  }

  const holdings = [
    {
      name: "Black Lotus",
      quantity: 1,
      avgPrice: 42000,
      currentPrice: 45000,
      value: 45000,
      change: 7.1,
      allocation: 65.8,
    },
    {
      name: "Lightning Bolt",
      quantity: 4,
      avgPrice: 900,
      currentPrice: 850,
      value: 3400,
      change: -5.6,
      allocation: 21.6,
    },
    {
      name: "Tarmogoyf",
      quantity: 8,
      avgPrice: 115,
      currentPrice: 120,
      value: 960,
      change: 4.3,
      allocation: 6.1,
    },
    {
      name: "Snapcaster Mage",
      quantity: 12,
      avgPrice: 30,
      currentPrice: 35,
      value: 420,
      change: 16.7,
      allocation: 2.7,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">${portfolioStats.totalValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-accent">
              <TrendingUp className="h-3 w-3 mr-1" />+{portfolioStats.totalChange}% total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cartas</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{portfolioStats.totalCards}</div>
            <div className="text-xs text-muted-foreground">4 posiciones únicas</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mejor Rendimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-card-foreground">{portfolioStats.topGainer}</div>
            <div className="text-xs text-accent">+{portfolioStats.topGainerChange}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Carta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Posiciones</CardTitle>
          <CardDescription>Resumen detallado de tu portafolio de cartas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-card-foreground">{holding.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {holding.quantity} carta{holding.quantity > 1 ? "s" : ""} • Promedio: ${holding.avgPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">${holding.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{holding.allocation}% del portafolio</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-card-foreground">${holding.currentPrice}</p>
                    <div
                      className={`flex items-center text-sm ${holding.change >= 0 ? "text-accent" : "text-destructive"}`}
                    >
                      {holding.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {holding.change > 0 ? "+" : ""}
                      {holding.change}%
                    </div>
                  </div>

                  <Badge
                    className={holding.change >= 0 ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}
                  >
                    {holding.change >= 0 ? "Ganancia" : "Pérdida"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
