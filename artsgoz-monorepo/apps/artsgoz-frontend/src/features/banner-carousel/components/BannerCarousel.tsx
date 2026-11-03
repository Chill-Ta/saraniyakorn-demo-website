import { BannerCarouselProps } from '../types.js';
import { useBannerCarousel } from '../hooks/useBannerCarousel.js';

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const {
    displayIndex,
    isTransitioning,
    goToSlide,
    handleTransitionEnd,
  } = useBannerCarousel(banners.length, autoPlayInterval);

  if (!banners || banners.length === 0) return null;

  const hasMultiple = banners.length > 1;
  const slides = hasMultiple
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;

  return (
    <div className="w-full h-full flex justify-center relative min-w-0">
      <div className="relative overflow-hidden w-full h-full group bg-gray-200">
        <div
          className="absolute inset-0 flex transition-transform"
          style={{
            transform: `translateX(-${displayIndex * 100}%)`,
            transitionDuration: isTransitioning ? '800ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((banner, index) => {
            return (
              <a
                key={`${banner.id}-${index}`}
                href={banner.linkUrl}
                className="min-w-full h-full relative block shrink-0 overflow-hidden bg-gray-200"
              >
                {!banner.desktopImageUrl && !banner.mobileImageUrl ? (
                  <div className="w-full h-full relative flex items-center justify-start bg-gray-200 transition-all duration-500 overflow-hidden" />
                ) : (
                  <picture>
                    <source
                      media="(min-width: 768px)"
                      srcSet={banner.desktopImageUrl}
                    />
                    <img
                      src={banner.mobileImageUrl}
                      alt={banner.altText}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                )}
              </a>
            );
          })}
        </div>

        {/* Top Premium Pagination */}
        {hasMultiple && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center max-w-[90%] justify-center select-none">
            {banners.map((_, idx) => {
              const activeIndex = (displayIndex - 1 + banners.length) % banners.length;
              const isActive = idx === activeIndex;

              let widthStyle = '0%';
              let durationStyle = '0ms';

              if (isActive) {
                widthStyle = isTransitioning ? '0%' : '100%';
                durationStyle = isTransitioning ? '0ms' : `${autoPlayInterval}ms`;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`transition-all cursor-pointer focus:outline-none rounded-full border-none p-0 ${
                    isActive
                      ? 'h-2 w-12 sm:w-16 md:w-20 bg-white/20 overflow-hidden relative'
                      : 'h-2 w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  style={{
                    transitionDuration: '800ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && (
                    <div
                      className="h-full bg-white"
                      style={{
                        width: widthStyle,
                        transitionProperty: 'width',
                        transitionDuration: durationStyle,
                        transitionTimingFunction: 'linear',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
