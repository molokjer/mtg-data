import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

export function MarketOverview() {
  const marketStats = [
    {
      title: "Valor Total del Mercado",
      value: "$2.4B",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Cartas Activas",
      value: "25,847",
      change: "+12.1%",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Volumen 24h",
      value: "$1.2M",
      change: "-2.8%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      title: "Índice MTG",
      value: "1,847",
      change: "+3.4%",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-accent" : "text-destructive"}`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change} desde ayer
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
