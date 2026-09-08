'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createInitialState,
  isOpposite,
  stepGame,
  tickInterval,
  type Direction,
  type GameState,
} from '@/lib/snake'

export function useSnakeGame() {
  const [state, setState] = useState<GameState>(() => createInitialState())
  const [highScore, setHighScore] = useState(0)
  const inputQueue = useRef<Direction[]>([])

  const start = useCallback(() => {
    inputQueue.current = []
    setState(createInitialState('running'))
  }, [])

  const togglePause = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'running') return { ...prev, status: 'paused' }
      if (prev.status === 'paused') return { ...prev, status: 'running' }
      return prev
    })
  }, [])

  const queueDirection = useCallback(
    (direction: Direction) => {
      const queue = inputQueue.current
      const last = queue[queue.length - 1] ?? state.direction
      if (last === direction || isOpposite(last, direction)) return
      if (queue.length >= 2) return
      queue.push(direction)
    },
    [state.direction],
  )

  useEffect(() => {
    if (state.status !== 'running') return
    const id = window.setInterval(() => {
      const next = inputQueue.current.shift()
      setState((prev) => stepGame(prev, next))
    }, tickInterval(state.score))
    return () => window.clearInterval(id)
  }, [state.status, state.score])

  useEffect(() => {
    if (state.status === 'over') {
      setHighScore((prev) => Math.max(prev, state.score))
    }
  }, [state.status, state.score])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
        W: 'up',
        S: 'down',
        A: 'left',
        D: 'right',
      }
      const direction = map[event.key]
      if (direction) {
        event.preventDefault()
        if (state.status === 'idle' || state.status === 'over') {
          start()
          inputQueue.current.push(direction)
        } else {
          queueDirection(direction)
        }
        return
      }
      if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        togglePause()
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        if (state.status !== 'running') start()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state.status, start, togglePause, queueDirection])

  return { state, highScore, start, togglePause, queueDirection }
}
