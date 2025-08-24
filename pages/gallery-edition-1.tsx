import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const GalleryEdition1 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      src: '/api/placeholder/600/400',
      alt: 'Yoga session at sunrise - Edition 1',
      caption: 'Morning yoga flow in the beautiful park setting'
    },
    {
      id: 2,
      type: 'image',
      src: '/api/placeholder/600/400',
      alt: 'Group meditation - Edition 1',
      caption: 'Community meditation circle'
    },
    {
      id: 3,
      type: 'video',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      alt: 'Edition 1 Highlights',
      caption: 'Event highlights and participant experiences'
    },
    {
      id: 4,
      type: 'image',
      src: '/api/placeholder/600/400',
      alt: 'Sound bath healing - Edition 1',
      caption: 'Relaxing sound bath experience'
    },
    {
      id: 5,
      type: 'image',
      src: '/api/placeholder/600/400',
      alt: 'Community networking - Edition 1',
      caption: 'Building connections through wellness'
    },
    {
      id: 6,
      type: 'image',
      src: '/api/placeholder/600/400',
      alt: 'Pilates session - Edition 1',
      caption: 'Strengthening body and mind together'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative py-32 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Edition One Gallery
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Relive the magic of our first YIPN event through these beautiful captured moments of community and wellness.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <section className="py-16 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link href="/gallery" className="inline-flex items-center space-x-2 text-secondary hover:text-primary mb-6 transition-colors">
                <span className="mr-2">←</span>
                <span>Back to Gallery</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                YIPN™ Edition 1 Gallery
              </h1>
              <p className="text-lg text-gray-600">
                Relive the magical moments from our inaugural Yoga in the Park Nairobi event. 
                A day filled with wellness, community, and transformation.
              </p>
              <span className="inline-block px-3 py-1 bg-secondary text-white rounded mt-4">
                June 2024 • TuWork Nairobi
              </span>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {galleryItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMedia(item.src)}
                >
                  <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-secondary">📷</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <span className="text-6xl text-secondary">▶️</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs text-white ${
                        item.type === 'video' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {item.type === 'video' ? 'Video' : 'Photo'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Stats */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Edition 1 Highlights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-secondary">150+</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">6</div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">3</div>
                  <div className="text-sm text-gray-600">Expert Instructors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">8hrs</div>
                  <div className="text-sm text-gray-600">of Wellness</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready for Edition 2?</h3>
            <p className="text-gray-600 mb-6">
              Join us for our next transformative wellness experience
            </p>
            <div className="space-x-4">
              <Link href="/events" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                Get Your Tickets
              </Link>
              <Link href="/gallery-edition-2" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                View Edition 2 Gallery
              </Link>
            </div>
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryEdition1;