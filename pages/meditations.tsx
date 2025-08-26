import React, { useState } from 'react';
import { FaHeadphones, FaCheck, FaPlay, FaHeart, FaStar, FaSpotify, FaMusic, FaYoutube } from 'react-icons/fa';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Meditations = () => {
  // Removed access gate - Spotify content is now directly accessible

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
            
            {/* Welcome Message */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaCheck className="text-5xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Your Meditation Library
              </h2>
              <p className="text-lg text-gray-600">
                Access our curated collection of guided meditation clips. 
                Find a quiet space, put on your headphones, and let these practices guide you to inner peace.
              </p>
            </div>

                {/* Spotify Playlist Section */}
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaSpotify className="text-4xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Power and Stillness Playlist</h3>
                      <p className="text-gray-600 mb-6">
                        Curated by YIPN for your wellness journey. Perfect for meditation, yoga practice, or simply finding peace in your day.
                      </p>
                      <a 
                        href="https://open.spotify.com/playlist/665ZxCr1f2xJxN6tUeTx68?si=8Fnyd-2sQ6-65r8wXMsQTg&pi=ply0Ng4ZSE6YM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                      >
                        <FaSpotify className="mr-2" />
                        Listen on Spotify
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Featured Tracks</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <FaMusic className="mr-2 text-green-500" />
                            There Will Be No Crying - Cleo Sol
                          </li>
                          <li className="flex items-center">
                            <FaMusic className="mr-2 text-green-500" />
                            Eternal Sunshine - Jhené Aiko
                          </li>
                          <li className="flex items-center">
                            <FaMusic className="mr-2 text-green-500" />
                            Unmoved - Ayoni
                          </li>
                          <li className="flex items-center">
                            <FaMusic className="mr-2 text-green-500" />
                            Home with you - FKA twigs
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-3">Playlist Details</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <FaStar className="mr-2 text-yellow-500" />
                            1 hour 34 minutes
                          </li>
                          <li className="flex items-center">
                            <FaStar className="mr-2 text-yellow-500" />
                            Curated by YIPN Team
                          </li>
                          <li className="flex items-center">
                            <FaStar className="mr-2 text-yellow-500" />
                            Perfect for meditation
                          </li>
                          <li className="flex items-center">
                            <FaStar className="mr-2 text-yellow-500" />
                            Updated regularly
                          </li>
                        </ul>
                      </div>
                    </div>
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
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Find a quiet, comfortable space where you won&apos;t be disturbed
                            </li>
                            <li className="flex items-start">
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Use headphones for the best audio experience
                            </li>
                            <li className="flex items-start">
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Sit comfortably with your spine naturally straight
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">During Practice</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Allow thoughts to come and go without judgment
                            </li>
                            <li className="flex items-start">
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Return attention gently to the guidance when mind wanders
                            </li>
                            <li className="flex items-start">
                              <FaStar className="mr-2 text-yellow-500 mt-1" />
                              Focus on the experience rather than expectations
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More Content CTA */}
                <div className="max-w-4xl mx-auto text-center">
                  <div className="bg-white rounded-lg shadow-lg p-12 bg-gradient-to-r from-blue-50 to-orange-50">
                    <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                      <FaHeadphones className="text-5xl text-white" />
                    </div>
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