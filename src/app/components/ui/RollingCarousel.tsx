import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RollingCarouselProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  subHeader?: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  itemClassName?: string;
}

export function RollingCarousel({
  children,
  title,
  subtitle,
  badge,
  action,
  subHeader,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
  itemClassName = "w-[85vw] sm:w-[340px] md:w-[380px] shrink-0 snap-start",
}: RollingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const items = React.Children.toArray(children);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, items]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Optional auto-play rolling
  useEffect(() => {
    if (!autoPlay || isHovered || !canScrollRight) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovered, canScrollRight]);

  // Drag to scroll for desktop mouse users
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDragging.current = false;
      }}
    >
      {/* Header with Title and Rolling Controls */}
      {(title || subtitle || badge || action) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            {badge && <div className="mb-2">{badge}</div>}
            {title && (
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }}
                className="text-gray-900"
              >
                {title}
              </h2>
            )}
            {subtitle && <p className="text-gray-500 text-sm mt-1 max-w-xl">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {action}

            {/* Rolling Controls (Arrow Buttons) */}
            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubHeader (e.g. Filter buttons) */}
      {subHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1">{subHeader}</div>
          {!title && !subtitle && !badge && !action && items.length > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fallback compact controls when no header or subHeader is supplied */}
      {!title && !subtitle && !badge && !action && !subHeader && items.length > 1 && (
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#0B5D3F] hover:border-[#0B5D3F] hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Rolling Horizontal Track */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClickCapture={handleClickCapture}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {items.map((child, idx) => (
          <div key={idx} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
