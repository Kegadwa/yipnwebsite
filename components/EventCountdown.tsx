import React, { useEffect, useMemo, useState } from "react";

type EventCountdownProps = {
  endTimeISO?: string; // ISO string in local timezone of event or UTC
  label?: string;
  sticky?: boolean; // render as sticky floating widget
  anchorId?: string; // if provided, hide sticky when this element is in view
};

const EVENT_URL = "https://kenyabuzz.com/events/event/a-yoga-in-the-park-nairobi-sundowner?fbclid=PAZXh0bgNhZW0CMTEAAacum_hZRm--l3Eck-R7jbgU1Mwc7PDXUvEuKL-GGI2zAntWLGLPuVCk9EQwCQ_aem_Mb01DgL5elAzmyQjGE-KQg";

export default function EventCountdown({ endTimeISO, label = "A Yoga in the Park Nairobi Sundowner", sticky = false, anchorId }: EventCountdownProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const targetDate = useMemo(() => {
    // Event local time: EAT (UTC+3) 2025-11-08 15:00
    // Construct as UTC equivalent to avoid client TZ differences
    if (endTimeISO) return new Date(endTimeISO);
    return new Date(Date.UTC(2025, 10, 8, 12, 0, 0)); // 15:00 EAT == 12:00 UTC (month is 0-based => 10 = November)
  }, [endTimeISO]);

  const [remainingMs, setRemainingMs] = useState<number>(Math.max(0, targetDate.getTime() - Date.now()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideSticky, setHideSticky] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, targetDate.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (!sticky || !anchorId) return;
    const el = document.getElementById(anchorId);
    if (!el) {
      setHideSticky(false);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setHideSticky(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sticky, anchorId]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeEl = (
    <div className="flex items-center gap-2 text-sm md:text-base">
      <TimeBox label="Days" value={days} />
      <span className="opacity-60">:</span>
      <TimeBox label="Hours" value={hours} />
      <span className="opacity-60">:</span>
      <TimeBox label="Min" value={minutes} />
      <span className="opacity-60">:</span>
      <TimeBox label="Sec" value={seconds} />
    </div>
  );

  if (!mounted) {
    // Avoid SSR/client mismatches by rendering nothing until mounted
    return sticky ? null : <div id="home-hero-timer-anchor" />;
  }

  if (sticky) {
    return (
      <>
        <button
          aria-label="Event countdown"
          onClick={() => setIsModalOpen(true)}
          className={`fixed z-30 right-4 bottom-4 md:right-6 md:bottom-6 rounded-xl shadow-lg px-4 py-3 bg-secondary text-secondary-foreground border border-secondary/30 hover:scale-[1.02] transition ${hideSticky ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="text-left">
            <div className="text-xs font-semibold opacity-90">Edition 3 Countdown</div>
            {timeEl}
          </div>
        </button>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  return (
    <div id="home-hero-timer-anchor" className="inline-block" onClick={() => setIsModalOpen(true)}>
      <div className="inline-flex items-center gap-3 rounded-xl bg-white/15 text-white border border-white/20 px-4 py-3 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
        <span className="text-xs md:text-sm font-semibold">Edition 3 starts in</span>
        {timeEl}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center min-w-[42px]">
      <span className="text-base md:text-lg font-bold tabular-nums leading-none">{v}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70">{label}</span>
    </div>
  );
}

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full md:w-[560px] bg-white rounded-t-2xl md:rounded-2xl p-6 md:p-8 shadow-2xl animate-[modalIn_180ms_ease-out]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Edition 3: A Yoga in the Park Nairobi Sundowner</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="mt-3 text-gray-700 text-sm md:text-base">
          <div className="font-medium">Sat, 8 Nov 2025, 3:00 PM - 9:00 PM</div>
          <p className="mt-3">Join us for our sunset flow, meditation, and breathwork session! Tickets include warm infused teas and healthy gourmet snacks. Experience the magic of our sundowner event.</p>
        </div>
        <div className="mt-6">
          <a
            href={EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition"
          >
            Buy Tickets
          </a>
        </div>
      </div>
    </div>
  );
}


