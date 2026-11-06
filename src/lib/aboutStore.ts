import { useSyncExternalStore } from 'react'

type AboutState = {
  open: boolean
  /** true once the intro modal has been dismissed in this tab session */
  seen: boolean
}

const SEEN_KEY = 'about-seen'

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

let state: AboutState = { open: false, seen: readSeen() }

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function setState(patch: Partial<AboutState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

export function openAbout() {
  setState({ open: true })
}

export function closeAbout() {
  if (!state.seen) {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage unavailable — keep in-memory flag */
    }
  }
  setState({ open: false, seen: true })
}

export function useAboutState(): AboutState {
  return useSyncExternalStore(subscribe, () => state)
}
