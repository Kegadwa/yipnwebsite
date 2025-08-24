import React, { useState } from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';

const GalleryEdition2 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const upcomingEvent = true; // Toggle this based on event status

  if (upcomingEvent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <section
          className="relative py-32 flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-primary/60"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Edition Two Gallery
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
              Experience the evolution of our wellness community through the lens of our second transformative event.
            </p>
          </div>
        </section>
        
        <main className="flex-1">
            {/* Header */}
            <section className="py-20 wellness-gradient">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <Link href="/gallery" className="inline-flex items-center space-x-2 text-secondary hover:text-primary mb-6 transition-smooth">
                    <span className="mr-2">←</span>
                    <span>Back to Gallery</span>
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    YIPN™ Edition 2 Gallery
                  </h1>
                  <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-6">
                    📅 Coming Soon - August 30, 2024
                  </span>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
                    <div className="text-6xl mb-4">📸</div>
                    <h2 className="text-2xl font-bold mb-4">Gallery Coming Soon!</h2>
                    <p className="text-gray-600 mb-6">
                      Edition 2 is just around the corner! Once the event takes place, 
                      this gallery will be filled with beautiful moments, inspiring yoga flows, 
                      and the amazing YIPN™ community in action.
                    </p>
                  </div>

                  {/* Event Preview */}
                  <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-4">What to Expect at Edition 2</h3>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Vinyasa Flow Yoga</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Mindfulness Meditation</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Pilates Session</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Sound Bath Healing</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Community Networking</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Wellness Marketplace</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-x-4">
                    <Link href="/events" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                      Reserve Your Spot
                    </Link>
                    <Link href="/gallery-edition-1" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      View Edition 1 Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Sneak Peek Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-8">Preparing for Something Special</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📷</span>
                        </div>
                        <h3 className="font-semibold mb-2">Professional Photography</h3>
                        <p className="text-sm text-gray-600">
                          Capturing every beautiful moment of your wellness journey
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">▶️</span>
                        </div>
                        <h3 className="font-semibold mb-2">Video Highlights</h3>
                        <p className="text-sm text-gray-600">
                          Relive the experience with curated video moments
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="font-semibold mb-2">Live Updates</h3>
                        <p className="text-sm text-gray-600">
                          Follow along on event day for real-time moments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
    );
  }

  // This would be the gallery content after the event happens
  const galleryItems = [
    // Gallery items would be populated here after the event
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Gallery content for after the event */}
    </div>
  );
};

export default GalleryEdition2;