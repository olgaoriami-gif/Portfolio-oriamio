/**
 * Organic mask shapes used to clip project cards via CSS `mask-image`.
 * SVG source files live in `public/masks/` — edit/replace/add files there
 * (e.g. exported from Figma) and register them in MASKS below.
 */
export type CardSize = 'sm' | 'md' | 'lg'
export type MaskId = 'mask-1' | 'mask-2' | 'mask-3' | 'mask-4' | 'mask-5' | 'mask-6'

/** Must mirror `sizeMap` aspect ratios in ProjectCard.tsx (width / height). */
const SIZE_RATIOS: Record<CardSize, number> = {
  sm: 1 / 1,
  md: 3 / 4,
  lg: 2 / 3,
}

/** How far a mask's ratio can drift from a card size's ratio and still be considered a fit. */
const RATIO_TOLERANCE = 0.12

type MaskDef = {
  url: string
  /** Intrinsic width / height of the source SVG (from its viewBox/width/height). */
  ratio: number
  /** Card sizes this mask is allowed to auto-apply to. Leave empty to require manual assignment. */
  sizes: CardSize[]
}

function sizesMatchingRatio(ratio: number): CardSize[] {
  return (Object.keys(SIZE_RATIOS) as CardSize[]).filter((size) => {
    const diff = Math.abs(SIZE_RATIOS[size] - ratio) / SIZE_RATIOS[size]
    return diff <= RATIO_TOLERANCE
  })
}

export const MASKS: Record<MaskId, MaskDef> = {
  'mask-1': { url: 'url(/masks/mask-1.svg)', ratio: 199 / 300, sizes: sizesMatchingRatio(199 / 300) },
  'mask-2': { url: 'url(/masks/mask-2.svg)', ratio: 1, sizes: sizesMatchingRatio(1) },
  'mask-3': { url: 'url(/masks/mask-3.svg)', ratio: 300 / 200, sizes: sizesMatchingRatio(300 / 200) },
  // Plain rounded rect — safe fallback shape that fits any card proportions.
  'mask-4': { url: 'url(/masks/mask-4.svg)', ratio: 1, sizes: ['sm', 'md', 'lg'] },
  'mask-5': { url: 'url(/masks/mask-5.svg)', ratio: 1, sizes: ['sm', 'md', 'lg'] },
  'mask-6': { url: 'url(/masks/mask-6.svg)', ratio: 1, sizes: ['sm', 'md', 'lg'] },
}

/**
 * Auto-picks a mask that fits `size`, cycling through the eligible ones using
 * `index` so consecutive cards of the same size don't all get the same shape.
 * Returns `undefined` if no mask is registered for that size (card stays unmasked).
 */
export function pickAutoMask(size: CardSize, index: number): MaskId | undefined {
  const candidates = (Object.keys(MASKS) as MaskId[]).filter((id) => MASKS[id].sizes.includes(size))
  if (candidates.length === 0) return undefined
  return candidates[index % candidates.length]
}

/** `mask-image` url for a given mask id, or `undefined` for no mask. */
export function resolveMaskUrl(maskId: MaskId | undefined): string | undefined {
  return maskId ? MASKS[maskId].url : undefined
}


