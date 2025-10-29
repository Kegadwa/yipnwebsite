import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Analytics } from '@vercel/analytics/next';
import EventCountdown from '../components/EventCountdown';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
      {/* Sticky countdown visible on all pages; hides on home when hero timer is visible */}
      <EventCountdown sticky anchorId="home-hero-timer-anchor" />
    </AuthProvider>
  );
}
