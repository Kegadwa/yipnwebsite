import React, { useState, useEffect } from "react";
import { FaPen, FaSave, FaDownload, FaPrint, FaHeart, FaLeaf, FaSun, FaMoon, FaStar, FaQuoteLeft, FaQuoteRight, FaUser, FaEnvelope, FaPhone, FaCloud, FaCloudRain, FaWind, FaRegSun, FaRegMoon } from "react-icons/fa";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface JournalEntry {
  id: string;
  date: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  answers: { [key: string]: string };
  mood: string;
  weather: string;
  gratitude: string[];
}

const journalQuestions = [
  "How has today's session influenced your thoughts or emotions?",
  "What positive energy did you feel during the event?",
  "List three things you're grateful for after the wellness activities.",
  "Did you experience a moment of clarity or peace?",
  "How has your perspective shifted?",
  "What intentions would you like to set moving forward?",
  "How did the sound healing resonate with you?",
  "What small changes can you make to maintain this feeling of wellness?",
  "What support do you appreciate from those around you?",
  "How did today's practices help you connect with yourself?",
  "What's one insight from today that you want to carry into your daily life?",
  "How can you integrate gratitude into your wellness routine?"
];

const moodOptions = [
  { value: "peaceful", label: "Peaceful", icon: FaLeaf, color: "from-green-400 to-blue-400" },
  { value: "energized", label: "Energized", icon: FaSun, color: "from-yellow-400 to-orange-400" },
  { value: "grateful", label: "Grateful", icon: FaHeart, color: "from-pink-400 to-purple-400" },
  { value: "centered", label: "Centered", icon: FaStar, color: "from-indigo-400 to-purple-400" },
  { value: "refreshed", label: "Refreshed", icon: FaLeaf, color: "from-emerald-400 to-teal-400" },
  { value: "inspired", label: "Inspired", icon: FaStar, color: "from-amber-400 to-yellow-400" }
];

const weatherOptions = [
  { value: "sunny", label: "Sunny", icon: FaRegSun },
  { value: "cloudy", label: "Cloudy", icon: FaCloud },
  { value: "rainy", label: "Rainy", icon: FaCloudRain },
  { value: "clear", label: "Clear", icon: FaRegMoon },
  { value: "breezy", label: "Breezy", icon: FaWind }
];

export default function Journal() {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    userDetails: {
      name: "",
      email: "",
      phone: ""
    },
    answers: {},
    mood: "peaceful",
    weather: "sunny",
    gratitude: ["", "", ""]
  });
  
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'past'>('today');
  const [showInspiration, setShowInspiration] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

  const wellnessQuotes = [
    "Gratitude turns what we have into enough.",
    "Peace comes from within. Do not seek it without.",
    "The present moment is filled with joy and happiness.",
    "Every breath is a new beginning.",
    "Wellness is not a destination, it's a way of life.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "Your body hears everything your mind says.",
    "The only way to do great work is to love what you do.",
    "Happiness is not something ready-made. It comes from your own actions.",
    "Life is not about waiting for the storm to pass but learning to dance in the rain."
  ];

  useEffect(() => {
    // Load saved entries from localStorage
    const saved = localStorage.getItem('yipn-journal-entries');
    if (saved) {
      setSavedEntries(JSON.parse(saved));
    }
    
    // Load current entry from localStorage if exists
    const current = localStorage.getItem('yipn-current-entry');
    if (current) {
      setCurrentEntry(JSON.parse(current));
    }
    
    // Set random quote
    setCurrentQuote(wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)]);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (currentEntry.userDetails.name || currentEntry.userDetails.email || currentEntry.userDetails.phone || Object.keys(currentEntry.answers).length > 0 || currentEntry.gratitude.some(item => item.trim())) {
        localStorage.setItem('yipn-current-entry', JSON.stringify(currentEntry));
        setAutoSaveStatus("Auto-saved");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [currentEntry]);

  const handleUserDetailChange = (field: keyof typeof currentEntry.userDetails, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        [field]: value
      }
    }));
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer
      }
    }));
  };

  const handleGratitudeChange = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude.map((item, i) => i === index ? value : item)
    }));
  };

  const saveEntry = () => {
    if (!currentEntry.userDetails.name || !currentEntry.userDetails.email) {
      alert("Please provide your name and email to save your journal entry.");
      return;
    }

    const entryToSave = { ...currentEntry, id: Date.now().toString() };
    const updatedEntries = [entryToSave, ...savedEntries];
    setSavedEntries(updatedEntries);
    localStorage.setItem('yipn-journal-entries', JSON.stringify(updatedEntries));
    
    // Clear current entry from localStorage
    localStorage.removeItem('yipn-current-entry');
    
    // Reset current entry
    setCurrentEntry({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      userDetails: {
        name: "",
        email: "",
        phone: ""
      },
      answers: {},
      mood: "peaceful",
      weather: "sunny",
      gratitude: ["", "", ""]
    });
    
    alert("Journal entry saved successfully! 🌸");
  };

                const downloadAsPDF = async () => {
      try {
        // Create a temporary div to render the journal content
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.padding = '40px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.color = '#333';
        tempDiv.style.lineHeight = '1.6';
        
        // Create the journal content
        tempDiv.innerHTML = `
          <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; border-radius: 20px;">
            <h1 style="font-size: 2.5em; margin: 0 0 10px 0; font-weight: bold;">🌸 YIPN Wellness Journal</h1>
            <p style="font-size: 1.2em; margin: 0; opacity: 0.9;">Your Personal Wellness Reflection Journey</p>
            <p style="font-size: 1.2em; margin: 0; opacity: 0.9;"><strong>Date:</strong> ${new Date(currentEntry.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 30px; border-left: 5px solid #10b981;">
            <h3 style="color: #10b981; margin-top: 0; font-size: 1.3em;">👤 Personal Information</h3>
            <p style="margin: 8px 0; font-size: 1.1em;"><strong>Name:</strong> ${currentEntry.userDetails.name || 'Not provided'}</p>
            <p style="margin: 8px 0; font-size: 1.1em;"><strong>Email:</strong> ${currentEntry.userDetails.email || 'Not provided'}</p>
            <p style="margin: 8px 0; font-size: 1.1em;"><strong>Phone:</strong> ${currentEntry.userDetails.phone || 'Not provided'}</p>
          </div>

          <h2 style="color: #10b981; text-align: center; margin: 40px 0 30px 0;">📝 Wellness Reflections</h2>
          
          ${journalQuestions.map((question, index) => `
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 4px solid #10b981;">
              <h4 style="color: #1f2937; margin-top: 0; font-size: 1.1em; font-weight: 600;">${index + 1}. ${question}</h4>
              <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 3px solid #3b82f6;">
                ${currentEntry.answers[index] || 'No response provided'}
              </div>
            </div>
          `).join('')}

          <div style="text-align: center; margin-top: 40px; padding: 20px; color: #6b7280; font-size: 0.9em;">
            <p>Generated by YIPN Wellness Community</p>
            <p>Keep nurturing your wellness journey! 🌱</p>
          </div>
        `;
        
        // Add to DOM temporarily
        document.body.appendChild(tempDiv);
        
        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        // Remove temporary div
        document.body.removeChild(tempDiv);
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Create filename with person's name
        const personName = currentEntry.userDetails.name || 'Anonymous';
        const cleanName = personName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const filename = `${cleanName}_Wellness_Reflection_Journal.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating your PDF. Please try again.');
      }
    };

  const printJournal = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative z-10 text-center text-foreground px-4">
          <div className="mb-6">
            <FaLeaf className="text-6xl text-green-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Wellness Reflection Journal
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
              Document your wellness journey, reflect on your experiences, and cultivate gratitude
            </p>
          </div>
          
          {/* Daily Quote */}
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <FaQuoteLeft className="text-2xl text-secondary mx-auto mb-2" />
            <p className="text-lg italic text-foreground mb-2">{currentQuote}</p>
            <FaQuoteRight className="text-2xl text-secondary ml-auto" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'today'
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Today's Reflection
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Past Entries
            </button>
          </div>
        </div>

        {activeTab === 'today' ? (
          /* Today's Journal Entry */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Today's Wellness Reflection
                </h2>
                <p className="text-muted-foreground">
                  Take a moment to reflect on your wellness journey and experiences
                </p>
                {autoSaveStatus && (
                  <div className="mt-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    {autoSaveStatus} ✓
                  </div>
                )}
              </div>

              {/* User Details Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <FaUser className="text-blue-600 mr-2" />
                  Personal Information
                </h3>
                <p className="text-muted-foreground mb-4">
                  Please provide your details so you can retrieve your journal entry if you accidentally leave the page.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={currentEntry.userDetails.name}
                      onChange={(e) => handleUserDetailChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={currentEntry.userDetails.email}
                      onChange={(e) => handleUserDetailChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={currentEntry.userDetails.phone}
                      onChange={(e) => handleUserDetailChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>



              {/* Journal Questions */}
              <div className="space-y-6 mb-8">
                {journalQuestions.map((question, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      {index + 1}. {question}
                    </label>
                    <textarea
                      value={currentEntry.answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Share your thoughts and reflections..."
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              

                             {/* Action Buttons */}
               <div className="flex justify-center">
                 <button
                   onClick={downloadAsPDF}
                   className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                 >
                   <FaDownload className="w-5 h-5" />
                   <span>Download My Journal</span>
                 </button>
               </div>
            </div>
          </div>
        ) : (
          /* Past Entries */
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your Wellness Journey
              </h2>
              <p className="text-muted-foreground">
                Reflect on your past entries and see how far you've come
              </p>
            </div>

            {savedEntries.length === 0 ? (
              <div className="text-center py-12">
                <FaLeaf className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No entries yet</h3>
                <p className="text-muted-foreground">
                  Start your wellness journaling journey by creating your first entry
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEntries.map((entry) => {
                  const MoodIcon = moodOptions.find(m => m.value === entry.mood)?.icon || FaLeaf;
                  const WeatherIcon = weatherOptions.find(w => w.value === entry.weather)?.icon || FaRegSun;
                  
                  return (
                    <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <MoodIcon className="w-5 h-5 text-secondary" />
                          <WeatherIcon className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-foreground mb-3">
                        {moodOptions.find(m => m.value === entry.mood)?.label} Day
                      </h4>
                      
                      {entry.userDetails.name && (
                        <p className="text-sm text-muted-foreground mb-3">
                          By: {entry.userDetails.name}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        {entry.gratitude.filter(item => item.trim()).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <FaStar className="text-yellow-500 w-3 h-3" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {Object.keys(entry.answers).length} questions answered
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspiration Modal */}
      {showInspiration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <div className="text-center">
              <FaSun className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Daily Wellness Inspiration
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {currentQuote}
              </p>
              <button
                onClick={() => setShowInspiration(false)}
                className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
