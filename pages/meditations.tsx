import React, { useState } from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Meditations = () => {
  const [email, setEmail] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setHasAccess(true);
      // Here you would typically verify email and grant access
      console.log('Meditation access granted to:', email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative py-32 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Guided Meditations
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Find peace and clarity with our curated collection of guided meditations designed to support your wellness journey.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        {/* Main Content */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4">
            
            {!hasAccess ? (
              /* Access Gate */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="text-center p-8">
                    <span className="text-6xl mb-4 block">🎧</span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Unlock Free Meditation Access</h2>
                    <p className="text-lg text-gray-600 mb-6">
                      Enter your email to access our collection of guided meditation clips. 
                      No cost - just a simple way for us to share these peaceful moments with you.
                    </p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleAccessSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <button type="submit" className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                        Access Meditation Clips
                      </button>
                    </form>
                    
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-semibold mb-2">What you&apos;ll get access to:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✅</span>
                          10-minute morning mindfulness meditation
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✅</span>
                          Evening stress relief session
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✅</span>
                          Breathing exercises for anxiety relief
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✅</span>
                          Body scan relaxation practices
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Welcome Message */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                  <span className="text-6xl mb-4 block">✅</span>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Your Meditation Library
                  </h2>
                  <p className="text-lg text-gray-600">
                    You now have access to our curated collection of guided meditation clips. 
                    Find a quiet space, put on your headphones, and let these practices guide you to inner peace.
                  </p>
                </div>

                {/* Meditation Clips */}
                <div className="max-w-6xl mx-auto mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { id: '1', title: 'Morning Mindfulness', description: 'Start your day with clarity and intention', duration: '10 min' },
                      { id: '2', title: 'Evening Relaxation', description: 'Wind down and release daily stress', duration: '15 min' },
                      { id: '3', title: 'Breathing Exercises', description: 'Simple techniques for anxiety relief', duration: '8 min' },
                      { id: '4', title: 'Body Scan', description: 'Progressive relaxation through awareness', duration: '12 min' }
                    ].map((clip, index) => (
                      <div key={clip.id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative group cursor-pointer">
                          <div className="text-center">
                            <span className="text-6xl mb-2 block">▶️</span>
                            <p className="text-sm text-gray-500">Click to Play</p>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-primary/80 text-white px-2 py-1 rounded text-xs flex items-center">
                            <span className="mr-1">⏱️</span>
                            {clip.duration}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{clip.title}</h3>
                          <p className="mb-4 leading-relaxed text-gray-600">
                            {clip.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="flex-1 mr-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                              <span className="mr-2">▶️</span>
                              Play Meditation
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                              <span>💖</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meditation Tips */}
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="bg-white rounded-lg shadow-lg">
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Getting the Most from Your Practice</h3>
                      <p className="text-gray-600 mb-6">
                        Simple tips to enhance your meditation experience
                      </p>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Before You Begin</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Find a quiet, comfortable space where you won&apos;t be disturbed
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Use headphones for the best audio experience
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Sit comfortably with your spine naturally straight
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">During Practice</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Allow thoughts to come and go without judgment
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Return attention gently to the guidance when mind wanders
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-yellow-500">⭐</span>
                              Focus on the experience rather than expectations
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* More Content CTA */}
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white rounded-lg shadow-lg p-12 bg-gradient-to-r from-blue-50 to-orange-50">
                  <span className="text-6xl mb-6 block">🎧</span>
                  <h3 className="text-2xl font-bold mb-4">Join Us for Live Sessions</h3>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    While these recorded clips offer convenience, nothing compares to the energy of live, 
                    guided meditation in community. Join us at YIPN events for deeper, shared experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                      View Upcoming Events
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Learn About Our Instructors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  };

  export default Meditations;