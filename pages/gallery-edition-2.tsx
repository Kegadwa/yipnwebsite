import React, { useState } from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { FaUpload, FaImage, FaVideo, FaTimes, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

interface UploadedMedia {
  id: string;
  name: string;
  email: string;
  phone: string;
  files: File[];
  timestamp: Date;
}

const GalleryEdition2 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    email: '',
    phone: '',
    files: [] as File[]
  });
  const [isUploading, setIsUploading] = useState(false);

  const upcomingEvent = true; // Toggle this based on event status

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setUploadForm(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));
  };

  const removeFile = (index: number) => {
    setUploadForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.email || !uploadForm.phone || uploadForm.files.length === 0) {
      alert('Please fill in all fields and select at least one file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newMedia: UploadedMedia = {
        id: Date.now().toString(),
        name: uploadForm.name,
        email: uploadForm.email,
        phone: uploadForm.phone,
        files: uploadForm.files,
        timestamp: new Date()
      };

      setUploadedMedia(prev => [newMedia, ...prev]);
      setUploadForm({
        name: '',
        email: '',
        phone: '',
        files: []
      });
      setShowUploadModal(false);
      setIsUploading(false);
      alert('Thank you for sharing your memories! Your photos and videos have been uploaded successfully.');
    }, 2000);
  };

  const resetForm = () => {
    setUploadForm({
      name: '',
      email: '',
      phone: '',
      files: []
    });
  };

  if (upcomingEvent) {
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
              Edition Two Gallery
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
              Experience the evolution of our wellness community through the lens of our second transformative event.
            </p>
            <div className="mt-8">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl animate-on-hover"
              >
                <FaUpload className="w-6 h-6" />
                <span>Share Your Memories</span>
              </button>
            </div>
          </div>
        </section>
        
        <main className="flex-1">
            {/* Header */}
            <section className="py-20 wellness-gradient">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <Link href="/gallery" className="inline-flex items-center space-x-2 text-secondary hover:text-primary mb-6 transition-smooth">
                    <span className="mr-2">←</span>
                    <span>Back to Gallery</span>
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    YIPN™ Edition 2 Gallery
                  </h1>
                  <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-6">
                    📅 Coming Soon - August 30, 2024
                  </span>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
                    <div className="text-6xl mb-4">📸</div>
                    <h2 className="text-2xl font-bold mb-4">Gallery Coming Soon!</h2>
                    <p className="text-gray-600 mb-6">
                      Edition 2 is just around the corner! Once the event takes place, 
                      this gallery will be filled with beautiful moments, inspiring yoga flows, 
                      and the amazing YIPN™ community in action.
                    </p>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      <FaUpload className="w-5 h-5" />
                      <span>Upload Photos & Videos</span>
                    </button>
                  </div>

                  {/* Event Preview */}
                  <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-4">What to Expect at Edition 2</h3>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Vinyasa Flow Yoga</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Mindfulness Meditation</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Pilates Session</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Sound Bath Healing</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Community Networking</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span>Wellness Marketplace</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-x-4">
                    <Link href="/events" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                      Reserve Your Spot
                    </Link>
                    <Link href="/gallery-edition-1" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      View Edition 1 Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Community Uploads Section */}
            {uploadedMedia.length > 0 && (
              <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-4">Community Memories</h2>
                      <p className="text-lg text-muted-foreground">
                        See what our community has been sharing from Edition 2
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploadedMedia.map((media) => (
                        <div key={media.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                                <FaUser className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{media.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {media.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {media.files.map((file, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  {file.type.startsWith('image/') ? (
                                    <FaImage className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <FaVideo className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Sneak Peek Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-8">Preparing for Something Special</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📷</span>
                        </div>
                        <h3 className="font-semibold mb-2">Professional Photography</h3>
                        <p className="text-sm text-gray-600">
                          Capturing every beautiful moment of your wellness journey
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">▶️</span>
                        </div>
                        <h3 className="font-semibold mb-2">Video Highlights</h3>
                        <p className="text-sm text-gray-600">
                          Relive the experience with curated video moments
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="font-semibold mb-2">Live Updates</h3>
                        <p className="text-sm text-gray-600">
                          Follow along on event day for real-time moments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Share Your Edition 2 Memories</h3>
                    <button 
                      onClick={() => {
                        setShowUploadModal(false);
                        resetForm();
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Full Name *</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="text"
                            value={uploadForm.name}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Email Address *</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="email"
                            value={uploadForm.email}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Phone Number *</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="tel"
                          value={uploadForm.phone}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Photos & Videos *</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="space-y-4">
                            <FaUpload className="w-12 h-12 text-muted-foreground mx-auto" />
                            <div>
                              <p className="text-lg font-medium text-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PNG, JPG, GIF, MP4, MOV up to 10MB each
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Selected Files */}
                    {uploadForm.files.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Selected Files:</h4>
                        <div className="space-y-2">
                          {uploadForm.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center space-x-3">
                                {file.type.startsWith('image/') ? (
                                  <FaImage className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <FaVideo className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isUploading || !uploadForm.name || !uploadForm.email || !uploadForm.phone || uploadForm.files.length === 0}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                          isUploading || !uploadForm.name || !uploadForm.email || !uploadForm.phone || uploadForm.files.length === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <FaUpload className="inline mr-2 animate-pulse" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload className="inline mr-2" />
                            Share Memories
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadModal(false);
                          resetForm();
                        }}
                        className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          <Footer />
        </div>
    );
  }

  // This would be the gallery content after the event happens
  const galleryItems = [
    // Gallery items would be populated here after the event
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Gallery content for after the event */}
    </div>
  );
};

export default GalleryEdition2;