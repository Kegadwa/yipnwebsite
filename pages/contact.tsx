import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative py-32 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Have questions about our events, want to join our community, or need support? We&apos;d love to hear from you.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-6 text-primary">Contact Us</h1>
          <p className="text-lg text-gray-700 mb-8">
            Reach out to YIPN for event inquiries, collaborations, or general questions.
          </p>
          <form className="max-w-lg mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded border border-gray-300"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded border border-gray-300"
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded border border-gray-300"
              rows={5}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 rounded bg-primary text-white font-semibold hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
