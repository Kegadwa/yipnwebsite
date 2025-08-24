import React from 'react';
import { FaUserTie, FaQuoteLeft, FaUserGraduate, FaUsers, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Instructors = () => {
  const instructors = [
    {
      id: 1,
      name: "Sarah Kamau",
      style: "Vinyasa Flow",
      bio: "Certified yoga instructor with 8+ years of experience in dynamic flow sequences and mindfulness practices."
    },
    {
      id: 2,
      name: "David Ochieng",
      style: "Hatha Yoga",
      bio: "Traditional Hatha yoga practitioner specializing in alignment, breathing techniques, and meditation."
    },
    {
      id: 3,
      name: "Grace Wanjiku",
      style: "Restorative Yoga",
      bio: "Wellness expert focused on gentle, healing practices for stress relief and deep relaxation."
    }
  ];

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
            Our Instructors
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Meet the passionate and experienced wellness professionals who guide our YIPN community on their journey to health and mindfulness.
          </p>
        </div>
      </section>
      
      			<main className="flex-1">
				<div className="container mx-auto px-4 py-16">
					{/* Header */}
					<div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">Our Team</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Meet Our Instructors
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our experienced and passionate instructors bring diverse styles and deep wisdom to guide 
            you on your wellness journey. Each brings their unique approach to create transformative experiences.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <FaUserTie className="text-4xl text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{instructor.name}</h3>
                  <p className="text-secondary font-medium mb-4">
                    {instructor.style}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {instructor.bio}
                  </p>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Our Team */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="bg-white rounded-lg shadow-lg p-12 bg-gradient-to-r from-blue-50 to-orange-50">
            <h3 className="text-2xl font-bold mb-4">Want to Join Our Instructor Team?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're always looking for passionate, certified yoga instructors and wellness practitioners 
              who share our vision of creating transformative community experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                Apply to Teach
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Learn About Requirements
              </button>
            </div>
          </div>
        </div>

        {/* Instructor Spotlight */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Instructor Spotlight</h3>
              <p className="text-gray-600 mb-6">
                Featured wisdom from our teaching community
              </p>
              <FaQuoteLeft className="text-4xl text-secondary mb-4" />
              <p className="text-lg italic text-gray-800 mb-4">
                Teaching yoga isn't just about guiding poses - it's about holding space for transformation, 
                creating community, and helping each student discover their own inner wisdom and strength.
              </p>
              <p className="text-gray-600">- Sarah Kamau, Lead Instructor</p>
            </div>
          </div>
        </div>
				</div>
			</main>
      <Footer />
    </div>
  );
};

export default Instructors;