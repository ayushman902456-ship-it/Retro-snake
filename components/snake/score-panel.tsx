interface ScorePanelProps {
  score: number
  highScore: number
  length: number
}

export function ScorePanel({ score, highScore, length }: ScorePanelProps) {
  return (
    <dl className="grid grid-cols-3 gap-3">
      <div className="flex flex-col gap-1 rounded-2xl bg-card px-4 py-3 shadow-[0_1px_0_0_var(--border)]">
        <dt className="text-xs text-muted-foreground">Score</dt>
        <dd className="text-2xl font-medium tabular-nums leading-none tracking-tight text-foreground">{score}</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-card px-4 py-3 shadow-[0_1px_0_0_var(--border)]">
        <dt className="text-xs text-muted-foreground">Length</dt>
        <dd className="text-2xl font-medium tabular-nums leading-none tracking-tight text-foreground">{length}</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-card px-4 py-3 shadow-[0_1px_0_0_var(--border)]">
        <dt className="text-xs text-muted-foreground">Best</dt>
        <dd className="text-2xl font-medium tabular-nums leading-none tracking-tight text-foreground">{highScore}</dd>
      </div>
    </dl>
  )
}
