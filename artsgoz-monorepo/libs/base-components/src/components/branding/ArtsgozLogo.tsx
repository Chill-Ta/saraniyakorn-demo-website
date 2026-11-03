import type { CSSProperties, HTMLAttributes } from 'react';

import artsgozLogoUrl from '../../assets/logo/artsgoz-logo.svg';

export { artsgozLogoUrl };

export type ArtsgozLogoProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'color'
> & {
  alt?: string;
  color?: CSSProperties['color'];
  width?: CSSProperties['width'];
};

export function ArtsgozLogo({
  alt = 'Artsgoz',
  color = 'currentColor',
  width = '467px',
  style,
  ...props
}: ArtsgozLogoProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      {...props}
      style={{
        display: 'inline-block',
        width,
        maxWidth: '100%',
        aspectRatio: '467 / 100',
        backgroundColor: color,
        WebkitMaskImage: `url(${artsgozLogoUrl})`,
        maskImage: `url(${artsgozLogoUrl})`,
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
    />
  );
}
