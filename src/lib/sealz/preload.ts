import { PRELOAD_POSES } from './poses';
import { getPoseAssetPath } from './poses';

let preloaded = false;

export function preloadCriticalPoses(): void {
  if (preloaded || typeof window === 'undefined') return;
  preloaded = true;

  for (const pose of PRELOAD_POSES) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getPoseAssetPath(pose);
    document.head.appendChild(link);
  }
}
