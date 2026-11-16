import React from 'react';
import { colors } from '../constants/theme';

const COUPON_D =
  'M17,18 H83 A9,9 0 0 1 92,27 V41 A9,9 0 0 0 92,59 V73 A9,9 0 0 1 83,82 H17 A9,9 0 0 1 8,73 V59 A9,9 0 0 0 8,41 V27 A9,9 0 0 1 17,18 Z';

function heartPath(cx: number, cy: number, s: number): string {
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return (
    `M${cx},${f(cy + s * 0.9)} ` +
    `C${f(cx - s * 1.3)},${f(cy + s * 0.05)} ${f(cx - s * 1.05)},${f(cy - s * 0.95)} ${f(cx - s * 0.45)},${f(cy - s * 0.9)} ` +
    `C${f(cx - s * 0.15)},${f(cy - s * 0.88)} ${cx},${f(cy - s * 0.6)} ${cx},${f(cy - s * 0.45)} ` +
    `C${cx},${f(cy - s * 0.6)} ${f(cx + s * 0.15)},${f(cy - s * 0.88)} ${f(cx + s * 0.45)},${f(cy - s * 0.9)} ` +
    `C${f(cx + s * 1.05)},${f(cy - s * 0.95)} ${f(cx + s * 1.3)},${f(cy + s * 0.05)} ${cx},${f(cy + s * 0.9)} Z`
  );
}

const HEART_D = heartPath(39, 51, 15);
const DOTS = [26, 32, 38, 44, 50, 56, 62, 68, 74];

interface BrandSymbolProps {
  /** Width in px; height keeps the 84:64 ratio. */
  width?: number;
  couponColor?: string;
  cutColor?: string;
}

/** Affetto symbol: coupon with a heart cut-out and a perforation line (same as the app). */
const BrandSymbol: React.FC<BrandSymbolProps> = ({
  width = 28,
  couponColor = colors.primary,
  cutColor = colors.background,
}) => (
  <svg width={width} height={Math.round((width * 64) / 84)} viewBox="8 18 84 64" aria-hidden="true">
    <path d={COUPON_D} fill={couponColor} />
    <path d={HEART_D} fill={cutColor} />
    {DOTS.map((y) => (
      <circle key={y} cx={71} cy={y} r={1.7} fill={cutColor} />
    ))}
  </svg>
);

export default BrandSymbol;
