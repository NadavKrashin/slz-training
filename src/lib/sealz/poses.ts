import type { SealzPose } from './types';
import { SEALZ_ALL_POSES } from './types';

const FALLBACK_POSE: SealzPose = 'encouraging';

export function getPoseAssetPath(pose: SealzPose): string {
  return `/assets/sealz/${pose}.webp`;
}

export function isValidPose(pose: string): pose is SealzPose {
  return (SEALZ_ALL_POSES as readonly string[]).includes(pose);
}

export function safePose(pose: string): SealzPose {
  return isValidPose(pose) ? pose : FALLBACK_POSE;
}

export const PRELOAD_POSES: SealzPose[] = ['encouraging', 'celebrating'];
