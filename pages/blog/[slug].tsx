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
      // Use real Firebase service to fetch all blog posts once
      const posts = await blogService.readAll();
      
      // Find the current post to get its category
      const currentPost = posts.find(post => post.slug === currentSlug && post.isPublished);
      
      if (!currentPost) {
        setRelatedPosts([]);
        return;
      }
      
      // Convert Firestore timestamps to Date objects and filter by same category
      const postsWithDates = posts
        .filter(post => 
          post.isPublished && 
          post.slug !== currentSlug && 
          post.category === currentPost.category
        )
        .map(post => ({
          ...post,
          publishDate: post.publishDate?.toDate() || new Date()
        }))
        .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime()) // Sort by most recent first
        .slice(0, 3); // Get up to 3 related posts from the same category
      
      // If we don't have enough posts from the same category, fill with posts from other categories
      if (postsWithDates.length < 3) {
        const otherCategoryPosts = posts
          .filter(post => 
            post.isPublished && 
            post.slug !== currentSlug && 
            post.category !== currentPost.category
          )
          .map(post => ({
            ...post,
            publishDate: post.publishDate?.toDate() || new Date()
          }))
          .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime()) // Sort by most recent first
          .slice(0, 3 - postsWithDates.length);
        
        postsWithDates.push(...otherCategoryPosts);
      }
      
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
                <span>Read others?</span>
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
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Related Articles
              {post.category && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  in {post.category}
                </span>
              )}
              {relatedPosts.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({relatedPosts.filter(p => p.category === post.category).length} from same category)
                </span>
              )}
            </h2>
            
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          relatedPost.category === post.category 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {relatedPost.category}
                          {relatedPost.category === post.category && (
                            <span className="ml-1 text-xs">(same)</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {relatedPost.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      {/* Tags */}
                      {relatedPost.tags && relatedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {relatedPost.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {relatedPost.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              +{relatedPost.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <FaUser className="mr-1 text-xs" />
                          {relatedPost.author}
                        </span>
                        <span className="flex items-center">
                          <FaCalendar className="mr-1 text-xs" />
                          {relatedPost.publishDate.toLocaleDateString()}
                        </span>
                      </div>
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-block text-secondary hover:text-primary transition-colors font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  No related articles found in the same category.
                </p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
                >
                  <span>Browse all articles</span>
                  <FaArrowLeft className="transform rotate-180" />
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;