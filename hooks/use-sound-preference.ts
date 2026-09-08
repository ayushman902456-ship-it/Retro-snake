'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { setMuted } from '@/lib/audio'

const STORAGE_KEY = 'snake:sound-enabled'
const listeners = new Set<() => void>()

function readPreference() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) !== 'false'
}

function writePreference(enabled: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(enabled))
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useSoundPreference() {
  const enabled = useSyncExternalStore(subscribe, readPreference, () => true)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  useEffect(() => {
    setMuted(!enabled)
  }, [enabled])

  const toggle = useCallback(() => {
    writePreference(!readPreference())
  }, [])

  return { enabled, mounted, toggle }
}
