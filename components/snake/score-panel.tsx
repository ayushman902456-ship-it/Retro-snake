interface ScorePanelProps {
  score: number
  highScore: number
  length: number
}

function pad(value: number) {
  return value.toString().padStart(3, '0')
}

export function ScorePanel({ score, highScore, length }: ScorePanelProps) {
  return (
    <dl className="flex items-end justify-between gap-4 bg-lcd px-4 py-3 text-lcd-pixel">
      <div className="flex flex-col gap-1">
        <dt className="font-sans text-[11px] uppercase tracking-widest text-lcd-pixel/70">Score</dt>
        <dd className="font-display text-xl leading-none tabular-nums sm:text-2xl">{pad(score)}</dd>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <dt className="font-sans text-[11px] uppercase tracking-widest text-lcd-pixel/70">Length</dt>
        <dd className="font-display text-sm leading-none tabular-nums">{pad(length)}</dd>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <dt className="font-sans text-[11px] uppercase tracking-widest text-lcd-pixel/70">Best</dt>
        <dd className="font-display text-sm leading-none tabular-nums">{pad(highScore)}</dd>
      </div>
    </dl>
  )
}
