'use client'

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play } from 'lucide-react'
import type { Direction, Status } from '@/lib/snake'

interface DpadProps {
  status: Status
  onDirection: (direction: Direction) => void
  onTogglePause: () => void
  onStart: () => void
}

const KEY_CLASS =
  'flex size-14 items-center justify-center rounded-md bg-card text-foreground shadow-[0_3px_0_0_var(--border)] transition-transform active:translate-y-0.5 active:shadow-none'

export function Dpad({ status, onDirection, onTogglePause, onStart }: DpadProps) {
  const press = (direction: Direction) => () => {
    if (status === 'idle' || status === 'over') {
      onStart()
    }
    onDirection(direction)
  }

  const canPause = status === 'running' || status === 'paused'

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <button type="button" aria-label="Move up" className={KEY_CLASS} onPointerDown={press('up')}>
          <ChevronUp className="size-6" />
        </button>
        <div />
        <button type="button" aria-label="Move left" className={KEY_CLASS} onPointerDown={press('left')}>
          <ChevronLeft className="size-6" />
        </button>
        <div className="size-14 rounded-md bg-card/60" aria-hidden="true" />
        <button type="button" aria-label="Move right" className={KEY_CLASS} onPointerDown={press('right')}>
          <ChevronRight className="size-6" />
        </button>
        <div />
        <button type="button" aria-label="Move down" className={KEY_CLASS} onPointerDown={press('down')}>
          <ChevronDown className="size-6" />
        </button>
        <div />
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
          disabled={!canPause}
          onClick={onTogglePause}
          className={`${KEY_CLASS} rounded-full disabled:opacity-40`}
        >
          {status === 'paused' ? <Play className="size-5" /> : <Pause className="size-5" />}
        </button>
        <span className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
          {status === 'paused' ? 'Resume' : 'Pause'}
        </span>
      </div>
    </div>
  )
}
