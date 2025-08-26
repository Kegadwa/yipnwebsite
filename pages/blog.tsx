import React, { useState, useEffect } from "react";
import { FaSearch, FaSort, FaFilter, FaUser, FaCalendar, FaTag, FaEnvelope, FaSpotify, FaMusic, FaLeaf, FaHeart, FaUsers, FaCalendarAlt, FaLightbulb, FaPrayingHands, FaFire } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";

interface BlogPost {
	id: string;
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

const Blog = () => {
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [email, setEmail] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);

	// Categories for filtering
	const categories = [
		"Mindfulness",
		"Wellness",
		"Community",
		"Yoga & Wellness",
		"Meditation",
		"Fitness",
		"Nutrition",
		"Mental Health",
		"Events",
		"Tips & Tricks"
	];

	useEffect(() => {
		loadBlogPosts();
	}, []);

	useEffect(() => {
		filterAndSortPosts();
	}, [blogPosts, searchTerm, selectedCategory, sortBy, sortOrder]);

	const loadBlogPosts = async () => {
		try {
			setLoading(true);
			// TODO: Replace with actual Firebase fetch
			// For now, using mock data that matches the admin structure
			const mockPosts: BlogPost[] = [
				{
					id: "1",
					title: "The Power of Mindful Living: A Journey to Wellness",
					excerpt: "Discover how incorporating mindfulness practices into your daily routine can transform your physical and mental well-being.",
					content: "Full content here...",
					author: "Sarah Kamau",
					publishDate: new Date("2024-01-15"),
					tags: ["mindfulness", "wellness", "meditation", "lifestyle"],
					category: "Mindfulness",
					imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
					isPublished: true,
					slug: "power-of-mindful-living",
					readTime: 5
				},
				{
					id: "2",
					title: "Building a Morning Wellness Routine",
					excerpt: "Start your day with intention and energy through these simple morning practices.",
					content: "Full content here...",
					author: "Michael Ochieng",
					publishDate: new Date("2024-01-10"),
					tags: ["morning-routine", "wellness", "habits", "self-care"],
					category: "Wellness",
					imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
					isPublished: true,
					slug: "building-morning-wellness-routine",
					readTime: 4
				},
				{
					id: "3",
					title: "The Healing Power of Community Yoga",
					excerpt: "Discover how practicing yoga in a group setting can enhance your personal growth.",
					content: "Full content here...",
					author: "Grace Wanjiku",
					publishDate: new Date("2024-01-05"),
					tags: ["yoga", "community", "healing", "connection"],
					category: "Community",
					imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
					isPublished: true,
					slug: "healing-power-community-yoga",
					readTime: 6
				}
			];
			
			// Filter only published posts
			const publishedPosts = mockPosts.filter(post => post.isPublished);
			setBlogPosts(publishedPosts);
		} catch (error) {
			console.error("Error loading blog posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const filterAndSortPosts = () => {
		let filtered = blogPosts.filter(post => {
			const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 post.author.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});

		// Sort posts
		filtered.sort((a, b) => {
			let aValue: any, bValue: any;
			
			switch (sortBy) {
				case "author":
					aValue = a.author.toLowerCase();
					bValue = b.author.toLowerCase();
					break;
				case "date":
					aValue = a.publishDate;
					bValue = b.publishDate;
					break;
				case "title":
					aValue = a.title.toLowerCase();
					bValue = b.title.toLowerCase();
					break;
				default:
					aValue = a.publishDate;
					bValue = b.publishDate;
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		setFilteredPosts(filtered);
	};

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		try {
			setIsSubscribing(true);
			// TODO: Implement actual email subscription logic
			// This would typically send the email to yogaintheparknairobi@gmail.com
			// and include links to recent blog posts
			
			// For now, just show success message
			alert("Thank you for subscribing! You'll receive our latest wellness tips and blog updates.");
			setEmail("");
		} catch (error) {
			console.error("Error subscribing:", error);
			alert("Failed to subscribe. Please try again.");
		} finally {
			setIsSubscribing(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			
			{/* Hero Section */}
			<section
				className="relative py-32 flex items-center justify-center overflow-hidden"
				style={{
					backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="absolute inset-0 bg-primary/60"></div>
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Wellness Tips & Insights
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
						Discover practical wisdom, wellness tips, and insights from our community of health and mindfulness practitioners.
					</p>
				</div>
			</section>
			
			<main className="flex-1">
				<div className="container mx-auto px-4">
					{/* Header */}
					<div className="max-w-4xl mx-auto text-center mb-16">
						<span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">
							Wellness Wisdom
						</span>
						<h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
							Wellness Tips & Insights
						</h1>
						<p className="text-lg text-gray-700 max-w-2xl mx-auto">
							Discover practical wellness tips, yoga insights, and mindfulness
							practices to enhance your daily life and deepen your connection with
							yourself.
						</p>
					</div>

					{/* Search and Filter Controls */}
					<div className="max-w-6xl mx-auto mb-12">
						<div className="bg-white rounded-lg shadow-lg p-6">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
								<div className="md:col-span-2">
									<div className="relative">
										<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search blog posts..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
									</div>
								</div>
								<div>
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
										aria-label="Filter by category"
									>
										<option value="all">All Categories</option>
										{categories.map(category => (
											<option key={category} value={category}>{category}</option>
										))}
									</select>
								</div>
								<div className="flex gap-2">
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
										aria-label="Sort by"
									>
										<option value="date">Date</option>
										<option value="title">Title</option>
										<option value="author">Author</option>
									</select>
									<button
										onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
										className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
										title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
									>
										<FaSort className={`transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
									</button>
								</div>
							</div>
							<div className="text-sm text-gray-600">
								{filteredPosts.length} of {blogPosts.length} posts found
							</div>
						</div>
					</div>

					{/* Featured Post */}
					{filteredPosts.length > 0 && (
						<div className="max-w-4xl mx-auto mb-16">
							<div className="bg-white rounded-lg shadow p-8 flex flex-col lg:flex-row gap-8">
								<div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
									{filteredPosts[0].imageUrl ? (
										<img 
											src={filteredPosts[0].imageUrl} 
											alt={filteredPosts[0].title}
											className="w-full h-full object-cover"
										/>
									) : (
										<FaTag className="text-6xl text-gray-400" />
									)}
								</div>
								<div className="flex-1 flex flex-col justify-center">
									<span className="inline-block px-3 py-1 border border-secondary text-secondary rounded mb-4 w-fit">
										Featured
									</span>
									<h2 className="text-2xl mb-4 font-bold">
										{filteredPosts[0].title}
									</h2>
									<p className="mb-6 text-base leading-relaxed text-gray-700">
										{filteredPosts[0].excerpt}
									</p>
									<div className="flex items-center text-sm text-gray-500 mb-6">
										<span className="mr-4 flex items-center">
											<FaUser className="mr-1" />
											{filteredPosts[0].author}
										</span>
										<span className="flex items-center">
											<FaCalendar className="mr-1" />
											{filteredPosts[0].publishDate.toLocaleDateString()}
										</span>
									</div>
									<a
										href={`/blog/${filteredPosts[0].slug}`}
										className="inline-block px-6 py-2 rounded bg-secondary text-white font-semibold shadow hover:scale-105 transition"
									>
										Read Full Article →
									</a>
								</div>
							</div>
						</div>
					)}

					{/* Blog Posts Grid */}
					<div className="max-w-6xl mx-auto mb-16">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-primary mb-4">
								Latest Articles
							</h2>
							<p className="text-gray-700">
								Practical wellness wisdom for your daily journey
							</p>
						</div>

						{loading ? (
							<div className="text-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
								<p className="mt-4 text-gray-600">Loading blog posts...</p>
							</div>
						) : filteredPosts.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600">No blog posts found matching your criteria.</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{filteredPosts.slice(1).map((post, index) => (
									<div
										key={post.id}
										className="bg-white rounded-lg shadow p-6 hover:scale-105 transition"
									>
										<div className="flex items-center justify-center mb-4 h-32 bg-gray-100 rounded-lg overflow-hidden">
											{post.imageUrl ? (
												<img 
													src={post.imageUrl} 
													alt={post.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<FaTag className="text-4xl text-gray-400" />
											)}
										</div>
										<h3 className="text-xl mb-3 font-bold">{post.title}</h3>
										<p className="mb-4 text-sm leading-relaxed text-gray-700">
											{post.excerpt}
										</p>
										<div className="flex items-center text-xs text-gray-500 mb-4">
											<span className="mr-3 flex items-center">
												<FaUser className="mr-1" />
												{post.author}
											</span>
											<span className="flex items-center">
												<FaCalendar className="mr-1" />
												{post.publishDate.toLocaleDateString()}
											</span>
										</div>
										<a
											href={`/blog/${post.slug}`}
											className="block w-full px-4 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition"
										>
											Read More →
										</a>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Categories Section */}
					<div className="max-w-4xl mx-auto mb-16">
						<div className="bg-white rounded-lg shadow p-8 text-center">
							<h2 className="text-2xl font-bold mb-4">Wellness Categories</h2>
							<p className="mb-6 text-gray-700">
								Explore different aspects of holistic wellness
							</p>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[
									{ name: "Yoga Practice", icon: <FaPrayingHands className="text-2xl text-primary" />, count: 12 },
									{ name: "Meditation", icon: <FaFire className="text-2xl text-primary" />, count: 8 },
									{ name: "Mindfulness", icon: <FaLeaf className="text-2xl text-primary" />, count: 15 },
									{ name: "Wellness Tips", icon: <FaLightbulb className="text-2xl text-primary" />, count: 20 },
								].map((category) => (
									<button
										key={category.name}
										className="h-auto p-4 flex flex-col items-center border rounded hover:bg-gray-100 transition"
									>
										<div className="mb-2">{category.icon}</div>
										<span className="font-medium text-sm">
											{category.name}
										</span>
										<span className="text-xs text-gray-500">
											{category.count} articles
										</span>
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Newsletter Signup for Blog */}
					<div className="max-w-4xl mx-auto text-center">
						<div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg shadow p-12">
							<div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
								<FaEnvelope className="text-4xl text-white" />
							</div>
							<h3 className="text-2xl font-bold mb-4">
								Never Miss a Wellness Tip
							</h3>
							<p className="text-gray-700 mb-6 max-w-2xl mx-auto">
								Subscribe to our wellness newsletter and get the latest tips,
								practices, and insights delivered directly to your inbox. Join our
								community of mindful living enthusiasts.
							</p>
							<form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-6">
								<div className="flex gap-2">
									<input
										type="email"
										placeholder="Enter your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
									<button 
										type="submit"
										disabled={isSubscribing}
										className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/80 transition disabled:opacity-50"
									>
										{isSubscribing ? "Subscribing..." : "Subscribe"}
									</button>
								</div>
							</form>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button className="px-6 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition">
									View All Categories
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Blog;