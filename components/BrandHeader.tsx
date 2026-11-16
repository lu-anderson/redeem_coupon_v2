import React from 'react';
import BrandSymbol from './BrandSymbol';

/** Brand row: inline on mobile, a white top bar on desktop (G17 / G17D). */
const BrandHeader: React.FC = () => (
  <header className="flex-none flex items-center px-5 pt-4 lg:h-[72px] lg:pt-0 lg:px-16 lg:bg-white lg:border-b lg:border-line">
    <div className="flex items-center gap-2 text-primary font-extrabold text-xl">
      <BrandSymbol width={26} />
      <span>Affetto</span>
    </div>
  </header>
);

export default BrandHeader;
