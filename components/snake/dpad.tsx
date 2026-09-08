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
  'flex size-12 items-center justify-center rounded-xl bg-card text-foreground shadow-[0_1px_0_0_var(--border)] transition-all hover:bg-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function Dpad({ status, onDirection, onTogglePause, onStart }: DpadProps) {
  const press = (direction: Direction) => () => {
    if (status === 'idle' || status === 'over') {
      onStart()
    }
    onDirection(direction)
  }

  const canPause = status === 'running' || status === 'paused'

  return (
    <div className="flex items-center justify-between">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
        <div />
        <button type="button" aria-label="Move up" className={KEY_CLASS} onPointerDown={press('up')}>
          <ChevronUp className="size-5" />
        </button>
        <div />
        <button type="button" aria-label="Move left" className={KEY_CLASS} onPointerDown={press('left')}>
          <ChevronLeft className="size-5" />
        </button>
        <div />
        <button type="button" aria-label="Move right" className={KEY_CLASS} onPointerDown={press('right')}>
          <ChevronRight className="size-5" />
        </button>
        <div />
        <button type="button" aria-label="Move down" className={KEY_CLASS} onPointerDown={press('down')}>
          <ChevronDown className="size-5" />
        </button>
        <div />
      </div>

      <button
        type="button"
        aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
        disabled={!canPause}
        onClick={onTogglePause}
        className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-[0_1px_0_0_var(--border)] transition-all hover:bg-muted active:scale-95 disabled:opacity-40 disabled:hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {status === 'paused' ? <Play className="size-4" /> : <Pause className="size-4" />}
        {status === 'paused' ? 'Resume' : 'Pause'}
      </button>
    </div>
  )
}
