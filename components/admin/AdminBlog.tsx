import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaNewspaper, 
  FaSave, 
  FaTimes,
  FaEye,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaEyeSlash
} from 'react-icons/fa';
import { blogService } from '../../lib/firebase-services';
import { serverTimestamp } from 'firebase/firestore';

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  slug: string;
  readTime: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');


  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishDate: new Date(),
    tags: [],
    category: '',
    imageUrl: '',
    isPublished: false,
    slug: '',
    readTime: 5
  });

  const categories = [
    'Yoga & Wellness',
    'Meditation',
    'Fitness',
    'Nutrition',
    'Mental Health',
    'Community',
    'Events',
    'Tips & Tricks'
  ];

  useEffect(() => {
    loadBlogPosts();
  }, []);



  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      // Fetch real blog posts from Firebase
      const posts = await blogService.readAll();
      
      // Convert Firestore timestamps to Date objects
      const postsWithDates = posts.map(post => ({
        ...post,
        publishDate: post.publishDate?.toDate() || new Date(),
        createdAt: post.createdAt?.toDate() || new Date(),
        updatedAt: post.updatedAt?.toDate() || new Date()
      }));
      
      setBlogPosts(postsWithDates);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      alert('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publishDate: new Date(),
      tags: [],
      category: '',
      imageUrl: '',
      isPublished: false,
      slug: '',
      readTime: 5
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData(post);
    setIsEditModalOpen(true);
  };

  const openViewModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedPost(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleImageUrlChange = (imageUrl: string) => {
    handleInputChange('imageUrl', imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Generate slug if not provided
      if (!formData.slug) {
        formData.slug = generateSlug(formData.title);
        console.log('Generated slug:', formData.slug, 'from title:', formData.title);
      }
      
      // Ensure slug is unique
      const existingPost = blogPosts.find(post => 
        post.slug === formData.slug && post.id !== selectedPost?.id
      );
      if (existingPost) {
        formData.slug = generateSlug(formData.title) + '-' + Date.now();
        console.log('Slug conflict detected, new slug:', formData.slug);
      }
      
      console.log('Final slug being saved:', formData.slug);
      
      if (isEditModalOpen && selectedPost?.id) {
        // TODO: Implement actual Firebase update
        setBlogPosts(prev => prev.map(post => 
          post.id === selectedPost.id ? { ...formData, id: post.id } : post
        ));
      } else {
        // TODO: Implement actual Firebase add
        const newPost = { ...formData, id: Date.now().toString() };
        setBlogPosts(prev => [...prev, newPost]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        setLoading(true);
        // TODO: Implement actual Firebase delete
        setBlogPosts(prev => prev.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePublishStatus = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual Firebase update
      setBlogPosts(prev => prev.map(post => 
        post.id === id ? { ...post, isPublished: !post.isPublished } : post
      ));
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Failed to update publish status');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'published' && post.isPublished) ||
                         (selectedStatus === 'draft' && !post.isPublished);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const BlogModal = ({ isOpen, onClose, title, children }: any) => (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              title="Close modal"
              aria-label="Close modal"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Blog</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and manage your blog content</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-wellness hover:bg-wellness/80 text-wellness-foreground px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search blog posts by title, excerpt, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {filteredPosts.length} of {blogPosts.length} posts
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-card rounded-lg shadow-md border border-border">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="animate-spin text-4xl text-wellness" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                          {post.imageUrl ? (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <FaNewspaper className="text-muted-foreground text-xl" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {post.title}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {post.excerpt}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <FaCalendarAlt className="mr-1" />
                              {post.publishDate.toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <FaTag className="mr-1" />
                              {post.readTime} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{post.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublishStatus(post.id!)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                          post.isPublished 
                            ? 'bg-wellness/20 text-wellness hover:bg-wellness/30' 
                            : 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                        }`}
                      >
                        {post.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openViewModal(post)}
                          className="text-primary hover:text-primary/80"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-secondary hover:text-secondary/80"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id!)}
                          className="text-destructive hover:text-destructive/80"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <BlogModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={closeModal}
        title={isAddModalOpen ? 'Create New Blog Post' : 'Edit Blog Post'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div>
                <label htmlFor="blog-title" className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <input
                  id="blog-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="blog-excerpt" className="block text-sm font-medium text-foreground mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="blog-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="blog-author" className="block text-sm font-medium text-foreground mb-2">
                  Author *
                </label>
                <input
                  id="blog-author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="blog-category" className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  id="blog-category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  required
                  aria-label="Select blog category"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Details</h3>
              
              <div>
                <label htmlFor="blog-publish-date" className="block text-sm font-medium text-foreground mb-2">
                  Publish Date
                </label>
                <input
                  id="blog-publish-date"
                  type="date"
                  value={formData.publishDate.toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('publishDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                />
              </div>

              <div>
                <label htmlFor="blog-tags" className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="blog-tags"
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="yoga, wellness, beginners"
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                />
              </div>

              <div>
                <label htmlFor="blog-read-time" className="block text-sm font-medium text-foreground mb-2">
                  Read Time (minutes)
                </label>
                <input
                  id="blog-read-time"
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Featured Image URL
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="Enter image URL from Firebase Storage"
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the URL of an image stored in Firebase Storage
                </p>
              </div>

              <div>
                <label htmlFor="blog-status" className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  id="blog-status"
                  value={formData.isPublished ? 'published' : 'draft'}
                  onChange={(e) => handleInputChange('isPublished', e.target.value === 'published')}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  aria-label="Select blog status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Content</h3>
            <div>
              <label htmlFor="blog-content" className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                id="blog-content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent font-mono text-sm bg-input text-foreground"
                placeholder="Write your blog post content here. You can use HTML tags for formatting."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use basic HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-wellness text-wellness-foreground rounded-md hover:bg-wellness/80 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{isAddModalOpen ? 'Create Post' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </BlogModal>

      {/* View Modal */}
      <BlogModal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title={`Blog Post: ${selectedPost?.title}`}
      >
        {selectedPost && (
          <div className="space-y-6">
            {/* Post Header */}
            <div className="border-b pb-6">
              <div className="flex items-center space-x-4 mb-4">
                {selectedPost.imageUrl && (
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{selectedPost.title}</h1>
                  <div className="flex items-center space-x-6 text-muted-foreground mt-2">
                    <span className="flex items-center">
                      <FaUser className="mr-2" />
                      {selectedPost.author}
                    </span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {selectedPost.publishDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FaTag className="mr-2" />
                      {selectedPost.readTime} min read
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-primary/20 text-primary">
                      {selectedPost.category}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground italic">{selectedPost.excerpt}</p>
            </div>

            {/* Tags */}
            {selectedPost.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Content</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
              <button
                onClick={() => {
                  closeModal();
                  openEditModal(selectedPost);
                }}
                className="px-6 py-2 bg-wellness text-wellness-foreground rounded-md hover:bg-wellness/80 transition-colors flex items-center space-x-2"
              >
                <FaEdit />
                <span>Edit Post</span>
              </button>
            </div>
          </div>
        )}
      </BlogModal>
    </div>
  );
};

export default AdminBlog;
