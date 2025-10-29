import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import { GALLERY_FOLDERS } from '../lib/gallery-config';

const GalleryEdition2 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load images from gallery config
    const loadGalleryImages = () => {
      try {
        setLoading(true);
        setError(null);
        
        const edition2Folder = GALLERY_FOLDERS['edition-2'];
        if (edition2Folder && edition2Folder.imageUrls.length > 0) {
          setGalleryImages(edition2Folder.imageUrls);
          console.log(`Loaded ${edition2Folder.imageUrls.length} images for Edition 2`);
        } else {
          setGalleryImages([]);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleryImages();
  }, []);

  const displayItems = galleryImages.map((imageUrl, index) => ({
    id: `ed2-${index + 1}`,
    src: imageUrl,
    alt: `Gallery Image ${index + 1} - Edition 2`
  }));

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
      <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Gallery Edition 2
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the evolution of our wellness community through these beautiful captured moments from our second transformative event.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading gallery images...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Images</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Pinterest-Style Masonry Layout */}
          {!loading && !error && galleryImages.length > 0 && (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-4 group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={() => setSelectedMedia(item.src)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                                  ))}
                                </div>
          )}

          {/* Empty State */}
          {!loading && !error && galleryImages.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Images Yet</h3>
                <p className="text-gray-600 mb-4">
                  Gallery Edition 2 images will appear here once they're added to the public folder.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Gallery</span>
            </Link>
                        </div>
                      </div>
      </main>

      {/* Modal for selected media */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-auto"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full min-h-full flex items-center justify-center">
            <img
              src={selectedMedia}
              alt="Selected media"
              className="max-w-full max-h-full object-contain"
              style={{ minHeight: '100vh' }}
            />
                              <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              onClick={() => setSelectedMedia(null)}
            >
              ×
                      </button>
              </div>
            </div>
          )}
          
          <Footer />
    </div>
  );
};

export default GalleryEdition2;