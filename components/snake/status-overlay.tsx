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
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-lcd/90 p-6 text-center text-lcd-pixel"
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-display text-xl leading-relaxed text-balance sm:text-2xl">
          {isOver ? 'Game Over' : isPaused ? 'Paused' : 'Snake'}
        </h2>
        <p className="font-sans text-sm leading-relaxed">
          {isOver
            ? `You ate ${score} ${score === 1 ? 'piece' : 'pieces'} of food.`
            : isPaused
              ? 'Take a breath. Your snake is waiting.'
              : 'Eat the food. Grow longer. Avoid the walls and your own tail.'}
        </p>
      </div>
      <button
        type="button"
        onClick={isPaused ? onResume : onStart}
        className="font-display bg-lcd-pixel px-6 py-4 text-xs text-lcd shadow-[4px_4px_0_0_var(--lcd-ghost)] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        {isOver ? 'Play again' : isPaused ? 'Resume' : 'Press start'}
      </button>
      <p className="font-sans text-xs leading-relaxed text-lcd-pixel/70">
        Arrow keys or WASD to move. Space to pause.
      </p>
    </div>
  )
}
