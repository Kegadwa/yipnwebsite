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
};

export default function SponsorCarousel({ title = "Our Sponsors", sponsors, backgroundClassName = "bg-amber-100" }: SponsorCarouselProps) {
  const track = [...sponsors, ...sponsors];

  return (
    <section className={`py-8 md:py-10 ${backgroundClassName}`}>
      <div className="container mx-auto px-4">
        {title && (
          <h3 className="text-center text-sm md:text-base font-medium text-foreground/80 mb-4">
            {title}
          </h3>
        )}

        <div className="relative overflow-hidden group">
          <div className="flex items-center gap-8 md:gap-12 carousel-track will-change-transform">
            {track.map((s, idx) => {
              const image = (
                <img
                  src={s.src}
                  alt={s.name}
                  className="h-10 md:h-12 lg:h-14 object-contain filter grayscale group-hover:grayscale-0 transition duration-300"
                  loading="lazy"
                />
              );

              return (
                <div key={`${s.name}-${idx}`} className="flex-shrink-0 flex items-center justify-center min-w-[120px]">
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition">
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


