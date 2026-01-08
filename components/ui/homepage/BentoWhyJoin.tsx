import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FaLeaf, FaUsers, FaSun, FaHeart, FaArrowRight } from "react-icons/fa";

export default function BentoWhyJoin() {
  const topoRef = useRef<SVGSVGElement | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (!topoRef.current) return;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset;
          // small negative translate for subtle slower movement
          topoRef.current!.style.transform = `translateY(${y * -0.06}px)`;
          ticking.current = false;
        });
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-background overflow-hidden" aria-labelledby="why-join-title">
      {/* Topographical SVG background (parallax) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <svg ref={topoRef} className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 C200,50 400,320 600,200 C800,80 1000,340 1200,200" stroke="#cdb79b" strokeWidth="2" fill="none" opacity="0.18" />
          <path d="M0,300 C250,160 500,380 750,260 C1000,140 1200,380 1400,260" stroke="#d6c3a6" strokeWidth="1" fill="none" opacity="0.12" transform="translate(-100,0)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-xs tracking-wider text-muted-foreground font-semibold mb-2 uppercase">ROOTED IN NATURE, DRIVEN BY COMMUNITY</div>
          <h2 id="why-join-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Why Join YIPN?</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Discover the unique benefits that make our community special.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:gap-8 lg:gap-8 lg:grid-cols-4 lg:grid-rows-3">

          {/* Zone A - Hero Feature (left large) */}
          <div className="relative rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-3 shadow-lg border border-[rgba(98,63,37,0.08)] bg-white/60 backdrop-blur-sm" role="region" aria-label="Outdoor Yoga Experience">
            <img src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 56.webp" alt="Outdoor yoga" className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(20,10,6,0.42)]"></div>
            <div className="absolute left-6 bottom-6 text-white max-w-[520px]">
              <h3 className="text-2xl md:text-3xl font-semibold">Outdoor Yoga Experience</h3>
              <p className="mt-2 text-sm md:text-base font-medium">Practice in nature's embrace with fresh air, natural sounds, and the healing energy of Nairobi's green spaces.</p>
            </div>
          </div>

          {/* Zone B - Certified Instructors (small square top right) */}
          <div className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm shadow-md border border-[rgba(98,63,37,0.06)] flex items-center p-6 lg:col-start-3 lg:row-start-1 group">
            <div>
              <h4 className="text-lg font-semibold text-foreground">Certified Instructors</h4>
              <p className="mt-2 text-sm text-muted-foreground font-medium">Learn from experienced, certified yoga teachers who care about your safety and progress.</p>
            </div>
          </div>

          {/* Zone C - All Levels (small square under B) */}
          <div className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm shadow-md border border-[rgba(98,63,37,0.06)] flex items-center p-6 lg:col-start-3 lg:row-start-2 group">
            <div>
              <h4 className="text-lg font-semibold text-foreground">All Levels Welcome</h4>
              <p className="mt-2 text-sm text-muted-foreground font-medium">Whether you're new or advanced, our classes meet you where you are.</p>
            </div>
          </div>

          {/* Zone D - Community Vibe (vertical rectangle stack photos) */}
          <div className="relative rounded-2xl overflow-hidden shadow-md border border-[rgba(98,63,37,0.06)] bg-white/60 lg:col-start-4 lg:row-start-1 lg:row-span-2 group">
            <div className="relative h-full flex flex-col">
              <div className="flex-1 relative">
                <img src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 141.webp" alt="Community 1" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-[1.05]" />
              </div>
              <div className="flex-1 relative -mt-6">
                <img src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 122.webp" alt="Community 2" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-[1.05]" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-lg font-semibold">Community Vibe</h4>
                <p className="mt-2 text-sm font-medium">Connect with like-minded people—shared stories, support, and celebration.</p>
              </div>
            </div>
          </div>

          {/* Zone E - Holistic Wellness (small card) */}
          <div className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm shadow-md border border-[rgba(98,63,37,0.06)] p-6 lg:col-span-2 group">
            <h4 className="text-lg font-semibold text-foreground">Holistic Wellness</h4>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Yoga, breathwork, mindfulness and more—tools for whole-person health.</p>

            <div className="mt-4">
              <Link href="/about" className="inline-flex items-center text-secondary font-semibold hover:underline">
                Learn More <FaArrowRight className="ml-2 text-secondary" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* subtle zoom on the hero image on card hover */
        .group:hover .transform { transform: none; }

        /* ensure icons 'pull out' of the container */
        .rounded-2xl { border-radius: 24px; }

        /* Desktop: increase hero height for dramatic effect */
        @media (min-width: 1024px) {
          .lg\\:row-span-3 { min-height: 640px; }
          .lg\\:row-span-2 { min-height: 360px; }
        }
      `}</style>
    </section>
  );
}
