import React, { useState } from 'react';
import { FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import { reviewService } from '../lib/firebase-services';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await reviewService.create({
        name: formData.name.trim(),
        role: formData.role.trim(),
        text: formData.text.trim(),
        rating: formData.rating
      });

      // Reset form
      setFormData({
        name: '',
        role: '',
        text: '',
        rating: 5
      });

      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-2xl font-bold text-primary">Share Your Experience</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
            title="Close review form"
            aria-label="Close review form"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-2">
              Your Name *
            </label>
            <input
              id="review-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="review-role" className="block text-sm font-medium text-foreground mb-2">
              Your Role/Experience *
            </label>
            <input
              id="review-role"
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="e.g., Beginner Yogi, Yoga Enthusiast, Wellness Coach"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="text-2xl transition-colors hover:scale-110"
                >
                  <FaStar 
                    className={`${
                      star <= formData.rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-muted-foreground">
                {formData.rating} out of 5
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium text-foreground mb-2">
              Your Review *
            </label>
            <textarea
              id="review-text"
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Share your experience with YIPN..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
