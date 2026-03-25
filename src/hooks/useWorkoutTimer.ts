'use client';

import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { WorkoutStage, WorkoutFlowStatus } from '@/lib/types';
import { WORKOUT_DURATION_SECONDS } from '@/lib/constants';
import { now } from '@/lib/clock';

interface TimerState {
  status: WorkoutFlowStatus;
  currentStageIndex: number;
  stageRemaining: number;
  totalRemaining: number;
}

type TimerAction =
  | { type: 'START' }
  | { type: 'TICK'; stageRemaining: number; totalRemaining: number; nextStage: boolean }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE' };

function createInitialState(stages: WorkoutStage[]): TimerState {
  return {
    status: 'idle',
    currentStageIndex: 0,
    stageRemaining: stages.length > 0 ? stages[0].durationSeconds : 0,
    totalRemaining: WORKOUT_DURATION_SECONDS,
  };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'running' };
    case 'TICK':
      return {
        ...state,
        stageRemaining: action.stageRemaining,
        totalRemaining: action.totalRemaining,
        currentStageIndex: action.nextStage ? state.currentStageIndex + 1 : state.currentStageIndex,
      };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'RESUME':
      return { ...state, status: 'running' };
    case 'COMPLETE':
      return { ...state, status: 'completed', totalRemaining: 0, stageRemaining: 0 };
    default:
      return state;
  }
}

export function useWorkoutTimer(stages: WorkoutStage[], onComplete: () => void) {
  const [state, dispatch] = useReducer(timerReducer, stages, createInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const totalElapsedOnPauseRef = useRef(0);
  const stageStartRef = useRef(0);
  const stageElapsedOnPauseRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const stagesRef = useRef(stages);
  stagesRef.current = stages;
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTicking = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      const t = now();
      const s = stateRef.current;
      const allStages = stagesRef.current;
      const totalElapsed = totalElapsedOnPauseRef.current + (t - startTimeRef.current) / 1000;
      const stageElapsed = stageElapsedOnPauseRef.current + (t - stageStartRef.current) / 1000;
      const totalRemaining = Math.max(0, WORKOUT_DURATION_SECONDS - totalElapsed);

      if (totalRemaining <= 0) {
        clearTimer();
        dispatch({ type: 'COMPLETE' });
        onCompleteRef.current();
        return;
      }

      const currentStage = allStages[s.currentStageIndex];
      if (!currentStage) {
        clearTimer();
        dispatch({ type: 'COMPLETE' });
        onCompleteRef.current();
        return;
      }

      const stageRemaining = Math.max(0, currentStage.durationSeconds - stageElapsed);

      if (stageRemaining <= 0) {
        const nextIndex = s.currentStageIndex + 1;
        if (nextIndex >= allStages.length) {
          clearTimer();
          dispatch({ type: 'COMPLETE' });
          onCompleteRef.current();
          return;
        }
        stageStartRef.current = t;
        stageElapsedOnPauseRef.current = 0;
        dispatch({
          type: 'TICK',
          stageRemaining: allStages[nextIndex].durationSeconds,
          totalRemaining: Math.ceil(totalRemaining),
          nextStage: true,
        });
      } else {
        dispatch({
          type: 'TICK',
          stageRemaining: Math.ceil(stageRemaining),
          totalRemaining: Math.ceil(totalRemaining),
          nextStage: false,
        });
      }
    }, 200);
  }, [clearTimer]);

  const start = useCallback(() => {
    const t = now();
    startTimeRef.current = t;
    stageStartRef.current = t;
    totalElapsedOnPauseRef.current = 0;
    stageElapsedOnPauseRef.current = 0;
    dispatch({ type: 'START' });
    startTicking();
  }, [startTicking]);

  const pause = useCallback(() => {
    const t = now();
    totalElapsedOnPauseRef.current += (t - startTimeRef.current) / 1000;
    stageElapsedOnPauseRef.current += (t - stageStartRef.current) / 1000;
    clearTimer();
    dispatch({ type: 'PAUSE' });
  }, [clearTimer]);

  const resume = useCallback(() => {
    const t = now();
    startTimeRef.current = t;
    stageStartRef.current = t;
    dispatch({ type: 'RESUME' });
    startTicking();
  }, [startTicking]);

  const forceComplete = useCallback(() => {
    clearTimer();
    dispatch({ type: 'COMPLETE' });
    onCompleteRef.current();
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const currentStage = stages[state.currentStageIndex] || null;
  const progress = stages.length > 0 ? (state.currentStageIndex / stages.length) * 100 : 0;

  return { ...state, currentStage, progress, start, pause, resume, forceComplete };
}
