import { useState, useEffect } from 'react';
import { ArrowUpFromLine } from 'lucide-react';

/**
 * ScrollToTopButton — shared floating "Go up" button.
 * Locked/fixed position in the screen, bottom-right corner.
 * Bright yellow background (#F8C135) with white ArrowUpFromLine icon.
 * Dynamically becomes visible when scrolling down (> 300px).
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      id="scroll-to-top-btn"
      onClick={handleClick}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg text-white hover:opacity-90 z-50 animate-fade-in"
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '9999px',
        background: '#F8C135',
        border: 'none',
      }}
    >
      <ArrowUpFromLine size={20} strokeWidth={2.5} />
    </button>
  );
}
