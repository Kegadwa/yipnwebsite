import React from "react";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";

// Example mock data for blog posts
const mockWellnessPosts = [
	{
		id: "1",
		title: "5 Yoga Poses for Beginners",
		excerpt: "Start your yoga journey with these simple poses.",
		author: "Jane Doe",
		date: "2025-08-01",
	},
	{
		id: "2",
		title: "Meditation for Stress Relief",
		excerpt: "Learn how meditation can help you manage stress.",
		author: "John Smith",
		date: "2025-08-05",
	},
	// ...add more posts as needed
];

const Blog = () => {
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

					{/* Featured Post */}
					<div className="max-w-4xl mx-auto mb-16">
						<div className="bg-white rounded-lg shadow p-8 flex flex-col lg:flex-row gap-8">
							<div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
								<span className="text-6xl">📖</span>
							</div>
							<div className="flex-1 flex flex-col justify-center">
								<span className="inline-block px-3 py-1 border border-secondary text-secondary rounded mb-4 w-fit">
									Featured
								</span>
								<h2 className="text-2xl mb-4 font-bold">
									{mockWellnessPosts[0].title}
								</h2>
								<p className="mb-6 text-base leading-relaxed text-gray-700">
									{mockWellnessPosts[0].excerpt}
								</p>
								<div className="flex items-center text-sm text-gray-500 mb-6">
									<span className="mr-4">👤 {mockWellnessPosts[0].author}</span>
									<span>
										📅{" "}
										{new Date(mockWellnessPosts[0].date).toLocaleDateString()}
									</span>
								</div>
								<a
									href={`/blog/${mockWellnessPosts[0].id}`}
									className="inline-block px-6 py-2 rounded bg-secondary text-white font-semibold shadow hover:scale-105 transition"
								>
									Read Full Article →
								</a>
							</div>
						</div>
					</div>

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

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{mockWellnessPosts.slice(1).map((post, index) => (
								<div
									key={post.id}
									className="bg-white rounded-lg shadow p-6 hover:scale-105 transition"
								>
									<div className="flex items-center justify-center mb-4">
										<span className="text-4xl">🌿</span>
									</div>
									<h3 className="text-xl mb-3 font-bold">{post.title}</h3>
									<p className="mb-4 text-sm leading-relaxed text-gray-700">
										{post.excerpt}
									</p>
									<div className="flex items-center text-xs text-gray-500 mb-4">
										<span className="mr-3">👤 {post.author}</span>
										<span>
											📅 {new Date(post.date).toLocaleDateString()}
										</span>
									</div>
									<a
										href={`/blog/${post.id}`}
										className="block w-full px-4 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition"
									>
										Read More →
									</a>
								</div>
							))}
						</div>
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
									{ name: "Yoga Practice", icon: "🧘‍♀️", count: 12 },
									{ name: "Meditation", icon: "🕯️", count: 8 },
									{ name: "Mindfulness", icon: "🌸", count: 15 },
									{ name: "Wellness Tips", icon: "🌿", count: 20 },
								].map((category) => (
									<button
										key={category.name}
										className="h-auto p-4 flex flex-col items-center border rounded hover:bg-gray-100 transition"
									>
										<span className="text-2xl mb-2">{category.icon}</span>
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
							<span className="text-6xl mb-6 block">📖</span>
							<h3 className="text-2xl font-bold mb-4">
								Never Miss a Wellness Tip
							</h3>
							<p className="text-gray-700 mb-6 max-w-2xl mx-auto">
								Subscribe to our wellness newsletter and get the latest tips,
								practices, and insights delivered directly to your inbox. Join our
								community of mindful living enthusiasts.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
								<button className="px-6 py-2 rounded bg-secondary text-white font-semibold hover:scale-105 transition">
									Subscribe to Blog
								</button>
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