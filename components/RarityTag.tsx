import React from 'react';
import { Star } from 'lucide-react';
import { colors } from '../constants/theme';

/** Number of stars in a rarity string such as "⭐⭐⭐" (max 5). */
export function rarityStars(rarity?: string): number {
  if (!rarity) return 0;
  const count = Array.from(rarity).filter((ch) => ch === '⭐' || ch === '★').length;
  return Math.min(5, count);
}

/** Rarity as a lilac tag of filled stars (spec 020 D5). Renders nothing without stars. */
const RarityTag: React.FC<{ rarity?: string; className?: string }> = ({ rarity, className = '' }) => {
  const count = rarityStars(rarity);
  if (count === 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-px h-[22px] px-[7px] rounded-full bg-lilac ${className}`}
      role="img"
      aria-label={`Raridade: ${count} ${count === 1 ? "estrela" : "estrelas"}`}
      data-testid="rarity-tag"
    >
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={11} color={colors.primary} fill={colors.primary} strokeWidth={1.5} />
      ))}
    </span>
  );
};

export default RarityTag;
