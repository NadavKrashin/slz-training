/**
 * Injectable clock module for development-time controls.
 *
 * In production: `now()` and `currentDate()` are direct pass-throughs to Date.now() / new Date().
 * In development: Supports time scaling (speed up timers) and clock offset (simulate different times).
 *
 * Usage in dev toolbar:
 *   import { setTimeScale, setClockOffset, resetClock } from '@/lib/clock';
 *   setTimeScale(60);           // 60x speed — 600s workout completes in 10s
 *   setClockOffset(hoursInMs);  // Shift clock forward/backward
 *   resetClock();               // Back to normal
 */

let _timeScale = 1;
let _offsetMs = 0;
let _anchorRealMs = 0;
let _anchorScaledMs = 0;

/**
 * Returns the current timestamp in milliseconds, adjusted for dev time controls.
 * Replaces Date.now() throughout the codebase.
 */
export function now(): number {
  if (process.env.NODE_ENV !== 'development') {
    return Date.now();
  }
  if (_timeScale === 1 && _offsetMs === 0) {
    return Date.now();
  }
  const realElapsed = Date.now() - _anchorRealMs;
  return _anchorScaledMs + realElapsed * _timeScale + _offsetMs;
}

/**
 * Returns a Date object for "now", adjusted for dev time controls.
 * Replaces new Date() throughout the codebase.
 */
export function currentDate(): Date {
  return new Date(now());
}

// --- Dev-only controls (tree-shaken in production) ---

export function setTimeScale(scale: number) {
  if (process.env.NODE_ENV !== 'development') return;
  // Anchor current position before changing scale
  const currentScaled = now();
  _anchorRealMs = Date.now();
  _anchorScaledMs = currentScaled - _offsetMs;
  _timeScale = scale;
}

export function setClockOffset(offsetMs: number) {
  if (process.env.NODE_ENV !== 'development') return;
  _offsetMs = offsetMs;
}

export function resetClock() {
  if (process.env.NODE_ENV !== 'development') return;
  _timeScale = 1;
  _offsetMs = 0;
  _anchorRealMs = 0;
  _anchorScaledMs = 0;
}

export function getTimeScale(): number {
  return _timeScale;
}

export function getClockOffset(): number {
  return _offsetMs;
}
