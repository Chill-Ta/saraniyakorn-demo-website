import type { ImgHTMLAttributes } from 'react';

import logoUrl from '../../assets/logo/artsgoz-tech-squad.svg';

export type ArtsgozTechSquadLogoProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src'
>;

export function ArtsgozTechSquadLogo({
  alt = 'Artsgoz Tech Squad',
  ...props
}: ArtsgozTechSquadLogoProps) {
  return <img src={logoUrl} alt={alt} {...props} />;
}
