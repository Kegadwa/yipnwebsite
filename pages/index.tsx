import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FaHeart, FaHandshake, FaSeedling, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";

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
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero Section */}
          <section
            className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
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

          {/* WhatsApp Community Section */}
          <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
                  Join Our WhatsApp Community
                </h2>
                <p className="text-lg mb-8 animate-slide-up slide-up-delay-200 opacity-90">
                  Connect with fellow yogis, get event updates, share experiences, and be part of our growing wellness family.
                </p>
                <a 
                  href="https://chat.whatsapp.com/BOpAhahjb834DLsnirdxax?mode=ems_copy_c&fbclid=PAZXh0bgNhZW0CMTEAAadXQg7u2t3CdxMK9aPyr_Yx_l-q5mo4C6u2clEj1lkdcfy_P_D25PAnzFJ8Ag_aem_ZX4GMlmRM5prmci1JSYmSQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl animate-on-hover"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Join WhatsApp Community</span>
                </a>
              </div>
            </div>
          </section>

          {/* New Content Section with Images */}
          <section className="py-20 bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
                    Experience the Magic of YIPN
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up slide-up-delay-200">
                    Discover the transformative power of practicing yoga in nature, surrounded by our supportive community and the beautiful landscapes of Nairobi.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 animate-slide-up slide-up-delay-300">
                    <h3 className="text-2xl font-bold text-foreground">
                      Mindful Movement in Nature
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our outdoor yoga sessions combine the ancient wisdom of yoga with the healing power of nature. 
                      Feel the earth beneath your mat, breathe in fresh air, and connect with the natural rhythms around you.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Whether you're a beginner or experienced practitioner, our inclusive sessions welcome all levels. 
                      Our certified instructors guide you through poses, breathing techniques, and meditation practices 
                      that help you find inner peace and physical strength.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-secondary">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-sm font-medium">All Levels Welcome</span>
                      </div>
                      <div className="flex items-center space-x-2 text-secondary">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-sm font-medium">Certified Instructors</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 animate-slide-up slide-up-delay-400">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                          alt="Yoga in nature setting" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                          alt="Meditation in peaceful environment" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}