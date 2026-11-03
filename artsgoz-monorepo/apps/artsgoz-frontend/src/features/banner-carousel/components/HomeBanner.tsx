import { BannerCarousel } from './BannerCarousel.js';
import type { BannerItem } from '../types.js';

const MOCK_BANNERS: BannerItem[] = [
  {
    id: 'banner-01',
    desktopImageUrl: '',
    mobileImageUrl: '',
    altText: 'MockImage 01',
    linkUrl: '#',
  },
  {
    id: 'banner-02',
    desktopImageUrl: '',
    mobileImageUrl: '',
    altText: 'MockImage 02',
    linkUrl: '#',
  },
  {
    id: 'banner-03',
    desktopImageUrl: '',
    mobileImageUrl: '',
    altText: 'MockImage 03',
    linkUrl: '#',
  },
];

export function HomeBanner() {
  return (
    <section className="w-full h-full">
      <BannerCarousel banners={MOCK_BANNERS} autoPlayInterval={6000} />
    </section>
  );
}
