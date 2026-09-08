'use client'

import { useSnakeGame } from '@/hooks/use-snake-game'
import { GameBoard } from './game-board'
import { ScorePanel } from './score-panel'
import { StatusOverlay } from './status-overlay'
import { Dpad } from './dpad'
import type { Direction } from '@/lib/snake'

export function SnakeGame() {
  const { state, highScore, start, togglePause, queueDirection } = useSnakeGame()

  const handleSwipe = (direction: Direction) => {
    if (state.status === 'idle' || state.status === 'over') start()
    queueDirection(direction)
  }

  const handleTap = () => {
    if (state.status === 'idle' || state.status === 'over') start()
    else togglePause()
  }

  return (
    <section
      aria-label="Snake handheld"
      className="flex w-full max-w-md flex-col gap-5 rounded-3xl bg-background p-4 shadow-[inset_0_1px_0_0_var(--border)] sm:p-6"
    >
      <header className="flex items-baseline justify-between px-1">
        <h1 className="font-display text-sm text-foreground sm:text-base">SNAKE</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          {state.status === 'running' ? 'Playing' : state.status}
        </p>
      </header>

      <div className="flex flex-col gap-1 rounded-lg bg-lcd-pixel p-2 shadow-[inset_0_4px_12px_0_oklch(0_0_0/0.5)]">
        <ScorePanel score={state.score} highScore={highScore} length={state.snake.length} />
        <div className="relative overflow-hidden rounded-sm">
          <GameBoard state={state} onSwipe={handleSwipe} onTap={handleTap} />
          <StatusOverlay
            status={state.status}
            score={state.score}
            onStart={start}
            onResume={togglePause}
          />
        </div>
      </div>

      <Dpad
        status={state.status}
        onDirection={queueDirection}
        onTogglePause={togglePause}
        onStart={start}
      />
    </section>
  )
}
