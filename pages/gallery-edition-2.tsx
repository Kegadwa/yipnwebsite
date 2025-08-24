import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { FaUpload, FaImage, FaVideo, FaTimes, FaUser, FaEnvelope, FaPhone, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { galleryService, imageService } from '../lib/firebase-services';

interface UploadedMedia {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'edition-2';
  tags: string[];
  photographer: string;
  photographerEmail: string;
  photographerPhone: string;
  isApproved: boolean;
  createdAt: Date;
}

interface UploadForm {
  name: string;
  email: string;
  phone: string;
  files: File[];
}

const GalleryEdition2 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    name: '',
    email: '',
    phone: '',
    files: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const upcomingEvent = true; // Toggle this based on event status

  // Load existing gallery media on component mount
  useEffect(() => {
    loadGalleryMedia();
  }, []);

  const loadGalleryMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch approved edition-2 media from the database
      const media = await galleryService.getMediaByCategory('edition-2');
      
      // Transform the data to match our interface
      const transformedMedia: UploadedMedia[] = media.map(item => ({
        id: item.id || '',
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        thumbnailUrl: item.thumbnailUrl,
        category: 'edition-2' as const,
        tags: item.tags || [],
        photographer: item.photographer || 'Unknown',
        photographerEmail: '', // Not stored in GalleryMedia interface
        photographerPhone: '', // Not stored in GalleryMedia interface
        isApproved: item.isApproved,
        createdAt: item.createdAt ? new Date(item.createdAt.toDate()) : new Date()
      }));
      
      setUploadedMedia(transformedMedia);
    } catch (error) {
      console.error('Error loading gallery media:', error);
      setError('Failed to load gallery media. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
      setError('Please fill in all fields and select at least one file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Upload each file and create gallery media entries
      const uploadPromises = uploadForm.files.map(async (file) => {
        // Upload image to Firebase Storage
        const imageUrl = await imageService.uploadImage(file, 'gallery/edition-2');
        
        // Create gallery media entry in Firestore
        const mediaData = {
          title: `Photo by ${uploadForm.name}`,
          description: `Shared memory from ${uploadForm.name}`,
          imageUrl: imageUrl,
          thumbnailUrl: imageUrl, // Use same URL for thumbnail for now
          category: 'edition-2' as const,
          tags: ['user-submitted', 'edition-2', 'community'],
          photographer: uploadForm.name,
          location: 'Nairobi, Kenya',
          date: new Date(),
          isApproved: false // Requires admin approval
        };
        
        // Add to database collection
        const mediaId = await galleryService.createMedia(mediaData);
        
        return {
          id: mediaId,
          title: mediaData.title,
          description: mediaData.description,
          imageUrl: mediaData.imageUrl,
          thumbnailUrl: mediaData.thumbnailUrl,
          category: mediaData.category,
          tags: mediaData.tags,
          photographer: mediaData.photographer,
          photographerEmail: uploadForm.email,
          photographerPhone: uploadForm.phone,
          isApproved: mediaData.isApproved,
          createdAt: new Date()
        };
      });

      // Wait for all uploads to complete
      const newMedia = await Promise.all(uploadPromises);
      
      // Update local state
      setUploadedMedia(prev => [...newMedia, ...prev]);
      
      // Reset form
      setUploadForm({
        name: '',
        email: '',
        phone: '',
        files: []
      });
      
      setShowUploadModal(false);
      setSuccessMessage(`Successfully uploaded ${newMedia.length} photo(s)! They will be reviewed and approved by our team.`);
      
      // Reload gallery to show all media
      await loadGalleryMedia();
      
    } catch (error) {
      console.error('Error uploading media:', error);
      setError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setUploadForm({
      name: '',
      email: '',
      phone: '',
      files: []
    });
    setError(null);
    setSuccessMessage(null);
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
            {isLoading ? (
              <section className="py-16 bg-muted/30 flex justify-center items-center">
                <FaSpinner className="w-12 h-12 text-secondary animate-spin" />
                <p className="ml-4 text-lg text-muted-foreground">Loading gallery...</p>
              </section>
            ) : error ? (
              <section className="py-16 bg-red-50 border border-red-200 rounded-lg text-center">
                <FaExclamationTriangle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-lg text-red-800">{error}</p>
              </section>
            ) : uploadedMedia.length === 0 ? (
              <section className="py-16 bg-muted/30 text-center">
                <p className="text-lg text-muted-foreground">No photos or videos shared yet from Edition 2. Be the first to upload!</p>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <FaUpload className="w-5 h-5" />
                  <span>Upload Your Memories</span>
                </button>
              </section>
            ) : (
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
                        <div key={media.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          {/* Image Display */}
                          <div className="aspect-square bg-muted overflow-hidden">
                            <img
                              src={media.imageUrl}
                              alt={media.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Media Info */}
                          <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                                <FaUser className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{media.photographer}</p>
                                <p className="text-xs text-muted-foreground">
                                  {media.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm text-foreground">{media.title}</h3>
                              {media.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{media.description}</p>
                              )}
                              
                              {/* Tags */}
                              {media.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {media.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
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
                  
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center text-green-800">
                      <FaCheck className="w-6 h-6 inline-block mr-2" />
                      {successMessage}
                    </div>
                  )}

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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {uploadForm.files.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border">
                                {file.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FaVideo className="w-8 h-8 text-red-500" />
                                  </div>
                                )}
                              </div>
                              
                              {/* File Info Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                                <p className="truncate font-medium">{file.name}</p>
                                <p className="text-gray-300">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <FaTimes className="w-3 h-3" />
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
                            <FaSpinner className="inline mr-2 animate-spin" />
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