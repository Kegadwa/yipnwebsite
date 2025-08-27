import React, { useState } from "react";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaCheck, FaShare, FaCheckCircle, FaComments, FaCamera, FaHandshake, FaCalendar, FaEnvelopeOpen, FaMapMarkedAlt } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";

export default function Community() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const socialLinks = [
    { name: 'Instagram', handle: '@yogaintheparknairobi', url: 'https://instagram.com/yogaintheparknairobi' },
    { name: 'Facebook', handle: '@yogaintheparknairobi', url: 'https://facebook.com/yogaintheparknairobi' },
    { name: 'Twitter', handle: '@yipnairobi', url: 'https://twitter.com/yipnairobi' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Join Our Community
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in fade-in-delay-200 opacity-90">
              Connect with fellow wellness enthusiasts, share experiences, and be part of Nairobi&apos;s most vibrant yoga community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in fade-in-delay-400">
              <a 
                href="https://chat.whatsapp.com/BOpAhahjb834DLsnirdxax?mode=ems_copy_c&fbclid=PAZXh0bgNhZW0CMTEAAadXQg7u2t3CdxMK9aPyr_Yx_l-q5mo4C6u2clEj1lkdcfy_P_D25PAnzFJ8Ag_aem_ZX4GMlmRM5prmci1JSYmSQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl animate-on-hover"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span>Join WhatsApp Community</span>
              </a>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">20+</p>
                <p className="text-sm text-gray-600">WhatsApp Members</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-2xl text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gray-800">1</p>
                <p className="text-sm text-gray-600">Event Hosted</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-wellness rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-2xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">1</p>
                <p className="text-sm text-gray-600">Upcoming Event</p>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Community Section */}
        <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
                Join Our WhatsApp Community
              </h2>
              <p className="text-xl mb-8 animate-slide-up slide-up-delay-200 opacity-90">
                Connect with fellow yogis, get event updates, share experiences, and be part of our growing wellness family.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4">What You&apos;ll Get:</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-green-500" />
                      <span>Event announcements and early bird tickets</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-green-500" />
                      <span>Weekly wellness tips and mindfulness practices</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-green-500" />
                      <span>Community highlights and member stories</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-green-500" />
                      <span>Exclusive content and guided meditations</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-green-500" />
                      <span>Direct access to instructors and organizers</span>
                    </li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4">Community Features:</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center space-x-3">
                      <FaComments className="text-2xl text-blue-500" />
                      <span>Real-time chat with community members</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCamera className="text-2xl text-purple-500" />
                      <span>Share photos and videos from sessions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaHandshake className="text-2xl text-orange-500" />
                      <span>Find yoga buddies and practice partners</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCalendar className="text-2xl text-red-500" />
                      <span>Coordinate meetups and practice sessions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FaCheckCircle className="text-2xl text-indigo-500" />
                      <span>Get personalized recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
              <a 
                href="https://chat.whatsapp.com/BOpAhahjb834DLsnirdxax?mode=ems_copy_c&fbclid=PAZXh0bgNhZW0CMTEAAadXQg7u2t3CdxMK9aPyr_Yx_l-q5mo4C6u2clEj1lkdcfy_P_D25PAnzFJ8Ag_aem_ZX4GMlmRM5prmci1JSYmSQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl animate-on-hover"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span>Join WhatsApp Community Now</span>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-6">
                  We&apos;d love to hear from you. Reach out with any questions or just to say hello!
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <FaEnvelopeOpen className="text-2xl text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <p className="text-gray-600">info@yogaintheparknairobi.com</p>
                      <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <FaPhone className="text-2xl text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <p className="text-gray-600">+254 700 000 000</p>
                      <p className="text-sm text-gray-500">Monday to Friday, 9 AM - 6 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <FaMapMarkedAlt className="text-2xl text-red-500 mt-1" />
                    <div>
                      <p className="font-semibold">Find Us</p>
                      <p className="text-gray-600">TuWork Nairobi</p>
                      <p className="text-gray-600">Nairobi, Kenya</p>
                      <p className="text-sm text-gray-500">Our main event location</p>
                    </div>
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