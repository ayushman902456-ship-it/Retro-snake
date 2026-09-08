'use client'

import { useSnakeGame } from '@/hooks/use-snake-game'
import { GameBoard } from './game-board'
import { ScorePanel } from './score-panel'
import { StatusOverlay } from './status-overlay'
import { Dpad } from './dpad'
import { ThemeToggle } from './theme-toggle'
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
    <section aria-label="Snake game" className="flex w-full max-w-sm flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-medium tracking-tight text-foreground">Snake</h1>
          <p className="text-xs text-muted-foreground">
            {state.status === 'running'
              ? 'Playing'
              : state.status === 'idle'
                ? 'Ready'
                : state.status === 'over'
                  ? 'Game over'
                  : 'Paused'}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <ScorePanel score={state.score} highScore={highScore} length={state.snake.length} />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-board shadow-[0_12px_40px_-16px_oklch(0.3_0.03_250/0.25)]">
        <GameBoard state={state} onSwipe={handleSwipe} onTap={handleTap} />
        <StatusOverlay status={state.status} score={state.score} onStart={start} onResume={togglePause} />
      </div>

      <Dpad status={state.status} onDirection={queueDirection} onTogglePause={togglePause} onStart={start} />
    </section>
  )
}
