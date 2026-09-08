'use client'

import { useEffect, useRef, useState } from 'react'
import { GRID_SIZE, type Direction, type GameState } from '@/lib/snake'

const LOGICAL_SIZE = 400
const CELL = LOGICAL_SIZE / GRID_SIZE
const GAP = 2.5

interface GameBoardProps {
  state: GameState
  onSwipe: (direction: Direction) => void
  onTap: () => void
}

function readToken(element: HTMLElement, name: string) {
  return getComputedStyle(element).getPropertyValue(name).trim()
}

function roundedCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  inset: number,
  radius: number,
) {
  const size = CELL - inset * 2
  ctx.beginPath()
  ctx.roundRect(x * CELL + inset, y * CELL + inset, size, size, radius)
  ctx.fill()
}

export function GameBoard({ state, onSwipe, onTap }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [themeVersion, setThemeVersion] = useState(0)

  // Repaint when the theme class on <html> changes so the canvas picks up new token values.
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((v) => v + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = LOGICAL_SIZE * dpr
    canvas.height = LOGICAL_SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const board = readToken(canvas, '--board')
    const cell = readToken(canvas, '--board-cell')
    const snake = readToken(canvas, '--snake')
    const snakeHead = readToken(canvas, '--snake-head')
    const food = readToken(canvas, '--food')

    ctx.fillStyle = board
    ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE)

    ctx.fillStyle = cell
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if ((x + y) % 2 === 0) roundedCell(ctx, x, y, GAP, 4)
      }
    }

    ctx.fillStyle = food
    ctx.beginPath()
    ctx.arc(state.food.x * CELL + CELL / 2, state.food.y * CELL + CELL / 2, CELL / 2 - GAP - 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = snake
    for (let i = state.snake.length - 1; i > 0; i--) {
      const segment = state.snake[i]
      const taper = (i / state.snake.length) * 1.5
      roundedCell(ctx, segment.x, segment.y, 1.5 + taper, 5)
    }

    const head = state.snake[0]
    ctx.fillStyle = snakeHead
    roundedCell(ctx, head.x, head.y, 1, 6)

    ctx.fillStyle = board
    const eye = 2.2
    const hx = head.x * CELL
    const hy = head.y * CELL
    const near = 6
    const far = CELL - 6
    const eyes: Record<Direction, [number, number][]> = {
      up: [[near, near], [far, near]],
      down: [[near, far], [far, far]],
      left: [[near, near], [near, far]],
      right: [[far, near], [far, far]],
    }
    for (const [ex, ey] of eyes[state.direction]) {
      ctx.beginPath()
      ctx.arc(hx + ex, hy + ey, eye, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [state, themeVersion])

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    const threshold = 24
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      onTap()
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx > 0 ? 'right' : 'left')
    } else {
      onSwipe(dy > 0 ? 'down' : 'up')
    }
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Snake game board. Score ${state.score}. Snake length ${state.snake.length}.`}
      className="aspect-square w-full touch-none rounded-2xl bg-board"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  )
}
