'use client'

import { useEffect, useRef } from 'react'
import { sounds, startAmbient, stopAmbient } from '@/lib/audio'
import type { GameState } from '@/lib/snake'

export function useGameSounds(state: GameState, enabled: boolean) {
  const previousStatus = useRef(state.status)
  const previousDirection = useRef(state.direction)

  useEffect(() => {
    const prev = previousStatus.current
    previousStatus.current = state.status
    if (prev === state.status) return
    if (state.status === 'running' && (prev === 'idle' || prev === 'over')) sounds.start()
    if (state.status === 'paused') sounds.pause()
    if (state.status === 'over') sounds.gameOver()
  }, [state.status])

  useEffect(() => {
    if (state.justAte) sounds.eat()
  }, [state.justAte, state.score])

  useEffect(() => {
    if (state.direction !== previousDirection.current && state.status === 'running') {
      sounds.turn()
    }
    previousDirection.current = state.direction
  }, [state.direction, state.status])

  useEffect(() => {
    if (enabled && state.status === 'running') {
      startAmbient()
      return stopAmbient
    }
    stopAmbient()
  }, [enabled, state.status])
}
