export interface BannerItem {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
  linkUrl?: string;
}

export interface BannerCarouselProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
}
