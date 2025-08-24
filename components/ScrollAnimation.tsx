import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'bounce-in';
  delay?: number;
  threshold?: number;
}

export default function ScrollAnimation({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold]);

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'scale-in': 'animate-scale-in',
    'bounce-in': 'animate-bounce-in'
  };

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
