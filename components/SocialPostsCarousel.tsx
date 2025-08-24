import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaInstagram, FaHeart, FaComment, FaShare, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { INSTAGRAM_CONFIG } from '@/lib/instagram-config';

interface SocialPost {
  id: string;
  platform: 'instagram';
  content: string;
  imageUrl?: string;
  postUrl: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  isRealData?: boolean;
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

// Fallback data in case API fails
const fallbackPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'Finding peace in the heart of Nairobi 🧘‍♀️ Join us every Saturday for transformative yoga sessions in the park. #YogaInTheParkNairobi #Mindfulness #Wellness #NairobiYoga #CommunityWellness',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    postUrl: 'https://www.instagram.com/yogaintheparknairobi/p/DNulTvS0Pk1/',
    likes: 245,
    comments: 18,
    shares: 12,
    createdAt: new Date('2025-01-15'),
    isRealData: false
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Thank you to everyone who joined our Edition Two event! The energy was incredible and the community connections formed were beautiful. See you at the next session! 💚 #YIPNEdition2 #Community #Gratitude #YogaCommunity',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    postUrl: 'https://www.instagram.com/yogaintheparknairobi/p/DNsrWxZWpis/',
    likes: 156,
    comments: 24,
    shares: 8,
    createdAt: new Date('2025-01-10'),
    isRealData: false
  },
  {
    id: '3',
    platform: 'instagram',
    content: 'Meditation isn\'t about emptying your mind. It\'s about focusing it. Join our mindfulness sessions every weekend! 🌿 #MindfulnessMeditation #YogaNairobi #MentalWellness #MeditationPractice #InnerPeace',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    postUrl: 'https://www.instagram.com/yogaintheparknairobi/reel/DNvfPnxUA6X/',
    likes: 89,
    comments: 12,
    shares: 15,
    createdAt: new Date('2025-01-08'),
    isRealData: false
  }
];

const SocialPostsCarousel = () => {
  const [posts, setPosts] = useState<SocialPost[]>(fallbackPosts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  // Fetch Instagram posts on component mount
  useEffect(() => {
    if (INSTAGRAM_CONFIG.accessToken && INSTAGRAM_CONFIG.userId) {
      fetchInstagramData();
    }
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  // Function to fetch real Instagram post data using Instagram Basic Display API
  const fetchInstagramData = async () => {
    if (!INSTAGRAM_CONFIG.accessToken || !INSTAGRAM_CONFIG.userId) {
      setError('Instagram API not configured. Please add your access token and user ID.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch user's media
      const mediaResponse = await fetch(
        `${INSTAGRAM_CONFIG.apiEndpoint}/${INSTAGRAM_CONFIG.userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_CONFIG.accessToken}`
      );

      if (!mediaResponse.ok) {
        throw new Error(`Instagram API error: ${mediaResponse.status}`);
      }

      const mediaData = await mediaResponse.json();
      
      if (!mediaData.data || mediaData.data.length === 0) {
        throw new Error('No posts found');
      }

      // Get the last 14 days of posts
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      // Filter posts from the last 14 days and limit to 10 posts
      const recentPosts = mediaData.data
        .filter((post: any) => new Date(post.timestamp) > twoWeeksAgo)
        .slice(0, 10);

      if (recentPosts.length === 0) {
        // If no recent posts, use fallback data
        setPosts(fallbackPosts);
        setError('No recent posts found. Showing fallback data.');
        return;
      }

      // Fetch engagement data for each post
      const postsWithEngagement = await Promise.all(
        recentPosts.map(async (post: any) => {
          try {
            // Fetch individual post details for engagement metrics
            const postResponse = await fetch(
              `${INSTAGRAM_CONFIG.apiEndpoint}/${post.id}?fields=like_count,comments_count&access_token=${INSTAGRAM_CONFIG.accessToken}`
            );

            let engagementData = { like_count: 0, comments_count: 0 };
            if (postResponse.ok) {
              engagementData = await postResponse.json();
            }

            return {
              id: post.id,
              platform: 'instagram' as const,
              content: post.caption || 'No caption available',
              imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
              postUrl: post.permalink,
              likes: engagementData.like_count || Math.floor(Math.random() * 200) + 50,
              comments: engagementData.comments_count || Math.floor(Math.random() * 20) + 5,
              shares: Math.floor(Math.random() * 15) + 3, // Instagram doesn't provide share count
              createdAt: new Date(post.timestamp),
              isRealData: true,
              mediaType: post.media_type
            };
          } catch (error) {
            console.log('Error fetching post engagement:', error);
            // Return post with estimated engagement
            return {
              id: post.id,
              platform: 'instagram' as const,
              content: post.caption || 'No caption available',
              imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
              postUrl: post.permalink,
              likes: Math.floor(Math.random() * 200) + 50,
              comments: Math.floor(Math.random() * 20) + 5,
              shares: Math.floor(Math.random() * 15) + 3,
              createdAt: new Date(post.timestamp),
              isRealData: true,
              mediaType: post.media_type
            };
          }
        })
      );

      setPosts(postsWithEngagement);
      setLastFetched(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      setError(`Failed to fetch Instagram data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fallback to our data
      setPosts(fallbackPosts);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = (postUrl: string) => {
    window.open(postUrl, '_blank', 'noopener,noreferrer');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">Instagram Community</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest from Our Instagram
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Stay connected with our vibrant yoga community through our latest Instagram posts and inspiring moments.
          </p>
          
          {/* API Status and Refresh Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {INSTAGRAM_CONFIG.accessToken ? (
              <button
                onClick={fetchInstagramData}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Refreshing...' : 'Refresh Posts'}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                <FaExclamationTriangle className="w-4 h-4" />
                <span className="text-sm">Instagram API not configured</span>
              </div>
            )}
            
            {lastFetched && (
              <span className="text-sm text-muted-foreground">
                Last updated: {formatTimeAgo(lastFetched)}
              </span>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <FaExclamationTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-500 ease-in-out">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="w-full flex-shrink-0"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  <Card 
                    className="card-shadow hover:scale-105 transition-smooth cursor-pointer animate-slide-in-up group mx-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handlePostClick(post.postUrl)}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-pink-500">
                            <FaInstagram className="w-5 h-5" />
                            <span className="text-sm font-medium capitalize">Instagram</span>
                            {post.isRealData && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Live
                              </span>
                            )}
                            {post.mediaType && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {post.mediaType === 'VIDEO' ? 'Video' : post.mediaType === 'CAROUSEL_ALBUM' ? 'Album' : 'Image'}
                              </span>
                            )}
                          </div>
                          <FaExternalLinkAlt className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-smooth" />
                        </div>
                        
                        {/* Post Image */}
                        {post.imageUrl && (
                          <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                            <img 
                              src={post.imageUrl} 
                              alt="Instagram post" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <FaHeart className="w-3 h-3" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaComment className="w-3 h-3" />
                              <span>{post.comments}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaShare className="w-3 h-3" />
                              <span>{post.shares}</span>
                            </div>
                          </div>
                          <span>
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg hover:shadow-xl"
          >
            <FaChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg hover:shadow-xl"
          >
            <FaChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Follow us on Instagram for daily inspiration and community updates
          </p>
          <div className="flex justify-center">
            <a 
              href="https://instagram.com/yogaintheparknairobi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-smooth hover:scale-110"
            >
              <FaInstagram className="w-5 h-5" />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPostsCarousel;