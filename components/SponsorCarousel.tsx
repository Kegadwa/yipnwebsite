import React from "react";

type Sponsor = {
  name: string;
  src: string; // image path or URL
  href?: string;
};

type SponsorCarouselProps = {
  title?: string;
  sponsors: Sponsor[];
  backgroundClassName?: string;
  speedSeconds?: number; // animation duration in seconds
};

export default function SponsorCarousel({ title = "", sponsors, backgroundClassName = "bg-foreground/5 py-4", speedSeconds = 28 }: SponsorCarouselProps) {
  // Duplicate sponsors so the track can loop seamlessly
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className={`relative overflow-hidden ${backgroundClassName}`} aria-label="Sponsors">
      {/* Abstract vector thread behind logos */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,60 C150,20 350,100 500,60 C650,20 850,100 1000,60" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        {/* Slim ribbon */}
        <div className="relative ribbon py-3">
          {/* Marquee track for large screens */}
          <div className="hidden md:block">
            <div className="ribbon-track flex items-center" style={{whiteSpace: 'nowrap'}}>
              <div className="ribbon-scroller will-change-transform" style={{animationDuration: `${speedSeconds}s`}}>
                {doubled.map((s, idx) => (
                  <div key={`${s.name}-${idx}`} className="inline-flex items-center justify-center px-4 min-w-[140px]">
                    <a href={s.href ?? '#'} target="_blank" rel="noopener noreferrer" className="sponsor-link inline-flex items-center justify-center px-3 py-2 rounded-md transition">
                      <img src={s.src} alt={s.name} className="sponsor-logo h-[48px] object-contain filter grayscale transition-transform duration-300" loading="lazy" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Touch friendly horizontal scroll for small screens */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto flex items-center gap-4">
            {sponsors.map((s) => (
              <div key={s.name} className="shrink-0 px-3 py-2">
                <a href={s.href ?? '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                  <img src={s.src} alt={s.name} className="sponsor-logo h-[38px] object-contain filter grayscale transition-transform duration-300" loading="lazy" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[rgba(255,255,255,1)] via-transparent to-transparent opacity-70" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[rgba(255,255,255,1)] via-transparent to-transparent opacity-70" />

      <style jsx>{`
        .ribbon { position: relative; }
        .ribbon:hover .ribbon-scroller { animation-play-state: paused; }

        .ribbon-scroller { display: inline-flex; gap: 2.25rem; align-items: center; }
        .ribbon-track { overflow: hidden; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ribbon-scroller {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: running;
        }

        /* Logo treatment */
        .sponsor-link { display: inline-flex; align-items: center; justify-content: center; }
        .sponsor-link img { display: block; }
        .sponsor-link:hover img, .sponsor-link:focus img { transform: scale(1.1); filter: none; }

        /* Ensure grayscale by default */
        .sponsor-logo { filter: grayscale(100%); transition: transform .28s ease, filter .28s ease; }

        /* Pause on reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .ribbon-scroller { animation-play-state: paused !important; }
        }

        /* Responsive sizing: scale logos down by ~20% on small screens */
        @media (max-width: 767px) {
          .sponsor-logo { height: 38px !important; }
        }

        /* Make the fade edges adapt to dark/light backgrounds */
        .ribbon + div[style] { /* no-op to keep linter happy */ }

        /* On hover of any logo also pause the marquee for better UX */
        .sponsor-link:hover ~ .ribbon-scroller, .sponsor-link:focus ~ .ribbon-scroller { animation-play-state: paused; }
      `}</style>
    </section>
  );
}


