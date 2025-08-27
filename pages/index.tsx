import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { FaHeart, FaHandshake, FaSeedling, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaWhatsapp, FaUsers, FaLeaf, FaSun, FaMountain, FaQuoteLeft, FaQuoteRight, FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaPlus } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import ReviewForm from "../components/ReviewForm";
import { reviewService } from "../lib/firebase-services";

export default function HomePage() {
  // Newsletter signup logic placeholder
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Load reviews from database
  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const reviewsData = await reviewService.readAll();
      
      // If no reviews exist, add some sample reviews to demonstrate the system
      if (reviewsData.length === 0) {
        console.log('No reviews found, adding sample reviews to demonstrate the system');
        const sampleReviews = [
          {
            name: "Sarah M.",
            role: "Yoga Enthusiast",
            text: "YIPN has transformed my wellness journey. The outdoor sessions and community energy are absolutely magical!",
            rating: 5
          },
          {
            name: "David K.",
            role: "Beginner Yogi",
            text: "As a complete beginner, I was nervous, but the instructors made me feel so welcome. Now I can't imagine my weekends without YIPN!",
            rating: 5
          },
          {
            name: "Grace W.",
            role: "Wellness Coach",
            text: "The fresh-air yoga experience and the genuine community connection here is exactly what Nairobi needed. Pure magic!",
            rating: 5
        },
          {
            name: "Michael O.",
            role: "Meditation Practitioner",
            text: "Finding inner peace in the heart of the city is possible thanks to YIPN. The natural setting adds so much to the practice.",
            rating: 5
          }
        ];
        
        try {
          // Add sample reviews to database
          for (const review of sampleReviews) {
            await reviewService.create(review);
          }
          
          // Reload reviews after adding samples
          const updatedReviews = await reviewService.readAll();
          setReviews(updatedReviews);
        } catch (sampleError) {
          console.error('Error adding sample reviews:', sampleError);
          // If adding samples fails, use them as fallback
          setReviews(sampleReviews);
        }
      } else {
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Fallback to default testimonials if database fails
      setReviews([
        {
          name: "Sarah M.",
          role: "Yoga Enthusiast",
          text: "YIPN has transformed my wellness journey. The outdoor sessions and community energy are absolutely magical!",
          rating: 5
        },
        {
          name: "David K.",
          role: "Beginner Yogi",
          text: "As a complete beginner, I was nervous, but the instructors made me feel so welcome. Now I can't imagine my weekends without YIPN!",
          rating: 5
        },
        {
          name: "Grace W.",
          role: "Wellness Coach",
          text: "The fresh-air yoga experience and the genuine community connection here is exactly what Nairobi needed. Pure magic!",
          rating: 5
        },
        {
          name: "Michael O.",
          role: "Meditation Practitioner",
          text: "Finding inner peace in the heart of the city is possible thanks to YIPN. The natural setting adds so much to the practice.",
          rating: 5
        }
      ]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, []);

  // Reset current testimonial when reviews change
  useEffect(() => {
    if (reviews.length > 0 && currentTestimonial >= reviews.length) {
      setCurrentTestimonial(0);
    }
  }, [reviews.length, currentTestimonial]);

  // Handle review submission
  const handleReviewSubmitted = () => {
    loadReviews(); // Reload reviews to show the new one
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
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

          {/* Welcome & Vision Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-slide-up text-foreground leading-tight">
                  Awaken Your Spirit in the Heart of Nairobi
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up slide-up-delay-200 max-w-4xl mx-auto">
                  At YIPN, we believe that wellness is not just about physical exercise—it's about creating meaningful connections, 
                  finding inner peace, and building a community that supports your journey to holistic health. 
                  Our mission is to bring the transformative power of yoga and mindfulness to the vibrant heart of Nairobi, 
                  creating sacred spaces where connection, wellness, and mindfulness converge.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                  <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full font-medium">
                    fresh-air yoga
                  </span>
                  <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full font-medium">
                    community energy
                  </span>
                  <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full font-medium">
                    mindful movement
                  </span>
                  <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full font-medium">
                    nature connection
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Events Highlights Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full mb-4 animate-scale-in text-sm md:text-base">
                    Next Event
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 animate-slide-up slide-up-delay-200 text-foreground">
                    {nextEvent.eventName}
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground animate-slide-up slide-up-delay-400 max-w-3xl mx-auto">
                    Join us for another transformative experience of <span className="underline decoration-secondary decoration-2">fresh-air yoga</span> and <span className="underline decoration-secondary decoration-2">community energy</span>.
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Event Details */}
                    <div className="space-y-6 animate-slide-up slide-up-delay-300">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <FaCalendarAlt className="text-xl text-secondary flex-shrink-0" />
                          <span className="text-base md:text-lg">{nextEvent.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaClock className="text-xl text-secondary flex-shrink-0" />
                          <span className="text-base md:text-lg">{nextEvent.time}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaMapMarkerAlt className="text-xl text-secondary flex-shrink-0" />
                          <span className="text-base md:text-lg">{nextEvent.location}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {nextEvent.prices.map((price, index) => (
                          <div key={index} className="text-center p-4 bg-muted rounded-xl">
                            <p className="font-semibold text-base md:text-lg text-foreground">{price.label}</p>
                            <p className="text-xl md:text-2xl font-bold text-secondary">{price.price}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4">
                        <Link href="/events">
                          <button className="w-full md:w-auto px-6 py-3 md:py-4 rounded-xl bg-secondary text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base md:text-lg">
                            Get Your Tickets Now
                          </button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Event Image */}
                    <div className="animate-slide-up slide-up-delay-400">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                                 <img 
                           src="/Some edition 1 photos/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 1.jpg" 
                           alt="YIPN Edition Two Event" 
                           className="w-full h-64 md:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
                         />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Join Us Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-slide-up text-foreground">
                    Why Join YIPN?
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground animate-slide-up slide-up-delay-200 max-w-3xl mx-auto">
                    Discover the unique benefits that make our community special
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up slide-up-delay-300 animate-on-hover group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 md:mb-6 flex items-center justify-center animate-float group-hover:scale-110 transition-transform">
                      <FaLeaf className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-foreground">Outdoor Yoga Experience</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Practice in nature's embrace with fresh air, natural sounds, and the healing energy of Nairobi's green spaces.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up slide-up-delay-400 animate-on-hover group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 md:mb-6 flex items-center justify-center animate-float group-hover:scale-110 transition-transform">
                      <FaUsers className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-foreground">Certified Instructors</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Learn from experienced, certified yoga teachers who are passionate about your wellness journey and safety.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up slide-up-delay-500 animate-on-hover group md:col-span-2 lg:col-span-1">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 md:mb-6 flex items-center justify-center animate-float group-hover:scale-110 transition-transform">
                      <FaHeart className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-foreground">Community Vibe</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Connect with like-minded individuals who share your passion for wellness, mindfulness, and personal growth.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up slide-up-delay-600 animate-on-hover group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 md:mb-6 flex items-center justify-center animate-float group-hover:scale-110 transition-transform">
                      <FaSun className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-foreground">All Levels Welcome</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Whether you're a beginner or advanced practitioner, our sessions are designed to accommodate everyone.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up slide-up-delay-700 animate-on-hover group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 md:mb-6 flex items-center justify-center animate-float group-hover:scale-110 transition-transform">
                      <FaMountain className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 text-foreground">Holistic Wellness</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Experience a complete wellness approach including yoga, meditation, breathing techniques, and mindfulness practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visual Enrichment Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-slide-up text-foreground">
                    Experience the Magic of YIPN
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto animate-slide-up slide-up-delay-200">
                    Discover the transformative power of practicing yoga in nature, surrounded by our supportive community and the beautiful landscapes of Nairobi.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <div className="space-y-6 animate-slide-up slide-up-delay-300">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      Mindful Movement in Nature
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                      Our outdoor yoga sessions combine the ancient wisdom of yoga with the healing power of nature. 
                      Feel the earth beneath your mat, breathe in fresh air, and connect with the natural rhythms around you.
                    </p>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                      Whether you're a beginner or experienced practitioner, our inclusive sessions welcome all levels. 
                      Our certified instructors guide you through poses, breathing techniques, and meditation practices 
                      that help you find inner peace and physical strength.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      <div className="flex items-center space-x-2 text-secondary">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-xs md:text-sm font-medium">All Levels Welcome</span>
                      </div>
                      <div className="flex items-center space-x-2 text-secondary">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-xs md:text-sm font-medium">Certified Instructors</span>
                      </div>
                      <div className="flex items-center space-x-2 text-secondary">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-xs md:text-sm font-medium">Nature Connection</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4 animate-slide-up slide-up-delay-400">
                    <div className="space-y-3 md:space-y-4">
                                             <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                         <img 
                           src="/Some edition 1 photos/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 28.jpg" 
                           alt="Yoga in nature setting" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         />
                       </div>
                                             <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                         <img 
                           src="/Some edition 1 photos/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 78.jpg" 
                           alt="Meditation in peaceful environment" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         />
                       </div>
                    </div>
                    <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
                                             <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                         <img 
                           src="/Some edition 1 photos/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 92.jpg" 
                           alt="Community yoga session" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         />
                       </div>
                                             <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                         <img 
                           src="/Some edition 1 photos/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 63.jpg" 
                           alt="Peaceful meditation practice" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wellness Tip of the Month Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full mb-4 animate-scale-in text-sm md:text-base">
                    Wellness Tip of the Month
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 animate-slide-up text-foreground">
                    Start Your Day with Intention
                  </h2>
                </div>
                
                <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 text-center animate-slide-up slide-up-delay-200">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <FaSun className="text-2xl md:text-3xl text-secondary" />
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 leading-relaxed">
                    <strong className="text-foreground">Start your morning with 5 deep breaths outdoors.</strong> 
                    Find a quiet spot in your garden, balcony, or even by an open window. 
                    Inhale deeply through your nose, feeling your lungs expand, then exhale slowly through your mouth. 
                    This simple practice sets a mindful tone for your entire day.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
                    <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full">Morning Ritual</span>
                    <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full">Breath Awareness</span>
                    <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full">Mindful Start</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community & Updates Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* WhatsApp Community */}
                  <div className="text-center lg:text-left animate-slide-up slide-up-delay-200">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
                      Join Our WhatsApp Community
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                      Connect with fellow yogis, get event updates, share experiences, and be part of our growing wellness family. 
                      Stay connected with the latest news, wellness tips, and community events.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <a 
                        href="https://chat.whatsapp.com/BOpAhahjb834DLsnirdxax?mode=ems_copy_c&fbclid=PAZXh0bgNhZW0CMTEAAadXQg7u2t3CdxMK9aPyr_Yx_l-q5mo4C6u2clEj1lkdcfy_P_D25PAnzFJ8Ag_aem_ZX4GMlmRM5prmci1JSYmSQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl animate-on-hover w-full justify-center"
                      >
                        <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Join WhatsApp Community</span>
                      </a>
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="inline-flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl animate-on-hover w-full justify-center"
                      >
                        <FaPlus className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Share Your Experience</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Testimonials Carousel */}
                  <div className="animate-slide-up slide-up-delay-300">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">What Our Community Says</h3>
                        {!loadingReviews && reviews.length > 0 && (
                          <div className="flex items-center justify-center space-x-4 mb-4">
                            <button
                              onClick={prevTestimonial}
                              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                            >
                              <FaArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={toggleAutoPlay}
                              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                            >
                              {isAutoPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={nextTestimonial}
                              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                            >
                              <FaArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {loadingReviews ? (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-white/80">Loading community reviews...</p>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-white/80 mb-4">Be the first to share your experience!</p>
                          <button
                            onClick={() => setShowReviewForm(true)}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                          >
                            Write a Review
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="text-center">
                            <div className="mb-4">
                              <FaQuoteLeft className="text-2xl md:text-3xl text-white/60 mx-auto mb-2" />
                            </div>
                            <p className="text-sm md:text-base lg:text-lg mb-4 leading-relaxed italic">
                              {reviews[currentTestimonial]?.text || 'Loading...'}
                            </p>
                            <div className="mb-4">
                              <FaQuoteRight className="text-2xl md:text-3xl text-white/60 mx-auto" />
                            </div>
                            <div className="mb-2">
                              <div className="flex justify-center space-x-1">
                                {[...Array(reviews[currentTestimonial]?.rating || 5)].map((_, i) => (
                                  <FaStar key={i} className="text-yellow-300 w-4 h-4 md:w-5 md:h-5" />
                                ))}
                              </div>
                            </div>
                            <p className="font-semibold text-white">{reviews[currentTestimonial]?.name || 'Loading...'}</p>
                            <p className="text-sm text-white/80">{reviews[currentTestimonial]?.role || 'Loading...'}</p>
                          </div>
                          
                          {/* Testimonial Indicators */}
                          <div className="flex justify-center space-x-2 mt-6">
                            {reviews.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setCurrentTestimonial(index);
                                  setIsAutoPlaying(false);
                                }}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-slide-up text-foreground">
                  Welcome to Your Wellness Journey
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed animate-slide-up slide-up-delay-200">
                  Yoga in the Park Nairobi (YIPN) creates sacred spaces where community, wellness, and mindfulness converge. 
                  We bring together yoga enthusiasts, meditation practitioners, and wellness seekers in the beautiful, natural 
                  setting of Nairobi&apos;s green spaces.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
                  <div className="text-center animate-slide-up slide-up-delay-300 animate-on-hover">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaHeart className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Rejuvenate</h3>
                    <p className="text-sm md:text-base text-muted-foreground">Restore your energy and find inner peace through mindful movement and breathing.</p>
                  </div>
                  <div className="text-center animate-slide-up slide-up-delay-400 animate-on-hover">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaHandshake className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Connect</h3>
                    <p className="text-sm md:text-base text-muted-foreground">Build meaningful relationships with like-minded individuals in our wellness community.</p>
                  </div>
                  <div className="text-center animate-slide-up slide-up-delay-500 animate-on-hover">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center animate-float">
                      <FaSeedling className="text-2xl md:text-3xl text-secondary-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Learn</h3>
                    <p className="text-sm md:text-base text-muted-foreground">Discover new practices, techniques, and insights to enhance your wellness journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Call to Action Section */}
          <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-slide-up">
                  Ready to Begin Your Wellness Journey?
                </h2>
                <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 opacity-90 leading-relaxed animate-slide-up slide-up-delay-200">
                  Join our vibrant community and experience the transformative power of yoga in nature. 
                  Take the first step towards holistic wellness today.
                </p>
                
                <div className="flex flex-col sm:flex-row lg:flex-row gap-4 md:gap-6 justify-center animate-slide-up slide-up-delay-300">
                  <Link href="/events" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base md:text-lg">
                      Buy Tickets
                    </button>
                  </Link>
                  <Link href="/shop" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all duration-200 text-base md:text-lg font-semibold">
                      Explore Merchandise
                    </button>
                  </Link>
                  <a 
                    href="https://chat.whatsapp.com/BOpAhahjb834DLsnirdxax?mode=ems_copy_c&fbclid=PAZXh0bgNhZW0CMTEAAadXQg7u2t3CdxMK9aPyr_Yx_l-q5mo4C6u2clEj1lkdcfy_P_D25PAnzFJ8Ag_aem_ZX4GMlmRM5prmci1JSYmSQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base md:text-lg flex items-center justify-center space-x-2">
                      <FaWhatsapp className="w-5 h-5" />
                      <span>Join WhatsApp Community</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Review Form Modal */}
        <ReviewForm
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
        
        <Footer />
      </div>
    </>
  );
}