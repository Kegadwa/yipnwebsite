import React from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Testimonials = () => {
  // Simple mock data
  const mockTestimonials = [
    {
      id: 1,
      quote: "YIPN has completely transformed my approach to wellness. The community energy is incredible!",
      attendeeName: "Sarah Kamau",
      date: "2024-01-15"
    },
    {
      id: 2,
      quote: "Practicing yoga in the park surrounded by nature is a truly magical experience.",
      attendeeName: "Michael Ochieng",
      date: "2024-01-10"
    },
    {
      id: 3,
      quote: "The instructors are amazing and the atmosphere is so welcoming for beginners.",
      attendeeName: "Grace Wanjiku",
      date: "2024-01-08"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative py-32 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Community Stories
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Hear from our YIPN community members about their transformative experiences and wellness journeys.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">Community Voices</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Our Community Says
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from fellow wellness seekers about their transformative experiences 
              with Yoga in the Park Nairobi. These stories inspire us to continue creating 
              meaningful spaces for growth and connection.
            </p>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl text-white">👥</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">300+</p>
                <p className="text-sm text-gray-600">Happy Participants</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl text-white">⭐</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">4.9</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl text-white">💖</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">95%</p>
                <p className="text-sm text-gray-600">Would Recommend</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl text-white">📅</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">6</p>
                <p className="text-sm text-gray-600">Events Hosted</p>
              </div>
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center bg-gradient-to-r from-blue-50 to-orange-50">
              <span className="text-5xl text-secondary mx-auto mb-6 block">💬</span>
              <blockquote className="text-xl md:text-2xl italic text-gray-800 mb-6 leading-relaxed">
                "{mockTestimonials[0].quote}"
              </blockquote>
              <div className="flex items-center justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-500 text-2xl">⭐</span>
                ))}
              </div>
              <p className="font-semibold text-gray-800 text-lg">{mockTestimonials[0].attendeeName}</p>
              <p className="text-gray-600 text-sm">
                {new Date(mockTestimonials[0].date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                More Stories from Our Community
              </h2>
              <p className="text-gray-600">
                Every story is unique, every journey is personal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockTestimonials.slice(1).map((testimonial, index) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-500 text-lg">⭐</span>
                      ))}
                    </div>
                    <blockquote className="text-gray-600 italic mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.attendeeName}</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-secondary/20 text-2xl">💬</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories of Feedback */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What People Love Most
              </h2>
              <p className="text-gray-600">
                Common themes from our community feedback
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Community Connection",
                  description: "The warm, welcoming atmosphere and genuine connections formed",
                  icon: "👥",
                  percentage: "92%"
                },
                {
                  title: "Expert Instruction",
                  description: "High-quality guidance from experienced, passionate instructors",
                  icon: "⭐",
                  percentage: "96%"
                },
                {
                  title: "Peaceful Setting",
                  description: "Beautiful natural environments that enhance the wellness experience",
                  icon: "💖",
                  percentage: "98%"
                }
              ].map((category, index) => (
                <div key={category.title} className="bg-white rounded-lg shadow-lg text-center">
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl text-white">{category.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                    <div className="text-3xl font-bold text-secondary mb-4">{category.percentage}</div>
                    <p className="leading-relaxed text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Your Story CTA */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <span className="text-6xl text-secondary mx-auto mb-6 block">💬</span>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Share Your YIPN Story</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have you experienced transformation through YIPN? We'd love to hear about your journey 
                and how our wellness community has impacted your life. Your story might inspire others 
                to begin their own wellness path.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                  Submit Your Story
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Join Our Next Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;