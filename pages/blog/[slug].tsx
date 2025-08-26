import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaCalendar, FaClock, FaBookOpen, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { blogService } from '../../lib/firebase-services';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate?: any;
  category: string;
  imageUrl?: string;
  slug: string;
  readTime?: number;
}

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const normalize = (p: any): BlogPost => ({
    ...p,
    publishDate: p.publishDate?.toDate ? p.publishDate.toDate() : (p.publishDate ? new Date(p.publishDate) : undefined),
  });

  const fetchBlogPost = async (postSlug: string) => {
    setLoading(true);
    try {
      const results = await blogService.readAll<any>({ slug: postSlug });
      const found = results[results.length - 1];
      if (found) {
        const normalizedPost = normalize(found);
        setPost(normalizedPost as BlogPost);
        // Fetch related posts (same category, published, excluding current)
        const all = await blogService.readAll<any>({ isPublished: true });
        const normalizedAll = all.map(normalize).filter((p: any) => p.slug !== postSlug && p.category === normalizedPost.category).slice(0, 2);
        setRelatedPosts(normalizedAll as BlogPost[]);
      } else {
        setPost(null);
        setRelatedPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
      setRelatedPosts([]);
    } finally {
      setLoading(false);
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
          <div className="max-w-4xl mx-auto mb-8">
            <Link href="/blog" className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>

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
                    <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{post.readTime || 5} min read</span>
                  </div>
                </div>

                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-8">
                  <div className="text-center">
                    <FaBookOpen className="text-6xl text-secondary mb-4" />
                    <p className="text-gray-500">Featured Article Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-8 md:p-12">
                <div className="leading-relaxed space-y-6">
                  {(post.content || '').split('\n\n').map((paragraph, index) => (
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
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                        <span>{relatedPost.publishDate ? new Date(relatedPost.publishDate).toLocaleDateString() : ''}</span>
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

export default BlogPostPage;