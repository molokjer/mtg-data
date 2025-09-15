"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Ene", blackLotus: 42000, lightning: 900, tarmogoyf: 115 },
  { month: "Feb", blackLotus: 43500, lightning: 875, tarmogoyf: 118 },
  { month: "Mar", blackLotus: 44200, lightning: 820, tarmogoyf: 122 },
  { month: "Abr", blackLotus: 45800, lightning: 795, tarmogoyf: 119 },
  { month: "May", blackLotus: 46200, lightning: 810, tarmogoyf: 125 },
  { month: "Jun", blackLotus: 45000, lightning: 850, tarmogoyf: 120 },
]

export function PriceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Line type="monotone" dataKey="blackLotus" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Black Lotus" />
          <Line
            type="monotone"
            dataKey="lightning"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="Lightning Bolt"
          />
          <Line type="monotone" dataKey="tarmogoyf" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Tarmogoyf" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
