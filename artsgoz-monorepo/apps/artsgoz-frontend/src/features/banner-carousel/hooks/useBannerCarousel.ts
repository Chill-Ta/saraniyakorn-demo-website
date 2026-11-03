import { useState, useEffect } from 'react';

export function useBannerCarousel(
  totalBanners: number,
  autoPlayInterval = 5000,
) {
  const hasMultiple = totalBanners > 1;
  const [displayIndex, setDisplayIndex] = useState(hasMultiple ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (!hasMultiple) return;
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDisplayIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!hasMultiple) return;
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDisplayIndex((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    if (!hasMultiple) return;
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDisplayIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    if (!hasMultiple) return;

    if (displayIndex === totalBanners + 1) {
      // Cloned first slide -> snap instantly back to real first slide (index 1)
      setIsTransitioning(false);
      setDisplayIndex(1);
    } else if (displayIndex === 0) {
      // Cloned last slide -> snap instantly back to real last slide (index totalBanners)
      setIsTransitioning(false);
      setDisplayIndex(totalBanners);
    } else {
      setIsTransitioning(false);
    }
  };

  useEffect(() => {
    if (!hasMultiple || isTransitioning) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayIndex, isTransitioning, totalBanners, autoPlayInterval, hasMultiple]);

  return {
    displayIndex,
    isTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTransitionEnd,
  };
}
