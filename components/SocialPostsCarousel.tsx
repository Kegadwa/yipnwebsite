import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaInstagram, FaFacebook, FaTwitter, FaHeart, FaComment, FaShare, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  imageUrl?: string;
  postUrl: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'Finding peace in the heart of Nairobi 🧘‍♀️ Join us every Saturday for transformative yoga sessions in the park. #YogaInTheParkNairobi #Mindfulness #Wellness',
    imageUrl: undefined,
    postUrl: 'https://instagram.com/p/example1',
    likes: 245,
    comments: 18,
    shares: 12,
    createdAt: new Date('2025-01-15')
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Thank you to everyone who joined our Edition Two event! The energy was incredible and the community connections formed were beautiful. See you at the next session! 💚',
    imageUrl: undefined,
    postUrl: 'https://facebook.com/post/example2',
    likes: 156,
    comments: 24,
    shares: 8,
    createdAt: new Date('2025-01-10')
  },
  {
    id: '3',
    platform: 'twitter',
    content: 'Meditation isn\'t about emptying your mind. It\'s about focusing it. Join our mindfulness sessions every weekend! 🌿 #MindfulnessMeditatio #YogaNairobi',
    imageUrl: undefined,
    postUrl: 'https://twitter.com/post/example3',
    likes: 89,
    comments: 12,
    shares: 15,
    createdAt: new Date('2025-01-08')
  },
  {
    id: '4',
    platform: 'instagram',
    content: 'New YIPN merchandise now available! 🛍️ Check out our eco-friendly yoga mats and sustainable apparel. Every purchase supports our community programs.',
    imageUrl: undefined,
    postUrl: 'https://instagram.com/p/example4',
    likes: 198,
    comments: 31,
    shares: 22,
    createdAt: new Date('2025-01-05')
  }
];

const SocialPostsCarousel = () => {
  const [posts] = useState<SocialPost[]>(mockPosts);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <FaInstagram className="w-5 h-5" />;
      case 'facebook':
        return <FaFacebook className="w-5 h-5" />;
      case 'twitter':
        return <FaTwitter className="w-5 h-5" />;
      default:
        return <FaExternalLinkAlt className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'text-pink-500';
      case 'facebook':
        return 'text-blue-600';
      case 'twitter':
        return 'text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  const handlePostClick = (postUrl: string) => {
    window.open(postUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">Social Community</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest from Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected with our vibrant yoga community through our social media updates and inspiring moments.
          </p>
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
                          <div className={`flex items-center space-x-2 ${getPlatformColor(post.platform)}`}>
                            {getPlatformIcon(post.platform)}
                            <span className="text-sm font-medium capitalize">{post.platform}</span>
                          </div>
                          <FaExternalLinkAlt className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-smooth" />
                        </div>
                        
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
                            {post.createdAt.toLocaleDateString()}
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
            Follow us on social media for daily inspiration and community updates
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://instagram.com/yogaintheparknairobi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-smooth hover:scale-110"
            >
              <FaInstagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a 
              href="https://facebook.com/yogaintheparknairobi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-smooth hover:scale-110"
            >
              <FaFacebook className="w-5 h-5" />
              <span>Facebook</span>
            </a>
            <a 
              href="https://twitter.com/yipnairobi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-smooth hover:scale-110"
            >
              <FaTwitter className="w-5 h-5" />
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPostsCarousel;