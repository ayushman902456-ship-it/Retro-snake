import type { Status } from '@/lib/snake'

interface StatusOverlayProps {
  status: Status
  score: number
  onStart: () => void
  onResume: () => void
}

export function StatusOverlay({ status, score, onStart, onResume }: StatusOverlayProps) {
  if (status === 'running') return null

  const isPaused = status === 'paused'
  const isOver = status === 'over'

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-board/80 p-6 text-center backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-medium tracking-tight text-balance text-foreground">
          {isOver ? 'Game over' : isPaused ? 'Paused' : 'Snake'}
        </h2>
        <p className="max-w-60 text-sm leading-relaxed text-pretty text-muted-foreground">
          {isOver
            ? `You ate ${score} ${score === 1 ? 'piece' : 'pieces'} of food.`
            : isPaused
              ? 'Take a breath. Your snake is waiting.'
              : 'Eat the food, grow longer, and avoid the walls and your tail.'}
        </p>
      </div>
      <button
        type="button"
        onClick={isPaused ? onResume : onStart}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {isOver ? 'Play again' : isPaused ? 'Resume' : 'Start'}
      </button>
      <p className="text-xs text-muted-foreground">Arrow keys or WASD to move. Space to pause.</p>
    </div>
  )
}
