import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import { galleryService, imageService } from '../lib/firebase-services';

const GalleryEdition1 = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Convert gs:// URLs to proper HTTP URLs
  const convertImageUrl = (url: string): string => {
    if (url.startsWith('gs://')) {
      return imageService.convertGsUrlToStorageUrl(url);
    }
    return url;
  };

  useEffect(() => {
    // Load images from Firestore collection 'gallery1'
    const loadGalleryImages = async () => {
      try {
        const galleryData = await galleryService.readAll();
        const edition1Folder = galleryData.find((item: any) => item.folderId === 'edition-1');
        
        if (edition1Folder?.imageUrls && edition1Folder.imageUrls.length > 0) {
          // Convert all image URLs to proper HTTP format
          const convertedUrls = edition1Folder.imageUrls.map(convertImageUrl);
          setGalleryImages(convertedUrls);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
      }
    };
    
    loadGalleryImages();
  }, []);

  const displayItems = galleryImages.map((imageUrl, index) => ({
    id: index + 1,
    src: imageUrl,
    alt: `Gallery Image ${index + 1} - Edition 1`
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Gallery Edition 1
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Relive the magic of our first YIPN event through these beautiful captured moments of community and wellness.
            </p>
          </div>

          {/* Image Count and Debug Info */}
          <div className="text-center mb-8">
            {galleryImages.length > 0 ? (
              <p className="text-gray-600">
                Showing {galleryImages.length} images from your gallery
              </p>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-yellow-800 text-sm">
                  No images configured yet. Go to Admin → Gallery to add image URLs.
                </p>
              </div>
            )}
          </div>

          {/* Pinterest-Style Masonry Layout */}
          {galleryImages.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Images Yet</h3>
                <p className="text-gray-600 mb-4">
                  No images have been configured for this gallery yet.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Panel
                </Link>
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
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedMedia}
              alt="Selected media"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
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

export default GalleryEdition1;