import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCamera, FaHeart, FaShare, FaDownload, FaPlus, FaTimes, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import { GALLERY_FOLDERS } from "../lib/gallery-config";

interface GalleryMedia {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	category: 'edition-1' | 'edition-2';
	photographer: string;
	location: string;
	tags: string[];
}

const Gallery = () => {
	const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
	const [showMediaModal, setShowMediaModal] = useState(false);
	const [edition1Images, setEdition1Images] = useState<GalleryMedia[]>([]);
	const [edition2Images, setEdition2Images] = useState<GalleryMedia[]>([]);

	// Load images from gallery config
	useEffect(() => {
		const edition1Folder = GALLERY_FOLDERS['edition-1'];
		if (edition1Folder && edition1Folder.imageUrls.length > 0) {
			// Take only first 15 images and convert to GalleryMedia format
			const images = edition1Folder.imageUrls.slice(0, 15).map((imageUrl, index) => ({
				id: (index + 1).toString(),
				title: `Gallery Image ${index + 1}`,
				description: "Beautiful moment from our wellness community",
				imageUrl: imageUrl,
				category: "edition-1" as const,
				photographer: "YIPN Team",
				location: "Nairobi Park",
				tags: ["yoga", "wellness", "community"]
			}));
			setEdition1Images(images);
		}

		const edition2Folder = GALLERY_FOLDERS['edition-2'];
		if (edition2Folder && edition2Folder.imageUrls.length > 0) {
			// Take only first 15 images and convert to GalleryMedia format
			const images = edition2Folder.imageUrls.slice(0, 15).map((imageUrl, index) => ({
				id: `ed2-${index + 1}`,
				title: `Edition 2 Image ${index + 1}`,
				description: "Beautiful moment from our wellness community",
				imageUrl: imageUrl,
				category: "edition-2" as const,
				photographer: "YIPN Team",
				location: "Nairobi Park",
				tags: ["yoga", "wellness", "community"]
			}));
			setEdition2Images(images);
		}
	}, []);

	const openMediaModal = (media: GalleryMedia) => {
		setSelectedMedia(media);
		setShowMediaModal(true);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			
			{/* Hero Section */}
			<section
				className="relative py-32 flex items-center justify-center overflow-hidden"
				style={{
					backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/thewebsite-3cd60.firebasestorage.app/o/Edition%201%2FOUTFIT%20INSPO%2C%20YOGA%20IN%20THE%20GARDEN%2C%20BIO%20FOODS%2056.jpg?alt=media')`,
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

						{/* Edition 1 Section */}
						<div className="mb-16">
							<div className="flex justify-between items-center mb-8">
								<h2 className="text-3xl font-bold text-primary">Edition One</h2>
								<Link
									href="/gallery-edition-1"
									className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
								>
									<span>View More</span>
									<FaArrowRight />
								</Link>
							</div>
							
					{/* Gallery Carousel - Auto-scrolling marquee */}
					<div className="relative gallery-marquee">
						<div className="gallery-track pb-4">
							{[...edition1Images, ...edition1Images].map((item, idx) => (
								<div
									key={`${item.id}-${idx}`}
									className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
									onClick={() => openMediaModal(item)}
								>
									<img
										src={item.imageUrl}
										alt={item.title}
										className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
										loading="lazy"
									/>
								</div>
							))}
						</div>
					</div>
						</div>

						{/* Edition 2 Section */}
						<div className="mb-16">
							<div className="flex justify-between items-center mb-8">
								<h2 className="text-3xl font-bold text-primary">Edition Two</h2>
								<Link
									href="/gallery-edition-2"
									className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
								>
									<span>View More</span>
									<FaArrowRight />
								</Link>
							</div>
							
							{/* Gallery Carousel - Auto-scrolling marquee */}
							<div className="relative gallery-marquee">
								<div className="gallery-track pb-4">
									{[...edition2Images, ...edition2Images].map((item, idx) => (
										<div
											key={`${item.id}-${idx}`}
											className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
											onClick={() => openMediaModal(item)}
										>
											<img
												src={item.imageUrl}
												alt={item.title}
												className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
												loading="lazy"
											/>
										</div>
									))}
								</div>
							</div>
						</div>


					</div>
				</div>
			</main>

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
										title="Close media modal"
										aria-label="Close media modal"
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
			
			<Footer />
		</div>
	);
};

export default Gallery;