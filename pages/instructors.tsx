import React from 'react';
import { FaUserTie, FaQuoteLeft, FaUserGraduate, FaUsers, FaEnvelope, FaInfoCircle, FaInstagram, FaGlobe, FaStar, FaAward, FaHeart } from 'react-icons/fa';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

const Instructors = () => {
  const instructors = [
    {
      id: 1,
      name: "Zep Ouma",
      fullName: "Zepline Ouma",
      nickname: "Zep",
      style: "Vinyasa, Yin Yang, Prenatal & Postnatal Yoga, Breathwork, Meditation, Kids Yoga",
      location: "Nairobi, Kenya",
      bio: "Zep—full name Zepline Ouma and affectionately known as \"Zep\"—is a certified yoga teacher and wellness guide based in Nairobi, Kenya. Her approach blends fluid movement with mindful awareness, offering a nurturing space for both body and mind to grow.",
      specialties: [
        "Vinyasa, Yin Yang, Prenatal & Postnatal Yoga",
        "Breathwork, Meditation, and Kids Yoga"
      ],
      level: "All levels—beginner through intermediate",
      description: "Her classes accommodate all levels—beginner through intermediate—and are designed to be active, engaging, and transformational.",
      qualifications: "Zep holds certifications, including Anjali Breathwork, demonstrating a deep investment in both movement and mindful healing.",
      mantra: "A comfort zone is a beautiful place but nothing ever grows.",
      mantraSource: "— a testament to her credo of encouraging others to step into growth through wellness.",
      career: [
        "Founder of Zouma Yoga Studio and Reset Yoga Retreat—spaces committed to fostering holistic wellness and restorative experiences.",
        "A recognized wellness coach, guiding clients toward physical, emotional, and mental wellbeing."
      ],
      social: {
        instagram: "@resetyogaretreat and @zouma_garden_yoga",
        followers: "8.2K+ followers"
      },
      highlights: [
        "Featured instructor at Yoga in the Park Nairobi, Edition One",
        "Guided participants through sessions in Pilates, yoga, and meditation",
        "Contributed to the event's success and was explicitly acknowledged"
      ],
      quote: "Yoga in the Park Nairobi Edition One could not have been a success without you!"
    },
    {
      id: 2,
      name: "Candy Ndeti",
      fullName: "Candy Ndeti",
      style: "Yoga, Pilates, Wellness",
      location: "Nairobi, Kenya",
      bio: "Candy Ndeti is a dedicated yoga teacher based in Nairobi, whose journey with yoga began in early 2017 when a friend introduced her to the practice. Over time, yoga became deeply meaningful to her and transformed her approach to well-being.",
      journey: "Her yoga journey began in early 2017 and has transformed her approach to well-being.",
      media: [
        "Featured on TV47 Kenya's Body Garage, leading viewers through the many benefits of yoga",
        "Shared her love for yoga in a segment by Talents of Nairobi, emphasizing how the practice has shaped her life"
      ],
      social: {
        instagram: "@candyndeti",
        content: "Posts about yoga sessions, flows, and the joy she finds in teaching"
      },
      events: [
        "Active role in Edition 1 of Yoga in the Park Nairobi, delivering dynamic Pilates sessions",
        "Set to appear at Yoga in the Park Edition 2 (30 August 2025), leading beginner-friendly yoga classes"
      ],
      approach: "Offers accessible and welcoming introduction to yoga for newcomers"
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
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {instructors.map((instructor, index) => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                  {/* Instructor Header */}
                  <div className="text-center mb-8">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 mx-auto mb-6 flex items-center justify-center">
                      <FaUserTie className="text-5xl text-secondary" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{instructor.name}</h3>
                    {instructor.nickname && (
                      <p className="text-lg text-secondary font-medium mb-2">"{instructor.nickname}"</p>
                    )}
                    <p className="text-secondary font-medium mb-2">
                      {instructor.style}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <FaGlobe className="inline mr-2" />
                      {instructor.location}
                    </p>
                  </div>

                  {/* Bio Section */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {instructor.bio}
                    </p>
                    {instructor.journey && (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {instructor.journey}
                      </p>
                    )}
                  </div>

                  {/* Specialties */}
                  {instructor.specialties && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaStar className="text-secondary mr-2" />
                        Specializes in:
                      </h4>
                      <ul className="space-y-2">
                        {instructor.specialties.map((specialty, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Level & Description */}
                  {instructor.level && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaUsers className="text-secondary mr-2" />
                        Class Levels
                      </h4>
                      <p className="text-gray-700 mb-2 font-medium">{instructor.level}</p>
                      <p className="text-gray-700">{instructor.description}</p>
                    </div>
                  )}

                  {/* Qualifications & Philosophy */}
                  {instructor.qualifications && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaUserGraduate className="text-secondary mr-2" />
                        Qualifications & Philosophy
                      </h4>
                      <p className="text-gray-700 mb-4">{instructor.qualifications}</p>
                      {instructor.mantra && (
                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-lg border-l-4 border-secondary">
                          <blockquote className="italic text-gray-800 font-medium">
                            "{instructor.mantra}"
                          </blockquote>
                          <p className="text-gray-600 text-sm mt-2">{instructor.mantraSource}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Career & Leadership */}
                  {instructor.career && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaAward className="text-secondary mr-2" />
                        Career & Leadership
                      </h4>
                      <ul className="space-y-2">
                        {instructor.career.map((item, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Media Highlights */}
                  {instructor.media && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaInfoCircle className="text-secondary mr-2" />
                        Media Highlights
                      </h4>
                      <ul className="space-y-2">
                        {instructor.media.map((item, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Social Presence */}
                  {instructor.social && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaInstagram className="text-secondary mr-2" />
                        Social Presence
                      </h4>
                      <p className="text-gray-700 mb-2">
                        <strong>Instagram:</strong> {instructor.social.instagram}
                      </p>
                      {instructor.social.followers && (
                        <p className="text-gray-700 mb-2">
                          <strong>Followers:</strong> {instructor.social.followers}
                        </p>
                      )}
                      {instructor.social.content && (
                        <p className="text-gray-700">{instructor.social.content}</p>
                      )}
                    </div>
                  )}

                  {/* Event Highlights */}
                  {instructor.highlights && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaHeart className="text-secondary mr-2" />
                        Event Highlights
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {instructor.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      {instructor.quote && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-400">
                          <blockquote className="italic text-gray-800 font-medium">
                            "{instructor.quote}"
                          </blockquote>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Events */}
                  {instructor.events && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaHeart className="text-secondary mr-2" />
                        Event Engagement
                      </h4>
                      <ul className="space-y-2">
                        {instructor.events.map((event, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Approach */}
                  {instructor.approach && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaHeart className="text-secondary mr-2" />
                        Teaching Approach
                      </h4>
                      <p className="text-gray-700">{instructor.approach}</p>
                    </div>
                  )}

                  {/* Contact Button */}
                  <div className="text-center pt-4">
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Book a Session
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
                We&apos;re always looking for passionate, certified yoga instructors and wellness practitioners 
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
                  Teaching yoga isn&apos;t just about guiding poses - it&apos;s about holding space for transformation, 
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