import React, { useState, useEffect } from "react";
import { FaCamera, FaVideo, FaHeart, FaShare, FaDownload, FaSpinner, FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import { galleryService, GalleryMedia } from "../lib/firebase-services";

const Gallery = () => {
	const [media, setMedia] = useState<GalleryMedia[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<'all' | 'edition-1' | 'edition-2' | 'user-submitted'>('all');
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [uploadForm, setUploadForm] = useState({
		title: "",
		description: "",
		imageUrl: "",
		category: "edition-2" as 'edition-2' | 'user-submitted',
		tags: "",
		photographer: "",
		location: "",
	});
	const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
	const [showMediaModal, setShowMediaModal] = useState(false);

	// Load media on component mount
	useEffect(() => {
		loadMedia();
	}, [selectedCategory]);

	const loadMedia = async () => {
		try {
			setLoading(true);
			let mediaData: GalleryMedia[];
			
			if (selectedCategory === 'all') {
				mediaData = await galleryService.getAllMedia();
			} else {
				mediaData = await galleryService.getMediaByCategory(selectedCategory);
			}
			
			setMedia(mediaData);
		} catch (error) {
			console.error('Error loading media:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			const mediaData = {
				title: uploadForm.title,
				description: uploadForm.description,
				imageUrl: uploadForm.imageUrl,
				thumbnailUrl: uploadForm.imageUrl,
				category: uploadForm.category,
				tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
				photographer: uploadForm.photographer,
				location: uploadForm.location,
				isApproved: false,
			};

			await galleryService.createMedia(mediaData);
			
			// Reset form and close modal
			setUploadForm({
				title: "",
				description: "",
				imageUrl: "",
				category: "edition-2" as 'edition-2' | 'user-submitted',
				tags: "",
				photographer: "",
				location: "",
			});
			setShowUploadModal(false);
			
			// Reload media
			await loadMedia();
			
			alert('Media uploaded successfully! It will be reviewed and approved soon.');
		} catch (error) {
			console.error('Error uploading media:', error);
			alert('Failed to upload media. Please try again.');
		}
	};

	const openMediaModal = (media: GalleryMedia) => {
		setSelectedMedia(media);
		setShowMediaModal(true);
	};

	const categories = [
		{ id: "all", name: "All Media", count: media.length },
		{ id: "edition-1", name: "Edition One", count: media.filter(m => m.category === 'edition-1').length },
		{ id: "edition-2", name: "Edition Two", count: media.filter(m => m.category === 'edition-2').length },
		{ id: "user-submitted", name: "User Submissions", count: media.filter(m => m.category === 'user-submitted').length },
	];

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex-1 pt-16 bg-muted flex items-center justify-center">
					<div className="text-center">
						<FaSpinner className="animate-spin text-4xl text-secondary mx-auto mb-4" />
						<p className="text-muted-foreground">Loading gallery...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

  return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			
			{/* Hero Section */}
			<section
				className="relative py-32 flex items-center justify-center overflow-hidden"
				style={{
					backgroundImage: `url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="absolute inset-0 bg-primary/60"></div>
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						YIPN Gallery
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
						Capture the spirit of our wellness community through beautiful moments of yoga, meditation, and connection.
					</p>
				</div>
			</section>
			
			<main className="flex-1 pt-16 bg-muted">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-7xl mx-auto">
        {/* Header */}
						<div className="text-center mb-12">
							<h1 className="text-4xl font-bold text-primary mb-4">YIPN™ Gallery</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Explore moments of peace, wellness, and community from our events and community submissions.
          </p>
        </div>

						{/* Category Filter and Upload Button */}
						<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(category.id as 'all' | 'edition-1' | 'edition-2' | 'user-submitted')}
										className={`px-4 py-2 rounded-lg font-medium transition ${
											selectedCategory === category.id
												? "bg-secondary text-secondary-foreground shadow-button"
												: "bg-card text-muted-foreground hover:bg-background hover:text-foreground"
										}`}
									>
										{category.name} ({category.count})
									</button>
								))}
							</div>
							
							<button
								onClick={() => setShowUploadModal(true)}
								className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover flex items-center space-x-2"
							>
								<FaUpload />
								<span>Submit Photo</span>
							</button>
						</div>

						{/* Gallery Grid - Pinterest Style */}
						{media.length === 0 ? (
							<div className="text-center py-12">
								<FaCamera className="text-6xl text-muted mx-auto mb-4" />
								<p className="text-xl text-muted-foreground">No media found</p>
            <p className="text-muted-foreground">
									{selectedCategory === 'all' 
										? 'Be the first to share your wellness journey!' 
										: `No ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} media yet.`
									}
            </p>
          </div>
						) : (
							<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
								{media.map((item) => (
									<div
										key={item.id}
										className="break-inside-avoid mb-4 bg-card rounded-lg shadow-card overflow-hidden hover:shadow-button transition-all duration-300 animate-on-hover cursor-pointer"
										onClick={() => openMediaModal(item)}
									>
										<div className="relative group">
											<img
												src={item.imageUrl}
												alt={item.title}
												className="w-full h-auto object-cover"
												loading="lazy"
											/>
											<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
												<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
													<button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 transition">
														<FaHeart />
													</button>
													<button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 transition">
														<FaShare />
													</button>
													<button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 transition">
														<FaDownload />
													</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
											<h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
												{item.title}
											</h3>
											{item.description && (
												<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
													{item.description}
												</p>
											)}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
												<span className="capitalize">{item.category.replace('-', ' ')}</span>
												{item.photographer && (
													<span>By {item.photographer}</span>
												)}
											</div>
											{item.tags.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{item.tags.slice(0, 3).map((tag, index) => (
														<span
															key={index}
															className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
														>
															#{tag}
														</span>
													))}
													{item.tags.length > 3 && (
														<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
															+{item.tags.length - 3} more
														</span>
													)}
												</div>
											)}
                    </div>
                  </div>
            ))}
          </div>
						)}

						{/* Upload Modal */}
						{showUploadModal && (
							<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
								<div className="bg-card rounded-lg shadow-card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-primary">Submit Your Photo</h3>
										<button
											onClick={() => setShowUploadModal(false)}
											className="text-muted-foreground hover:text-foreground"
										>
											<FaTimes />
										</button>
									</div>
									
									<form onSubmit={handleUpload} className="space-y-4">
										<div className="space-y-2">
											<label htmlFor="title" className="block font-medium text-foreground">
												Photo Title
											</label>
											<input
												id="title"
												type="text"
												required
												value={uploadForm.title}
												onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
												className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
												placeholder="Give your photo a meaningful title"
											/>
										</div>
										
										<div className="space-y-2">
											<label htmlFor="description" className="block font-medium text-foreground">
												Description
											</label>
											<textarea
												id="description"
												value={uploadForm.description}
												onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
												className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
												placeholder="Tell us about this moment..."
												rows={3}
											/>
        </div>

										<div className="space-y-2">
											<label htmlFor="imageUrl" className="block font-medium text-foreground">
												Image URL
											</label>
											<input
												id="imageUrl"
												type="url"
												required
												value={uploadForm.imageUrl}
												onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
												className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
												placeholder="Paste the image URL here"
											/>
											<p className="text-xs text-muted-foreground">
												You can upload to Google Drive, Dropbox, or any image hosting service and paste the link here.
            </p>
          </div>

										<div className="space-y-2">
											<label htmlFor="category" className="block font-medium text-foreground">
												Category
											</label>
											<select
												id="category"
												required
												value={uploadForm.category}
												onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as 'edition-2' | 'user-submitted' })}
												className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
											>
												<option value="edition-2">Edition Two</option>
												<option value="user-submitted">User Submission</option>
											</select>
                    </div>
										
										<div className="space-y-2">
											<label htmlFor="tags" className="block font-medium text-foreground">
												Tags (comma-separated)
											</label>
											<input
												id="tags"
												type="text"
												value={uploadForm.tags}
												onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
												className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
												placeholder="yoga, wellness, peace, community"
											/>
                    </div>
										
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<label htmlFor="photographer" className="block font-medium text-foreground">
													Photographer
												</label>
												<input
													id="photographer"
													type="text"
													value={uploadForm.photographer}
													onChange={(e) => setUploadForm({ ...uploadForm, photographer: e.target.value })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
													placeholder="Your name"
												/>
                  </div>
											
											<div className="space-y-2">
												<label htmlFor="location" className="block font-medium text-foreground">
													Location
												</label>
												<input
													id="location"
													type="text"
													value={uploadForm.location}
													onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder-muted-foreground"
													placeholder="Nairobi, Kenya"
												/>
          </div>
        </div>

										<div className="flex space-x-2 pt-4">
											<button
												type="submit"
												className="flex-1 px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
											>
												Submit Photo
											</button>
											<button
												type="button"
												onClick={() => setShowUploadModal(false)}
												className="flex-1 px-4 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-secondary-foreground transition"
											>
												Cancel
											</button>
										</div>
									</form>
								</div>
							</div>
						)}

						{/* Media Detail Modal */}
						{showMediaModal && selectedMedia && (
							<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
								<div className="bg-card rounded-lg shadow-card p-0 w-full max-w-4xl max-h-[90vh] overflow-hidden">
									<div className="flex flex-col md:flex-row">
										<div className="flex-1">
											<img
												src={selectedMedia.imageUrl}
												alt={selectedMedia.title}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="w-full md:w-80 p-6">
											<div className="flex justify-between items-start mb-4">
												<h3 className="text-xl font-bold text-foreground">{selectedMedia.title}</h3>
												<button
													onClick={() => setShowMediaModal(false)}
													className="text-muted-foreground hover:text-foreground"
												>
													<FaTimes />
												</button>
                </div>
											
											{selectedMedia.description && (
												<p className="text-muted-foreground mb-4">{selectedMedia.description}</p>
											)}
											
											<div className="space-y-3 mb-6">
												{selectedMedia.photographer && (
													<div className="flex items-center space-x-2 text-sm">
														<span className="text-muted-foreground">By:</span>
														<span className="font-medium text-foreground">{selectedMedia.photographer}</span>
                </div>
												)}
												{selectedMedia.location && (
													<div className="flex items-center space-x-2 text-sm">
														<span className="text-muted-foreground">Location:</span>
														<span className="font-medium text-foreground">{selectedMedia.location}</span>
                </div>
												)}
												<div className="flex items-center space-x-2 text-sm">
													<span className="text-muted-foreground">Category:</span>
													<span className="font-medium text-foreground capitalize">
														{selectedMedia.category.replace('-', ' ')}
													</span>
                </div>
              </div>
											
											{selectedMedia.tags.length > 0 && (
												<div className="mb-6">
													<h4 className="font-medium text-foreground mb-2">Tags</h4>
													<div className="flex flex-wrap gap-2">
														{selectedMedia.tags.map((tag, index) => (
															<span
																key={index}
																className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
															>
																#{tag}
															</span>
														))}
													</div>
        </div>
											)}
											
											<div className="flex space-x-2">
												<button className="flex-1 px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover">
													<FaHeart className="inline mr-2" />
													Like
												</button>
												<button className="flex-1 px-4 py-2 rounded bg-muted text-foreground font-semibold hover:bg-background transition">
													<FaShare className="inline mr-2" />
													Share
												</button>
											</div>
              </div>
        </div>
      </div>
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
    </div>
  );
};

export default Gallery;