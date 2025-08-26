import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaCalendar, FaClock, FaBookOpen, FaHeart, FaShare, FaEnvelope, FaCheck } from 'react-icons/fa';
import Navbar from '../../components/Navigation';
import Footer from '../../components/Footer';
import { blogService } from '../../lib/firebase-services';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  imageUrl?: string;
  slug: string;
  readTime: number;
  tags: string[];
  isPublished: boolean;
}

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      console.log('Received slug:', slug);
      // Fetch the specific blog post
      fetchBlogPost(slug as string);
      // Fetch related posts
      fetchRelatedPosts(slug as string);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    setLoading(true);
    try {
      console.log('Fetching blog post with slug:', postSlug);
      // Use real Firebase service to fetch blog posts
      const posts = await blogService.readAll();
      console.log('All posts from Firebase:', posts);
      
      // Convert Firestore timestamps to Date objects and find the specific post
      const postsWithDates = posts.map(post => ({
        ...post,
        publishDate: post.publishDate?.toDate() || new Date()
      }));
      
      console.log('Posts with dates:', postsWithDates);
      console.log('Looking for slug:', postSlug);
      
      const foundPost = postsWithDates.find(p => p.slug === postSlug && p.isPublished);
      console.log('Found post:', foundPost);
      
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
      // Use real Firebase service to fetch related blog posts
      const posts = await blogService.readAll();
      
      // Convert Firestore timestamps to Date objects and filter published posts
      const postsWithDates = posts
        .filter(post => post.isPublished && post.slug !== currentSlug)
        .map(post => ({
          ...post,
          publishDate: post.publishDate?.toDate() || new Date()
        }))
        .slice(0, 2); // Get only 2 related posts
      
      setRelatedPosts(postsWithDates);
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
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
              <Link href="/blog" className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors">
                <FaArrowLeft />
                <span>Back to Blog</span>
              </Link>
            </div>
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
            <Link href="/blog" className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors">
              <FaArrowLeft />
              <span>Back to Blog</span>
            </Link>
          </div>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="w-full h-64 md:h-80 bg-gray-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <FaUser />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar />
                  <span>{post.publishDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBookOpen />
                  <span>{post.category}</span>
                </div>
              </div>

              {/* Title and Excerpt */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
              <p className="text-lg text-gray-600 mb-8">{post.excerpt}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                    <FaHeart />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <FaShare />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <FaEnvelope />
                    <span>Email</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaCheck className="text-green-500" />
                  <span>Published</span>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedPost.imageUrl && (
                      <div className="w-full h-48 bg-gray-100">
                        <img
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{relatedPost.author}</span>
                        <span>{relatedPost.publishDate.toLocaleDateString()}</span>
                      </div>
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="mt-4 inline-block text-secondary hover:text-primary transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;