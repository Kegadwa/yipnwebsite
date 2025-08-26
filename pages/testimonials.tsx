import React, { useState, useEffect } from 'react';
import { FaUsers, FaStar, FaHeart, FaCalendar, FaComment, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

interface Testimonial {
  id: string;
  quote: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  rating: number;
  date: Date;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    quote: '',
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    rating: 5
  });

  // TODO: Replace with actual database fetch
  // No mock data - testimonials will be loaded from database

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firebase fetch
      // For now, no testimonials will be shown until database is connected
      setTestimonials([]);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement actual Firebase save
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        ...formData,
        date: new Date(),
        isApproved: false, // Requires admin approval
        createdAt: new Date()
      };
      
      // For now, just add to local state
      setTestimonials(prev => [...prev, newTestimonial]);
      setShowAddForm(false);
      setFormData({
        quote: '',
        attendeeName: '',
        attendeeEmail: '',
        attendeePhone: '',
        rating: 5
      });
      
      alert('Thank you for sharing your story! Your testimonial will be reviewed and published soon.');
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Failed to submit testimonial. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
                  <FaUsers className="text-3xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">300+</p>
                <p className="text-sm text-gray-600">Happy Participants</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaStar className="text-3xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">4.9</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaHeart className="text-3xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">95%</p>
                <p className="text-sm text-gray-600">Would Recommend</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaCalendar className="text-3xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">6</p>
                <p className="text-sm text-gray-600">Events Hosted</p>
              </div>
            </div>
          </div>

          {/* Featured Testimonial */}
          {testimonials.length > 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white rounded-lg shadow-lg p-12 text-center bg-gradient-to-r from-blue-50 to-orange-50">
                <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FaComment className="text-4xl text-white" />
                </div>
                <blockquote className="text-xl md:text-2xl italic text-gray-800 mb-6 leading-relaxed">
                  &quot;{testimonials[0].quote}&quot;
                </blockquote>
                <div className="flex items-center justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-2xl">
                      <FaStar className={star <= testimonials[0].rating ? "text-yellow-500" : "text-gray-300"} />
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-gray-800 text-lg">{testimonials[0].attendeeName}</p>
                <p className="text-gray-600 text-sm">
                  {testimonials[0].date.toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading testimonials...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.slice(1).map((testimonial, index) => (
                  <div key={testimonial.id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-500 text-lg">
                            <FaStar className={star <= testimonial.rating ? "text-yellow-500" : "text-gray-300"} />
                          </span>
                        ))}
                      </div>
                      <blockquote className="text-gray-600 italic mb-6 leading-relaxed">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{testimonial.attendeeName}</p>
                          <p className="text-gray-600 text-sm">
                            {testimonial.date.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-secondary/20 text-2xl">
                          <FaComment />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  icon: FaUsers,
                  percentage: "92%"
                },
                {
                  title: "Expert Instruction",
                  description: "High-quality guidance from experienced, passionate instructors",
                  icon: FaStar,
                  percentage: "96%"
                },
                {
                  title: "Peaceful Setting",
                  description: "Beautiful natural environments that enhance the wellness experience",
                  icon: FaHeart,
                  percentage: "98%"
                }
              ].map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={category.title} className="bg-white rounded-lg shadow-lg text-center">
                    <div className="p-8">
                      <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                        <Icon className="text-3xl text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                      <div className="text-3xl font-bold text-secondary mb-4">{category.percentage}</div>
                      <p className="leading-relaxed text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Share Your Story CTA */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaComment className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Share Your YIPN Story</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have you experienced transformation through YIPN? We&apos;d love to hear about your journey 
                and how our wellness community has impacted your life. Your story might inspire others 
                to begin their own wellness path.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Your Story
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Join Our Next Event
                </button>
              </div>
            </div>
          </div>

          {/* Add Testimonial Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">Share Your Story</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close modal"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <form onSubmit={handleSubmitTestimonial} className="p-6 space-y-6">
                  <div>
                    <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Story *
                    </label>
                    <textarea
                      id="quote"
                      value={formData.quote}
                      onChange={(e) => handleInputChange('quote', e.target.value)}
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us about your experience with YIPN..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="attendeeName" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="attendeeName"
                        value={formData.attendeeName}
                        onChange={(e) => handleInputChange('attendeeName', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="attendeeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="attendeeEmail"
                        value={formData.attendeeEmail}
                        onChange={(e) => handleInputChange('attendeeEmail', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="attendeePhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="attendeePhone"
                      value={formData.attendeePhone}
                      onChange={(e) => handleInputChange('attendeePhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange('rating', star)}
                          className={`text-2xl ${
                            star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                    >
                      Submit Story
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;