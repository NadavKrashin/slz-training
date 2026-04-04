export const SEALZ_P0_POSES = [
  'encouraging',
  'celebrating',
  'ready',
  'resting',
  'waving',
] as const;

export const SEALZ_P1_POSES = [
  'waiting',
  'shrugging',
  'focused',
  'flexing',
] as const;

export const SEALZ_P2_POSES = [
  'neutral',
  'disappointed',
  'celebrating-proud',
] as const;

export const SEALZ_ALL_POSES = [
  ...SEALZ_P0_POSES,
  ...SEALZ_P1_POSES,
  ...SEALZ_P2_POSES,
] as const;

export type SealzPose = (typeof SEALZ_ALL_POSES)[number];

export type SealzSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const ASPECT_RATIO = 1024 / 1536; // width / height ≈ 0.667

export const SEALZ_SIZE_MAP: Record<SealzSize, { height: number; width: number }> = {
  xs: { height: 48, width: Math.round(48 * ASPECT_RATIO) },
  sm: { height: 84, width: Math.round(84 * ASPECT_RATIO) },
  md: { height: 120, width: Math.round(120 * ASPECT_RATIO) },
  lg: { height: 180, width: Math.round(180 * ASPECT_RATIO) },
  xl: { height: 240, width: Math.round(240 * ASPECT_RATIO) },
};
