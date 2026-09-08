'use client'

import { useEffect, useRef } from 'react'
import { GRID_SIZE, type Direction, type GameState } from '@/lib/snake'

const LOGICAL_SIZE = 400
const CELL = LOGICAL_SIZE / GRID_SIZE
const GAP = 2

interface GameBoardProps {
  state: GameState
  onSwipe: (direction: Direction) => void
  onTap: () => void
}

function readToken(element: HTMLElement, name: string) {
  return getComputedStyle(element).getPropertyValue(name).trim()
}

export function GameBoard({ state, onSwipe, onTap }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = LOGICAL_SIZE * dpr
    canvas.height = LOGICAL_SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const lcd = readToken(canvas, '--lcd')
    const pixel = readToken(canvas, '--lcd-pixel')
    const ghost = readToken(canvas, '--lcd-ghost')
    const food = readToken(canvas, '--food')

    ctx.fillStyle = lcd
    ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE)

    ctx.fillStyle = ghost
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        ctx.fillRect(x * CELL + GAP, y * CELL + GAP, CELL - GAP * 2, CELL - GAP * 2)
      }
    }

    const drawCell = (x: number, y: number, inset = GAP) => {
      ctx.fillRect(x * CELL + inset, y * CELL + inset, CELL - inset * 2, CELL - inset * 2)
    }

    ctx.fillStyle = food
    drawCell(state.food.x, state.food.y, GAP + 2)

    ctx.fillStyle = pixel
    state.snake.forEach((segment, index) => {
      drawCell(segment.x, segment.y, index === 0 ? GAP - 1 : GAP)
    })

    const head = state.snake[0]
    ctx.fillStyle = lcd
    const eye = 3
    const hx = head.x * CELL
    const hy = head.y * CELL
    const eyes: Record<Direction, [number, number][]> = {
      up: [[5, 5], [CELL - 5 - eye, 5]],
      down: [[5, CELL - 5 - eye], [CELL - 5 - eye, CELL - 5 - eye]],
      left: [[5, 5], [5, CELL - 5 - eye]],
      right: [[CELL - 5 - eye, 5], [CELL - 5 - eye, CELL - 5 - eye]],
    }
    for (const [ex, ey] of eyes[state.direction]) {
      ctx.fillRect(hx + ex, hy + ey, eye, eye)
    }
  }, [state])

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
      className="aspect-square w-full touch-none rounded-sm bg-lcd [image-rendering:pixelated]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  )
}
