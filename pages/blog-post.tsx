import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaCalendar, FaClock, FaBookOpen, FaHeart, FaShare, FaEnvelope, FaCheck } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  slug?: string;
}

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      // Fetch the specific blog post
      fetchBlogPost(slug as string);
      // Fetch related posts
      fetchRelatedPosts(slug as string);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    setLoading(true);
    try {
      // For now, using mock data - replace with actual API call
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Power of Mindful Living: A Journey to Wellness',
          excerpt: 'Discover how incorporating mindfulness practices into your daily routine can transform your physical and mental well-being.',
          content: `Mindful living is more than just a trend—it's a fundamental shift in how we approach our daily experiences. By cultivating awareness and presence in each moment, we create space for deeper connection with ourselves and the world around us.

Wellness is not a destination but a journey of continuous growth and self-discovery. Through mindful practices like yoga, meditation, and conscious breathing, we create space for transformation and healing in our daily lives.

At Yoga in the Park Nairobi, we believe that these practices become even more powerful when shared in community. The collective energy of practitioners coming together with intention creates a supportive environment for everyone to explore their wellness journey.

As you integrate these practices into your life, remember to be patient and compassionate with yourself. Every step forward, no matter how small, is a victory worth celebrating.

We invite you to continue this journey with us at YIPN, where you can experience these practices in a supportive community setting surrounded by Nairobi's natural beauty.`,
          author: 'Sarah Kamau',
          date: '2024-01-15',
          category: 'Mindfulness',
          slug: 'power-of-mindful-living'
        },
        {
          id: '2',
          title: 'Building a Morning Wellness Routine',
          excerpt: 'Start your day with intention and energy through these simple morning practices.',
          content: `A morning wellness routine sets the tone for your entire day. It's not about adding more stress to your morning, but about creating moments of peace and intention that carry you through the day.

The key to a successful morning routine is consistency and simplicity. Start with just 5-10 minutes and gradually build up as the habit becomes natural. Remember, it's better to do a little consistently than to do a lot occasionally.

Your morning routine should be personalized to your needs and schedule. Some people thrive with early morning yoga, while others prefer gentle stretching or meditation. The important thing is that it feels good and sustainable for you.`,
          author: 'Michael Ochieng',
          date: '2024-01-10',
          category: 'Wellness',
          slug: 'building-morning-wellness-routine'
        },
        {
          id: '3',
          title: 'The Healing Power of Community Yoga',
          excerpt: 'Discover how practicing yoga in a group setting can enhance your personal growth.',
          content: `There's something magical that happens when people come together to practice yoga. The collective energy creates a supportive environment that amplifies the benefits of individual practice.

In community yoga, we learn from each other, support each other, and grow together. The shared experience of breathing, moving, and being present creates bonds that extend beyond the mat.

At YIPN, we've seen countless friendships form and lives transformed through our community yoga sessions. The park setting adds an extra dimension of connection to nature and the city we love.`,
          author: 'Grace Wanjiku',
          date: '2024-01-05',
          category: 'Community',
          slug: 'healing-power-community-yoga'
        }
      ];

      const foundPost = mockPosts.find(p => p.slug === postSlug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentSlug: string) => {
    try {
      // For now, using mock data - replace with actual API call
      const mockPosts: BlogPost[] = [
        {
          id: '2',
          title: 'Building a Morning Wellness Routine',
          excerpt: 'Start your day with intention and energy through these simple morning practices.',
          content: 'Content here...',
          author: 'Michael Ochieng',
          date: '2024-01-10',
          category: 'Wellness',
          slug: 'building-morning-wellness-routine'
        },
        {
          id: '3',
          title: 'The Healing Power of Community Yoga',
          excerpt: 'Discover how practicing yoga in a group setting can enhance your personal growth.',
          content: 'Content here...',
          author: 'Grace Wanjiku',
          date: '2024-01-05',
          category: 'Community',
          slug: 'healing-power-community-yoga'
        }
      ];

      // Filter out the current post and get related ones
      const related = mockPosts.filter(p => p.slug !== currentSlug).slice(0, 2);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      setRelatedPosts([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Link href="/blog" className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="text-center pb-6 p-8">
                <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">{post.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-800 mb-4">
                  {post.title}
                </h1>
                <p className="text-lg mt-4 max-w-2xl mx-auto text-gray-600">
                  {post.excerpt}
                </p>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>5 min read</span>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-8">
                  <div className="text-center">
                    <FaBookOpen className="text-6xl text-secondary mb-4" />
                    <p className="text-gray-500">Featured Article Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-8 md:p-12">
                <div className="leading-relaxed space-y-6">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600">
                      {paragraph}
                    </p>
                  ))}

                  <div className="bg-gray-100 rounded-lg p-6 my-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Takeaways</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Start with small, consistent practices rather than dramatic changes
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Focus on progress, not perfection
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Find community support for your wellness journey
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Remember that self-care is not selfish - it&apos;s essential
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Connect with nature regularly to ground yourself
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Actions */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">Found this helpful?</span>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <FaHeart className="mr-2" />
                      Like Article
                    </button>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <FaShare className="mr-2" />
                    Share Article
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-3">{relatedPost.title}</h4>
                      <p className="mb-4 text-gray-600">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <FaCalendar className="mr-1" />
                        <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/blog/${relatedPost.slug}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Read Article
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;