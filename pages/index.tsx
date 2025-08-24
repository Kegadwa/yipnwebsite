import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FaHeart, FaHandshake, FaSeedling, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import SocialPostsCarousel from "../components/SocialPostsCarousel";

export default function HomePage() {
  // Newsletter signup logic placeholder
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const loading = false; // Replace with actual loading state from your hook

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with actual signup logic
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  // Example event data (replace with actual mockEvents import if available)
  const nextEvent = {
    eventName: "YIPN Edition Two",
    date: "Saturday, August 30th",
    time: "9:00 AM onwards",
    location: "TuWork Nairobi",
    prices: [
      { label: "Individual", price: "KSh 2,000" },
      { label: "Couple", price: "KSh 3,800" },
      { label: "Group of 4", price: "KSh 7,600" }
    ]
  };

  return (
    <>
      <Head>
        <title>YIPN - Yoga in the Park Nairobi | Find Your Flow</title>
        <meta name="description" content="Join our vibrant community for transformative yoga, meditation, and wellness experiences in the heart of Nairobi." />
        <link rel="icon" type="image/png" href="/2.png" />
        <link rel="shortcut icon" type="image/png" href="/2.png" />
        <link rel="apple-touch-icon" href="/2.png" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero Section */}
          <section
            className="relative h-screen flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-primary/70"></div>
            <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                Yoga in the Park Nairobi
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-white/90 animate-fade-in fade-in-delay-200">
                Find Your Flow
              </p>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/80 animate-fade-in fade-in-delay-400">
                Join our vibrant community for transformative yoga, meditation, and wellness experiences in the heart of Nairobi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in fade-in-delay-500">
                <Link href="/events">
                  <button className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold shadow-button hover:scale-110 transition animate-on-hover">
                    Buy Tickets
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="px-6 py-3 rounded-lg border border-white text-white bg-white/10 hover:bg-white hover:text-primary hover:scale-110 transition animate-on-hover">
                    Explore Merchandise
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
                  Welcome to Your Wellness Journey
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed animate-slide-up slide-up-delay-200">
                  Yoga in the Park Nairobi (YIPN) creates sacred spaces where community, wellness, and mindfulness converge. 
                  We bring together yoga enthusiasts, meditation practitioners, and wellness seekers in the beautiful, natural 
                  setting of Nairobi&apos;s green spaces.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center animate-slide-up slide-up-delay-300 animate-on-hover">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaHeart className="text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Rejuvenate</h3>
                    <p className="text-muted-foreground">Restore your energy and find inner peace through mindful movement and breathing.</p>
                  </div>
                  <div className="text-center animate-slide-up slide-up-delay-400 animate-on-hover">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaHandshake className="text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Connect</h3>
                    <p className="text-muted-foreground">Build meaningful relationships with like-minded individuals in our wellness community.</p>
                  </div>
                  <div className="text-center animate-slide-up slide-up-delay-500 animate-on-hover">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaSeedling className="text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Learn</h3>
                    <p className="text-muted-foreground">Discover new practices, techniques, and insights to enhance your wellness journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Event Highlight */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded mb-4 animate-scale-in">Next Event</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up slide-up-delay-200 text-foreground">
                    {nextEvent.eventName}
                  </h2>
                  <p className="text-lg text-muted-foreground animate-slide-up slide-up-delay-400">
                    Join us for another transformative experience of yoga, meditation, and community connection.
                  </p>
                </div>
                <div className="bg-card rounded-lg shadow-card p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center justify-center space-x-3">
                      <FaCalendarAlt className="text-xl text-secondary" />
                      <span>{nextEvent.date}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <FaClock className="text-xl text-secondary" />
                      <span>{nextEvent.time}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <FaMapMarkerAlt className="text-xl text-secondary" />
                      <span>{nextEvent.location}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {nextEvent.prices.map((price, index) => (
                      <div key={index} className="text-center p-4 bg-muted rounded-lg">
                        <p className="font-semibold text-lg text-foreground">{price.label}</p>
                        <p className="text-2xl font-bold text-secondary">{price.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link href="/events">
                      <button className="px-6 py-3 rounded-lg bg-secondary text-white font-semibold shadow hover:scale-105 transition">
                        Get Your Tickets Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Posts Carousel */}
          <SocialPostsCarousel />

          {/* Newsletter Signup */}
          <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
                  Join Our Wellness Community
                </h2>
                <p className="text-lg mb-8 animate-slide-up slide-up-delay-200 opacity-90">
                  Stay connected with YIPN and receive exclusive updates, wellness tips, and early access to event tickets.
                </p>
                {isSubscribed ? (
                  <div className="bg-wellness/20 border border-wellness rounded-lg p-6 animate-scale-in">
                    <FaStar className="text-3xl mb-4 animate-float text-wellness" />
                    <p className="text-lg font-semibold">Welcome to the YIPN Community!</p>
                    <p className="mt-2">Thank you for joining us on this wellness journey.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-wellness"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-wellness text-wellness-foreground font-semibold rounded-lg hover:bg-wellness/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}