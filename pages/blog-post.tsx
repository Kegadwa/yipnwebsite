import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogPostProps {
  id: string;
}

const BlogPost = ({ id }: BlogPostProps) => {
  // Simple mock data
  const post = {
    id: id,
    title: 'The Power of Mindful Living: A Journey to Wellness',
    excerpt: 'Discover how incorporating mindfulness practices into your daily routine can transform your physical and mental well-being.',
    author: 'Sarah Kamau',
    date: '2024-01-15',
    content: 'Mindful living is more than just a trend—it\'s a fundamental shift in how we approach our daily experiences. By cultivating awareness and presence in each moment, we create space for deeper connection with ourselves and the world around us.'
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
              <span className="mr-2">←</span>
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
              <span className="mr-2">←</span>
              Back to Wellness Tips
            </Link>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="text-center pb-6 p-8">
                <span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">Wellness Article</span>
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
                    <span className="mr-2">👤</span>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span>5 min read</span>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-8">
                  <div className="text-center">
                    <span className="text-6xl text-secondary mb-4 block">📖</span>
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
                  <p className="text-lg font-medium text-gray-800 mb-6">
                    {post.content}
                  </p>
                  
                  <p className="text-gray-600">
                    Wellness is not a destination but a journey of continuous growth and self-discovery. 
                    Through mindful practices like yoga, meditation, and conscious breathing, we create 
                    space for transformation and healing in our daily lives.
                  </p>

                  <p className="text-gray-600">
                    At Yoga in the Park Nairobi, we believe that these practices become even more powerful 
                    when shared in community. The collective energy of practitioners coming together with 
                    intention creates a supportive environment for everyone to explore their wellness journey.
                  </p>

                  <div className="bg-gray-100 rounded-lg p-6 my-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Takeaways</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Start with small, consistent practices rather than dramatic changes</li>
                      <li>• Focus on progress, not perfection</li>
                      <li>• Find community support for your wellness journey</li>
                      <li>• Remember that self-care is not selfish - it&apos;s essential</li>
                      <li>• Connect with nature regularly to ground yourself</li>
                    </ul>
                  </div>

                  <p className="text-gray-600">
                    As you integrate these practices into your life, remember to be patient and 
                    compassionate with yourself. Every step forward, no matter how small, is a 
                    victory worth celebrating.
                  </p>

                  <p className="text-gray-600">
                    We invite you to continue this journey with us at YIPN, where you can experience 
                    these practices in a supportive community setting surrounded by Nairobi&apos;s natural beauty.
                  </p>
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
                      <span className="mr-2">💖</span>
                      Like Article
                    </button>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <span className="mr-2">📤</span>
                    Share Article
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Related Wellness Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: '2',
                  title: 'Building a Morning Wellness Routine',
                  excerpt: 'Start your day with intention and energy through these simple morning practices.',
                  date: '2024-01-10'
                },
                {
                  id: '3',
                  title: 'The Healing Power of Community Yoga',
                  excerpt: 'Discover how practicing yoga in a group setting can enhance your personal growth.',
                  date: '2024-01-05'
                }
              ].map((relatedPost, index) => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{relatedPost.title}</h4>
                    <p className="mb-4 text-gray-600">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <span className="mr-1">📅</span>
                      <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                    </div>
                    <Link href={`/blog/${relatedPost.id}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Read Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;