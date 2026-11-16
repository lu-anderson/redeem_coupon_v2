import React from 'react';
import {
  Flame,
  Gift,
  Heart,
  House,
  Infinity as InfinityIcon,
  Leaf,
  ListChecks,
  PartyPopper,
  Smartphone,
  Sparkles,
  Target,
  Ticket,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { ART_BODIES, CATEGORY_ART, TEMPLATE_ART } from '../constants/artData';
import { colors } from '../constants/theme';

const LUCIDE_ART: Record<string, LucideIcon> = {
  flame: Flame,
  gift: Gift,
  heart: Heart,
  house: House,
  infinity: InfinityIcon,
  leaf: Leaf,
  'list-checks': ListChecks,
  'party-popper': PartyPopper,
  smartphone: Smartphone,
  sparkles: Sparkles,
  target: Target,
  ticket: Ticket,
  'users-round': UsersRound,
};

/** Fallback when a template or category is not in the art map. */
export const DEFAULT_ART_KEY = 'luc:ticket';

/**
 * Art key for a coupon, same rule as the app (spec 020): template name first,
 * then the category, then a ticket.
 */
export function artKeyFor(name?: string, category?: string): string {
  if (name && TEMPLATE_ART[name]) return TEMPLATE_ART[name];
  if (category && CATEGORY_ART[category]) return CATEGORY_ART[category];
  return DEFAULT_ART_KEY;
}

interface CouponArtProps {
  artKey: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * One line illustration (24x24, stroke only). `luc:<name>` keys render a
 * Lucide icon; other keys render a body from the bundled design catalog.
 */
const CouponArt: React.FC<CouponArtProps> = ({
  artKey,
  size = 28,
  color = colors.primary,
  strokeWidth = 1.5,
}) => {
  const body = artKey.startsWith('luc:') ? undefined : ART_BODIES[artKey];
  if (!body) {
    const Icon = LUCIDE_ART[artKey.slice(4)] ?? Ticket;
    return <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" data-art={artKey} />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-art={artKey}
      // Static, bundled art from constants/artData.ts (never user input).
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};

export default CouponArt;
