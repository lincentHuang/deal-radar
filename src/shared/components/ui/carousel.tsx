'use client';

import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  children: React.ReactNode;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  opts?: CarouselOptions;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  orientation?: 'horizontal' | 'vertical';
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

export const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      autoplay = false,
      autoplayDelay = 4000,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { triggerHaptic } = useMobileNative();

    // 支援 Autoplay 插件
    const autoplayPlugin = React.useMemo(() => {
      if (!autoplay) return undefined;
      return Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      });
    }, [autoplay, autoplayDelay]);

    const resolvedPlugins = React.useMemo(() => {
      const list = plugins ? (Array.isArray(plugins) ? plugins : [plugins]) : [];
      if (autoplayPlugin) {
        list.push(autoplayPlugin);
      }
      return list;
    }, [plugins, autoplayPlugin]);

    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      resolvedPlugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      const snaps = emblaApi.scrollSnapList();
      setScrollSnaps(snaps);
      setSelectedIndex(emblaApi.selectedScrollSnap());
      if (snaps.length <= 1) {
        setCanScrollPrev(false);
        setCanScrollNext(false);
      } else {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      }
    }, []);

    const scrollPrev = React.useCallback(() => {
      if (!api) return;
      triggerHaptic('light');
      api.scrollPrev();
    }, [api, triggerHaptic]);

    const scrollNext = React.useCallback(() => {
      if (!api) return;
      triggerHaptic('light');
      api.scrollNext();
    }, [api, triggerHaptic]);

    const scrollTo = React.useCallback(
      (index: number) => {
        if (!api) return;
        triggerHaptic('light');
        api.scrollTo(index);
      },
      [api, triggerHaptic]
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api.off('reInit', onSelect);
        api.off('select', onSelect);
      };
    }, [api, onSelect]);

    // 當輪播內容 (如篩選標籤變更後的 Banner) 動態變化時，重新計算 Embla Snaps
    React.useEffect(() => {
      if (!api) return;
      api.reInit();
      onSelect(api);
    }, [api, children, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          scrollTo,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative focus:outline-none', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = 'Carousel';

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden rounded-3xl">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
});

CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev, scrollSnaps } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        'absolute z-20 top-1/2 -translate-y-1/2 -left-3 sm:-left-5 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-lg backdrop-blur-md border border-slate-200/80 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-0 disabled:pointer-events-none hover:shadow-xl cursor-pointer',
        className
      )}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  );
});

CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext, scrollSnaps } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        'absolute z-20 top-1/2 -translate-y-1/2 -right-3 sm:-right-5 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-lg backdrop-blur-md border border-slate-200/80 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-0 disabled:pointer-events-none hover:shadow-xl cursor-pointer',
        className
      )}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  );
});

CarouselNext.displayName = 'CarouselNext';

export const CarouselDots: React.FC<{ className?: string }> = ({ className }) => {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

  const isSingleOrEmpty = scrollSnaps.length <= 1;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1.5 pt-3 sm:pt-4 min-h-[2rem] transition-all duration-300',
        isSingleOrEmpty && 'invisible pointer-events-none',
        className
      )}
      aria-hidden={isSingleOrEmpty}
    >
      {!isSingleOrEmpty &&
        scrollSnaps.map((_, index) => {
          const isActive = index === selectedIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                isActive
                  ? 'w-7 bg-rose-500 shadow-sm'
                  : 'w-2 bg-slate-300/80 hover:bg-slate-400'
              )}
            />
          );
        })}
    </div>
  );
};

export const CarouselCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollSnaps, selectedIndex } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 text-xs font-bold tracking-wider shadow-lg select-none transition-all duration-200',
        className
      )}
      {...props}
    >
      <span className="font-mono text-white font-extrabold">{selectedIndex + 1}</span>
      <span className="text-white/40 font-light text-[10px]">/</span>
      <span className="font-mono text-white/80">{scrollSnaps.length}</span>
    </div>
  );
});

CarouselCounter.displayName = 'CarouselCounter';
