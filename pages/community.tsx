import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaUsers, FaCalendarAlt, FaHeart, FaEnvelope, FaCheck, FaShare } from 'react-icons/fa';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Community = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      setIsSubscribed(true);
      // Here you would typically send to your newsletter service
      console.log('Newsletter signup:', { email, name });
    }
  };

  const socialLinks = [
    { icon: <FaInstagram className="text-2xl" />, name: 'Instagram', handle: '@yogaintheparknairobi', url: '#' },
    { icon: <FaFacebook className="text-2xl" />, name: 'Facebook', handle: 'Yoga in the Park Nairobi', url: '#' },
    { icon: <FaTwitter className="text-2xl" />, name: 'Twitter', handle: '@YIPNairobi', url: '#' },
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
            YIPN Community
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Connect with fellow wellness enthusiasts, share your journey, and be part of Nairobi&apos;s vibrant yoga community.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">Connect With Us</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Join Our Community
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Become part of Nairobi&apos;s thriving wellness community. Connect with like-minded individuals, 
              stay updated on events, and embark on a journey of transformation together.
            </p>
          </div>

          {/* Community Stats */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaUsers className="text-2xl text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gray-800">1,200+</p>
                <p className="text-sm text-gray-600">Community Members</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-sm text-gray-600">Events Hosted</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaHeart className="text-2xl text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gray-800">500+</p>
                <p className="text-sm text-gray-600">Lives Touched</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <FaEnvelope className="text-2xl text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gray-800">800+</p>
                <p className="text-sm text-gray-600">Newsletter Subscribers</p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto mb-16">
            {isSubscribed ? (
              <div className="bg-white rounded-lg shadow-lg text-center py-12">
                <FaCheck className="text-6xl mb-6 block text-wellness" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome to the YIPN Community!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you {name}! You&apos;ll receive our newsletter with event updates, 
                  wellness tips, and community highlights.
                </p>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto">
                  <FaShare />
                  Share with Friends
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg">
                <div className="text-center p-8">
                  <FaEnvelope className="text-6xl mb-4 block text-secondary" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Connected</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Join our newsletter for exclusive updates, wellness tips, and early access to events
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
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
                      Join Our Community
                    </button>
                  </form>
                  
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">You&apos;ll receive:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✅</span>
                        Event announcements and early bird tickets
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✅</span>
                        Weekly wellness tips and mindfulness practices
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✅</span>
                        Community highlights and member stories
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-green-500">✅</span>
                        Exclusive content and guided meditations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-6">
                We&apos;d love to hear from you. Reach out with any questions or just to say hello!
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-gray-600">info@yogaintheparknairobi.com</p>
                    <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-gray-600">+254 700 000 000</p>
                    <p className="text-sm text-gray-500">Monday to Friday, 9 AM - 6 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Find Us</p>
                    <p className="text-gray-600">TuWork Nairobi</p>
                    <p className="text-gray-600">Nairobi, Kenya</p>
                    <p className="text-sm text-gray-500">Our main event location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Follow Our Journey</h3>
              <p className="text-gray-600 mb-6">
                Stay connected through our social media channels for daily inspiration and community updates
              </p>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <div key={social.name} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        {social.name === 'Instagram' ? '📸' : social.name === 'Facebook' ? '📘' : '🐦'}
                      </span>
                      <div>
                        <p className="font-semibold">{social.name}</p>
                        <p className="text-sm text-gray-600">{social.handle}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Tag us in your wellness posts with <span className="font-semibold text-secondary">#YIPNairobi</span> 
                    and <span className="font-semibold text-secondary">#FindYourFlow</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Visit Us</h3>
                <p className="text-gray-600 mb-6">
                  Our events are held at beautiful TuWork Nairobi, providing the perfect setting for wellness gatherings
                </p>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">📍</span>
                  <p className="text-lg font-semibold">Interactive Map Coming Soon</p>
                  <p className="text-gray-500">TuWork Nairobi Location</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Get Directions
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

export default Community;