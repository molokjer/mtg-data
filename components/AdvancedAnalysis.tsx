import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'
import { analizarConIA } from '@/lib/api'

export function AdvancedAnalysis({ card }: { card: any }) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runAnalysis = async () => {
    setLoading(true)
    const result = await analizarConIA(card)
    setAnalysis(result)
    setLoading(false)
  }

  return (
    <Card className="luxury-card rounded-3xl border-0 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-accent" />
          <span>Análisis Avanzado con IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Button onClick={runAnalysis} disabled={loading} className="bg-accent text-accent-foreground">
            {loading ? 'Analizando...' : '?? Analizar con IA'}
          </Button>
        ) : (
          <p className="text-foreground leading-relaxed whitespace-pre-line">{analysis}</p>
        )}
      </CardContent>
    </Card>
  )
}
