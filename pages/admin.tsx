import React, { useState, useEffect } from "react";
import { FaChartBar, FaBox, FaExclamationTriangle, FaUsers, FaPlus, FaEdit, FaTrash, FaTimes, FaSpinner, FaLock, FaImage, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import AdminAuthModal from "../components/AdminAuthModal";
import { analyticsService, productService, testFirebaseConnection, imageService, galleryService } from "../lib/firebase-services";
import { Product, GalleryMedia } from "../lib/firebase-services";

const Admin = () => {
	const [merchandise, setMerchandise] = useState<Product[]>([]);
	const [isAddProductOpen, setIsAddProductOpen] = useState(false);
	const [isEditProductOpen, setIsEditProductOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [editForm, setEditForm] = useState({
		name: "",
		description: "",
		price: 0,
		category: "",
		stock: 0,
		imageFile: null as File | null,
		imageUrl: "",
		tags: [] as string[],
	});
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: 0,
		category: "",
		stock: 0,
		imageFile: null as File | null,
		imageUrl: "",
		tags: [] as string[],
	});
	const [loading, setLoading] = useState(true);
	const [firebaseStatus, setFirebaseStatus] = useState<string>("Initializing...");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(true);
	
	// Gallery Management State
	const [galleryPhotos, setGalleryPhotos] = useState<GalleryMedia[]>([]);
	const [pendingPhotos, setPendingPhotos] = useState<GalleryMedia[]>([]);
	const [approvedPhotos, setApprovedPhotos] = useState<GalleryMedia[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<GalleryMedia | null>(null);
	const [showPhotoModal, setShowPhotoModal] = useState(false);
	const [galleryLoading, setGalleryLoading] = useState(false);
	
	// const [authError, setAuthError] = useState("");
	const [stats, setStats] = useState({
		totalEvents: 0,
		totalTickets: 0,
		totalProducts: 0,
		totalOrders: 0,
		ticketRevenue: 0,
		orderRevenue: 0,
		totalRevenue: 0,
	});

	// Admin password (in production, this should be stored securely)
	const ADMIN_PASSWORD = "YIPN2024";

	// Load data on component mount
	useEffect(() => {
		if (isAuthenticated) {
			initializeFirebase();
		}
	}, [isAuthenticated]);

	const handleAuthenticate = async (password: string) => {
		if (password === ADMIN_PASSWORD) {
			setIsAuthenticated(true);
			setShowAuthModal(false);
			// setAuthError("");
		} else {
			// setAuthError("Invalid admin password. Please try again.");
			alert("Invalid admin password. Please try again.");
		}
	};

	const initializeFirebase = async () => {
		try {
			setFirebaseStatus("Connecting to Firebase...");
			// No more initializeAuth — just test connection
			const connected = await testFirebaseConnection();
			if (!connected) {
				throw new Error("Failed to connect to Firebase");
			}
			setFirebaseStatus("Connected to Firebase");
			await loadData();
		} catch (error) {
			console.error("Firebase initialization failed:", error);
			setFirebaseStatus(
				`Firebase Error: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	};

	const loadData = async () => {
		try {
			setLoading(true);
			setFirebaseStatus("Loading data...");

			// First test the connection
			const isConnected = await testFirebaseConnection();
			if (!isConnected) {
				setFirebaseStatus("Firebase connection failed");
				return;
			}

			const [products, dashboardStats] = await Promise.all([
				productService.getAllProducts(),
				analyticsService.getDashboardStats(),
			]);

			setMerchandise(products);
			setStats(dashboardStats);
			
			// Load gallery data
			await loadGalleryData();
			
			setFirebaseStatus("Data loaded successfully");
		} catch (error: unknown) {
			console.error("Error loading data:", error);
			
			let errorMessage = "Unknown error";
			if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
				errorMessage = "Permission denied - Check Firestore security rules";
			} else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
				errorMessage = error.message;
			}
			
			setFirebaseStatus(`Data loading failed: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	const loadGalleryData = async () => {
		try {
			setGalleryLoading(true);
			setFirebaseStatus("Loading gallery data...");
			const [pending, approved] = await Promise.all([
				galleryService.getPendingMedia(),
				galleryService.getAllMedia(),
			]);
			setPendingPhotos(pending);
			setApprovedPhotos(approved);
			setGalleryLoading(false);
			setFirebaseStatus("Gallery data loaded successfully");
		} catch (error) {
			console.error("Error loading gallery data:", error);
			setFirebaseStatus(`Gallery data loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	// Gallery Management Functions
	const handleApprovePhoto = async (photoId: string) => {
		try {
			setFirebaseStatus("Approving photo...");
			await galleryService.approveMedia(photoId);
			await loadGalleryData();
			setFirebaseStatus("Photo approved successfully");
		} catch (error) {
			console.error("Error approving photo:", error);
			setFirebaseStatus(`Failed to approve photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleDeletePhoto = async (photoId: string) => {
		if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
			try {
				setFirebaseStatus("Deleting photo...");
				await galleryService.deleteMedia(photoId);
				await loadGalleryData();
				setFirebaseStatus("Photo deleted successfully");
			} catch (error) {
				console.error("Error deleting photo:", error);
				setFirebaseStatus(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	};

	const openPhotoModal = (photo: GalleryMedia) => {
		setSelectedPhoto(photo);
		setShowPhotoModal(true);
	};

	const closePhotoModal = () => {
		setSelectedPhoto(null);
		setShowPhotoModal(false);
	};

	const handleAddProduct = async () => {
		console.log("handleAddProduct called with:", newProduct);
		
		if (!newProduct.name || !newProduct.description || !newProduct.category) {
			alert("Please fill in all required fields");
			return;
		}

		if (newProduct.price <= 0) {
			alert("Please enter a valid price");
			return;
		}

		if (newProduct.stock < 0) {
			alert("Please enter a valid stock quantity");
			return;
		}

		try {
			console.log("Starting product creation...");
			setFirebaseStatus("Adding product...");

			// Handle image upload if there's a file
			let imageUrl = "";
			if (newProduct.imageFile) {
				try {
					console.log("Processing image upload...");
					console.log("Image file details:", {
						name: newProduct.imageFile.name,
						size: newProduct.imageFile.size,
						type: newProduct.imageFile.type
					});
					
					imageUrl = await imageService.uploadImage(newProduct.imageFile, 'products');
					console.log("Image uploaded successfully:", imageUrl);
				} catch (uploadError) {
					console.error("Image upload failed:", uploadError);
					alert(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
					return; // Don't continue if image upload fails
				}
			}

			const productData = {
				name: newProduct.name.trim(),
				description: newProduct.description.trim(),
				price: newProduct.price,
				category: newProduct.category,
				stock: newProduct.stock,
				imageUrl: imageUrl,
				tags: newProduct.tags.filter(tag => tag.trim() !== ""),
				isActive: true,
			};

			console.log("Product data prepared:", productData);
			console.log("Calling productService.createProduct...");
			
			const productId = await productService.createProduct(productData);
			console.log("Product created successfully with ID:", productId);

			await loadData();

			setNewProduct({
				name: "",
				description: "",
				price: 0,
				category: "",
				stock: 0,
				imageFile: null,
				imageUrl: "",
				tags: [],
			});
			setIsAddProductOpen(false);
			setFirebaseStatus("Product added successfully");
		} catch (error) {
			console.error("Error adding product:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			setFirebaseStatus(`Failed to add product: ${errorMessage}`);
			alert(`Failed to add product: ${errorMessage}`);
		}
	};

	const createTestProduct = async () => {
		console.log("createTestProduct called");
		try {
			console.log("Starting test product creation...");
			setFirebaseStatus("Creating test product...");
			
			// Use the service function instead of creating the data here
			console.log("Calling productService.createTestProduct...");
			const productId = await productService.createTestProduct();
			console.log("Test product created successfully with ID:", productId);
			setFirebaseStatus("Test product created successfully");
			
			// Reload data to show the new product
			console.log("Reloading data...");
			await loadData();
			console.log("Data reloaded successfully");
		} catch (error) {
			console.error("Error creating test product:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
			setFirebaseStatus(`Failed to create test product: ${errorMessage}`);
			alert(`Failed to create test product: ${errorMessage}`);
		}
	};

	const handleEditProduct = async () => {
		console.log("handleEditProduct called with:", editForm);
		
		if (!selectedProduct) return;

		if (!editForm.name || !editForm.description || !editForm.category) {
			alert("Please fill in all required fields");
			return;
		}

		if (editForm.price <= 0) {
			alert("Please enter a valid price");
			return;
		}

		if (editForm.stock < 0) {
			alert("Please enter a valid stock quantity");
			return;
		}

		try {
			console.log("Starting product update...");
			setFirebaseStatus("Updating product...");

			// Handle image upload if there's a new file
			let imageUrl = selectedProduct.imageUrl || "";
			if (editForm.imageFile) {
				try {
					console.log("Processing new image upload...");
					console.log("New image file details:", {
						name: editForm.imageFile.name,
						size: editForm.imageFile.size,
						type: editForm.imageFile.type
					});
					
					imageUrl = await imageService.uploadImage(editForm.imageFile, 'products');
					console.log("New image uploaded successfully:", imageUrl);
				} catch (uploadError) {
					console.error("Image upload failed:", uploadError);
					alert(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
					return; // Don't continue if image upload fails
				}
			}

			const productData = {
				name: editForm.name.trim(),
				description: editForm.description.trim(),
				price:
					typeof editForm.price === "string"
						? parseInt(editForm.price)
						: editForm.price,
				category: editForm.category,
				stock:
					typeof editForm.stock === "string"
						? parseInt(editForm.stock)
						: editForm.stock,
				imageUrl: imageUrl,
				tags: (editForm.tags || []).filter(tag => tag.trim() !== ""),
			};

			console.log("Updated product data prepared:", productData);
			console.log("Calling productService.updateProduct...");

			await productService.updateProduct(selectedProduct.id!, productData);

			console.log("Product updated successfully");
			await loadData();

			setIsEditProductOpen(false);
			setSelectedProduct(null);
			setEditForm({
				name: "",
				description: "",
				price: 0,
				category: "",
				stock: 0,
				imageFile: null,
				imageUrl: "",
				tags: [],
			});
			setFirebaseStatus("Product updated successfully");
		} catch (error) {
			console.error("Error updating product:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			setFirebaseStatus(`Failed to update product: ${errorMessage}`);
			alert(`Failed to update product: ${errorMessage}`);
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			try {
				setFirebaseStatus("Deleting product...");
				await productService.deleteProduct(productId);

				await loadData();
				setFirebaseStatus("Product deleted successfully");
			} catch (error) {
				console.error("Error deleting product:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error occurred";
				setFirebaseStatus(`Failed to delete product: ${errorMessage}`);
				alert(`Failed to delete product: ${errorMessage}`);
			}
		}
	};

	// Show authentication modal if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex-1 pt-16 bg-muted flex items-center justify-center">
					<div className="text-center">
						<div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
							<FaLock className="text-secondary-foreground text-2xl" />
						</div>
						<h1 className="text-2xl font-bold text-primary mb-2">Admin Access Required</h1>
						<p className="text-muted-foreground">Please authenticate to access the admin dashboard.</p>
					</div>
				</main>
				<Footer />
				<AdminAuthModal
					isOpen={showAuthModal}
					onClose={() => setShowAuthModal(false)}
					onAuthenticate={handleAuthenticate}
					isLoading={false}
				/>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex-1 pt-16 bg-muted flex items-center justify-center">
					<div className="text-center">
						<FaSpinner className="animate-spin text-4xl text-secondary mx-auto mb-4" />
						<p className="text-muted-foreground">Loading admin dashboard...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 pt-16 bg-muted">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-7xl mx-auto">
						{/* Header */}
						<div className="flex justify-between items-center mb-8">
							<div>
							<h1 className="text-3xl font-bold text-primary mb-2">YIPN™ Admin Dashboard</h1>
								<p className="text-muted-foreground">Manage your merchandise, track sales, and monitor inventory</p>
							</div>
							<div className="flex items-center space-x-4">
								<div className="text-sm text-muted-foreground">
									Status: <span className="font-medium text-foreground">{firebaseStatus}</span>
								</div>
								<button
									onClick={async () => {
										setFirebaseStatus("Testing connection...");
										const isConnected = await testFirebaseConnection();
										if (isConnected) {
											setFirebaseStatus("Connection successful - Check console for details");
										} else {
											setFirebaseStatus("Connection failed - Check console for details");
										}
									}}
									className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
								>
									Test Connection
								</button>
								<button
									onClick={() => {
										setIsAuthenticated(false);
										setShowAuthModal(true);
									}}
									className="px-3 py-2 text-sm bg-muted text-foreground rounded hover:bg-background transition"
								>
									<FaLock className="inline mr-2" />
									Logout
								</button>
							</div>
						</div>

						{/* Statistics Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
							<div className="bg-card rounded-lg shadow-card p-6 flex items-center space-x-2 animate-on-hover">
								<FaChartBar className="text-3xl text-secondary" />
								<div>
									<p className="text-sm text-muted-foreground">Total Revenue</p>
									<p className="text-2xl font-bold text-primary">KSh {stats.totalRevenue.toLocaleString()}</p>
								</div>
							</div>
							<div className="bg-card rounded-lg shadow-card p-6 flex items-center space-x-2 animate-on-hover">
								<FaBox className="text-3xl text-secondary" />
								<div>
									<p className="text-sm text-muted-foreground">Total Products</p>
									<p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
								</div>
							</div>
							<div className="bg-card rounded-lg shadow-card p-6 flex items-center space-x-2 animate-on-hover">
								<FaExclamationTriangle className="text-3xl text-destructive" />
								<div>
									<p className="text-sm text-muted-foreground">Low Stock Alerts</p>
									<p className="text-2xl font-bold text-destructive">
										{merchandise.filter(item => item.stock < 10).length}
									</p>
								</div>
							</div>
							<div className="bg-card rounded-lg shadow-card p-6 flex items-center space-x-2 animate-on-hover">
								<FaUsers className="text-3xl text-secondary" />
								<div>
									<p className="text-sm text-muted-foreground">Active Orders</p>
									<p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
								</div>
							</div>
						</div>

						{/* Additional Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<div className="bg-card rounded-lg shadow-card p-6">
								<h3 className="text-lg font-semibold text-primary mb-2">Events & Tickets</h3>
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground">
										Total Events: <span className="font-semibold text-foreground">{stats.totalEvents}</span>
									</p>
									<p className="text-sm text-muted-foreground">
										Total Tickets: <span className="font-semibold text-foreground">{stats.totalTickets}</span>
									</p>
									<p className="text-sm text-muted-foreground">
										Ticket Revenue: <span className="font-semibold text-foreground">KSh {stats.ticketRevenue.toLocaleString()}</span>
									</p>
								</div>
							</div>
							<div className="bg-card rounded-lg shadow-card p-6">
								<h3 className="text-lg font-semibold text-primary mb-2">Shop Performance</h3>
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground">
										Order Revenue: <span className="font-semibold text-foreground">KSh {stats.orderRevenue.toLocaleString()}</span>
									</p>
									<p className="text-sm text-muted-foreground">
										Active Products: <span className="font-semibold text-foreground">{merchandise.length}</span>
									</p>
									<p className="text-sm text-muted-foreground">
										Categories: <span className="font-semibold text-foreground">
											{[...new Set(merchandise.map(p => p.category))].length}
										</span>
									</p>
								</div>
							</div>
							<div className="bg-card rounded-lg shadow-card p-6">
								<h3 className="text-lg font-semibold text-primary mb-2">Quick Actions</h3>
								<div className="space-y-2">
									<button
										onClick={() => setIsAddProductOpen(true)}
										className="w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
									>
										<FaPlus className="inline mr-2" />
										Add Product
									</button>
									<button
										onClick={createTestProduct}
										className="w-full px-3 py-2 text-sm bg-wellness text-wellness-foreground rounded hover:bg-wellness/80 transition"
									>
										Create Test Product
									</button>
									<button
										onClick={async () => {
											setFirebaseStatus("Testing product creation...");
											try {
												const testProduct = {
													name: "Test Product",
													description: "This is a test product",
													price: 1000,
													category: "test",
													stock: 10,
													imageUrl: "",
													tags: ["test"],
													isActive: true,
												};
												console.log("Creating test product:", testProduct);
												const productId = await productService.createProduct(testProduct);
												console.log("Test product created with ID:", productId);
												setFirebaseStatus("Test product created successfully");
												await loadData();
											} catch (error) {
												console.error("Test product creation failed:", error);
												setFirebaseStatus(`Test product creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
											}
										}}
										className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
									>
										Test Product Creation (No Image)
									</button>
									<button
										onClick={async () => {
											setFirebaseStatus("Initializing products collection...");
											try {
												await productService.initializeProductsCollection();
												setFirebaseStatus("Products collection initialized");
												await loadData();
											} catch {
												setFirebaseStatus("Failed to initialize products collection");
											}
										}}
										className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
									>
										Initialize Sample Products
									</button>
									<button
										onClick={loadData}
										className="w-full px-3 py-2 text-sm bg-muted text-foreground rounded hover:bg-muted/80 transition"
									>
										Refresh Data
									</button>
								</div>
							</div>
						</div>

						{/* Product Management */}
						<div className="bg-card rounded-lg shadow-card p-8 mb-8">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h2 className="text-2xl font-bold text-primary">Product Management</h2>
									<p className="text-muted-foreground">Add, edit, or remove products from your store</p>
								</div>
								<button
									onClick={() => setIsAddProductOpen(true)}
									className="px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
								>
									<FaPlus className="inline mr-2" />
									Add Product
								</button>
							</div>
							<div className="space-y-4">
								{merchandise.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										<FaBox className="text-4xl mx-auto mb-4 text-muted" />
										<p>No products found. Add your first product to get started!</p>
									</div>
								) : (
									merchandise.map((product) => (
										<div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:shadow-card transition">
										<div className="flex items-center space-x-4">
												<div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
													{product.imageUrl ? (
														<img 
															src={product.imageUrl} 
															alt={product.name}
															className="w-full h-full object-cover"
															onError={(e) => {
																const target = e.currentTarget as HTMLImageElement;
																target.style.display = 'none';
																const nextSibling = target.nextElementSibling as HTMLElement;
																if (nextSibling) nextSibling.style.display = 'flex';
															}}
														/>
													) : null}
													<FaBox className={`text-2xl text-secondary ${product.imageUrl ? 'hidden' : 'flex'}`} />
											</div>
											<div>
													<h3 className="font-semibold text-foreground">{product.name}</h3>
													<p className="text-sm text-muted-foreground">{product.description}</p>
												<div className="flex items-center space-x-2 mt-1">
														<span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
														{product.category}
													</span>
													<span
														className={`inline-block px-2 py-1 rounded text-xs ${
																product.stock < 10 ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
														}`}
													>
														Stock: {product.stock}
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-4">
											<div className="text-right">
													<p className="font-bold text-primary">KSh {product.price.toLocaleString()}</p>
											</div>
											<div className="flex space-x-2">
												<button
													className="px-2 py-1 rounded border border-border hover:bg-muted text-foreground transition"
													onClick={() => {
														setSelectedProduct(product);
														setEditForm({
															name: product.name,
															description: product.description,
															price: product.price,
															category: product.category,
															stock: product.stock,
															imageFile: null,
															imageUrl: product.imageUrl || "",
															tags: product.tags || [],
														});
														setIsEditProductOpen(true);
													}}
												>
														<FaEdit />
												</button>
												<button
														className="px-2 py-1 rounded border border-border hover:bg-muted text-foreground transition"
														onClick={() => handleDeleteProduct(product.id!)}
												>
														<FaTrash />
												</button>
											</div>
										</div>
									</div>
									))
								)}
							</div>
						</div>

						{/* Gallery Management */}
						<div className="bg-card rounded-lg shadow-card p-8 mb-8">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h2 className="text-2xl font-bold text-primary">Gallery Management</h2>
									<p className="text-muted-foreground">Approve, reject, or manage community-submitted photos</p>
								</div>
								<button
									onClick={loadGalleryData}
									disabled={galleryLoading}
									className="px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover disabled:opacity-50"
								>
									{galleryLoading ? <FaSpinner className="inline mr-2 animate-spin" /> : <FaImage className="inline mr-2" />}
									{galleryLoading ? 'Loading...' : 'Refresh Gallery'}
								</button>
							</div>

							{/* Gallery Stats */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="bg-muted rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-primary">{pendingPhotos.length}</div>
									<div className="text-sm text-muted-foreground">Pending Approval</div>
								</div>
								<div className="bg-muted rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-secondary">{approvedPhotos.length}</div>
									<div className="text-sm text-muted-foreground">Approved Photos</div>
								</div>
								<div className="bg-muted rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-wellness">{pendingPhotos.length + approvedPhotos.length}</div>
									<div className="text-sm text-muted-foreground">Total Photos</div>
								</div>
							</div>

							{/* Pending Photos Section */}
							{pendingPhotos.length > 0 && (
								<div className="mb-8">
									<h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
										<FaExclamationTriangle className="text-amber-500 mr-2" />
										Pending Approval ({pendingPhotos.length})
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{pendingPhotos.map((photo) => (
											<div key={photo.id} className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-card transition">
												<div className="aspect-square bg-muted overflow-hidden">
													<img
														src={photo.imageUrl}
														alt={photo.title}
														className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
														onClick={() => openPhotoModal(photo)}
													/>
												</div>
												<div className="p-4">
													<h4 className="font-medium text-foreground mb-2 line-clamp-2">{photo.title}</h4>
													{photo.description && (
														<p className="text-sm text-muted-foreground mb-3 line-clamp-2">{photo.description}</p>
													)}
													<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
														<span>By: {photo.photographer || 'Unknown'}</span>
														<span>{photo.date ? new Date(photo.date).toLocaleDateString() : 'Unknown date'}</span>
													</div>
													<div className="flex space-x-2">
														<button
															onClick={() => handleApprovePhoto(photo.id!)}
															className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
														>
															<FaCheck className="inline mr-1" />
															Approve
														</button>
														<button
															onClick={() => openPhotoModal(photo)}
															className="px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/80 transition-colors"
														>
															<FaEye className="inline mr-1" />
															View
														</button>
														<button
															onClick={() => handleDeletePhoto(photo.id!)}
															className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
														>
															<FaTrash className="inline mr-1" />
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Approved Photos Section */}
							{approvedPhotos.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
										<FaCheck className="text-green-500 mr-2" />
										Approved Photos ({approvedPhotos.length})
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{approvedPhotos.map((photo) => (
											<div key={photo.id} className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-card transition">
												<div className="aspect-square bg-muted overflow-hidden">
													<img
														src={photo.imageUrl}
														alt={photo.title}
														className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
														onClick={() => openPhotoModal(photo)}
													/>
												</div>
												<div className="p-4">
													<h4 className="font-medium text-foreground mb-2 line-clamp-2">{photo.title}</h4>
													{photo.description && (
														<p className="text-sm text-muted-foreground mb-3 line-clamp-2">{photo.description}</p>
													)}
													<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
														<span>By: {photo.photographer || 'Unknown'}</span>
														<span>{photo.date ? new Date(photo.date).toLocaleDateString() : 'Unknown date'}</span>
													</div>
													<div className="flex space-x-2">
														<button
															onClick={() => openPhotoModal(photo)}
															className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/80 transition-colors"
														>
															<FaEye className="inline mr-1" />
															View Details
														</button>
														<button
															onClick={() => handleDeletePhoto(photo.id!)}
															className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
														>
															<FaTrash className="inline mr-1" />
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* No Photos Message */}
							{pendingPhotos.length === 0 && approvedPhotos.length === 0 && (
								<div className="text-center py-8 text-muted-foreground">
									<FaImage className="text-4xl mx-auto mb-4 text-muted" />
									<p>No gallery photos found.</p>
									<p className="text-sm">Photos will appear here once community members upload them.</p>
								</div>
							)}
						</div>

						{/* Add Product Modal */}
						{isAddProductOpen && (
							<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
								<div className="bg-card rounded-lg shadow-card w-full max-w-md max-h-[90vh] flex flex-col">
									{/* Fixed Header */}
									<div className="flex justify-between items-center p-6 border-b border-border flex-shrink-0">
										<h3 className="text-xl font-bold text-primary">Add New Product</h3>
										<button
											onClick={() => setIsAddProductOpen(false)}
											className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
										>
											<FaTimes />
										</button>
									</div>
									
									{/* Scrollable Content */}
									<div className="flex-1 overflow-y-auto p-6">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Product Name
												</label>
												<input
													type="text"
													value={newProduct.name}
													onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
													className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
													placeholder="Enter product name"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Description
												</label>
												<textarea
													value={newProduct.description}
													onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
													className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
													rows={3}
													placeholder="Enter product description"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-foreground mb-2">
														Price (KSh)
													</label>
													<input
														type="number"
														value={newProduct.price}
														onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
														className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
														placeholder="0"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-foreground mb-2">
														Stock
													</label>
													<input
														type="number"
														value={newProduct.stock}
														onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
														className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
														placeholder="0"
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Category
												</label>
												<select
													value={newProduct.category}
													onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
													className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
												>
													<option value="">Select category</option>
													<option value="mats">Yoga Mats</option>
													<option value="accessories">Accessories</option>
													<option value="wellness">Wellness</option>
													<option value="clothing">Clothing</option>
													<option value="books">Books</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Image
												</label>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															setNewProduct(prev => ({ ...prev, imageFile: file }));
														}
													}}
													className="block w-full text-sm text-foreground border border-border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
												/>
												{newProduct.imageFile && (
													<div className="mt-4 flex items-center justify-center w-full">
														<img 
															src={URL.createObjectURL(newProduct.imageFile)} 
															alt="Product Preview" 
															className="max-w-sm max-h-32 object-contain rounded-md"
														/>
													</div>
												)}
											</div>
											<div>
												<label className="block text-sm font-medium text-foreground mb-2">
													Tags (comma separated)
												</label>
												<input
													type="text"
													value={newProduct.tags.join(', ')}
													onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
													className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
													placeholder="yoga, mat, premium"
												/>
											</div>
										</div>
									</div>
									
									{/* Fixed Footer with Buttons */}
									<div className="p-6 border-t border-border flex-shrink-0">
										<div className="flex space-x-2">
											<button
												onClick={handleAddProduct}
												className="flex-1 px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
											>
												Add Product
											</button>
											<button
												onClick={() => setIsAddProductOpen(false)}
												className="flex-1 px-4 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-secondary-foreground transition"
											>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Edit Product Modal */}
						{isEditProductOpen && selectedProduct && (
							<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
								<div className="bg-card rounded-lg shadow-card w-full max-w-md max-h-[90vh] flex flex-col">
									{/* Fixed Header */}
									<div className="flex justify-between items-center p-6 border-b border-border flex-shrink-0">
										<h3 className="text-xl font-bold text-primary">Edit Product</h3>
										<button
											onClick={() => setIsEditProductOpen(false)}
											className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
										>
											<FaTimes />
										</button>
									</div>
									
									{/* Scrollable Content */}
									<div className="flex-1 overflow-y-auto p-6">
										<div className="space-y-4">
											<div className="space-y-2">
												<label htmlFor="edit-name" className="block font-medium text-foreground">
													Product Name
												</label>
												<input
													id="edit-name"
													value={editForm.name}
													onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
												/>
											</div>
											<div className="space-y-2">
												<label htmlFor="edit-description" className="block font-medium text-foreground">
													Description
												</label>
												<textarea
													id="edit-description"
													value={editForm.description}
													onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<label htmlFor="edit-price" className="block font-medium text-foreground">
														Price (KSh)
													</label>
													<input
														id="edit-price"
														type="number"
														value={editForm.price}
														onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
														className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
													/>
												</div>
												<div className="space-y-2">
													<label htmlFor="edit-stock" className="block font-medium text-foreground">
														Stock
													</label>
													<input
														id="edit-stock"
														type="number"
														value={editForm.stock}
														onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
														className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<label htmlFor="edit-category" className="block font-medium text-foreground">
													Category
												</label>
												<select
													id="edit-category"
													value={editForm.category}
													onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
												>
													<option value="mats">Yoga Mats</option>
													<option value="accessories">Accessories</option>
													<option value="wellness">Wellness</option>
													<option value="clothing">Clothing</option>
													<option value="books">Books</option>
												</select>
											</div>
											<div className="space-y-2">
												<label htmlFor="edit-imageUrl" className="block font-medium text-foreground">
													Image
												</label>
												<input
													id="edit-imageUrl"
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															setEditForm(prev => ({ ...prev!, imageFile: file }));
														}
													}}
													className="block w-full text-sm text-foreground border border-border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
												/>
												{editForm.imageFile && (
													<div className="mt-4 flex items-center justify-center w-full">
														<img 
															src={URL.createObjectURL(editForm.imageFile)} 
															alt="Product Preview" 
															className="max-w-sm max-h-32 object-contain rounded-md"
														/>
													</div>
												)}
											</div>
											<div className="space-y-2">
												<label htmlFor="edit-tags" className="block font-medium text-foreground">
													Tags (comma separated)
												</label>
												<input
													id="edit-tags"
													type="text"
													value={editForm.tags?.join(', ') || ""}
													onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
													className="w-full px-4 py-2 rounded border border-border bg-input text-foreground"
													placeholder="yoga, mat, premium"
												/>
											</div>
										</div>
									</div>
									
									{/* Fixed Footer with Buttons */}
									<div className="p-6 border-t border-border flex-shrink-0">
										<div className="flex space-x-2">
											<button
												onClick={handleEditProduct}
												className="flex-1 px-4 py-2 rounded bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition shadow-button hover:shadow-button-hover"
											>
												Update Product
											</button>
											<button
												onClick={() => setIsEditProductOpen(false)}
												className="flex-1 px-4 py-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-secondary-foreground transition"
											>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Photo Detail Modal */}
						{showPhotoModal && selectedPhoto && (
							<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
								<div className="bg-card rounded-lg shadow-card w-full max-w-4xl max-h-[90vh] flex flex-col">
									{/* Fixed Header */}
									<div className="flex justify-between items-center p-6 border-b border-border flex-shrink-0">
										<h3 className="text-xl font-bold text-primary">Photo Details</h3>
										<button
											onClick={closePhotoModal}
											className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
										>
											<FaTimes />
										</button>
									</div>
									
									{/* Scrollable Content */}
									<div className="flex-1 overflow-y-auto p-6">
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
											{/* Image Display */}
											<div className="space-y-4">
												<div className="aspect-square bg-muted rounded-lg overflow-hidden">
													<img
														src={selectedPhoto.imageUrl}
														alt={selectedPhoto.title}
														className="w-full h-full object-cover"
													/>
												</div>
												{selectedPhoto.thumbnailUrl && selectedPhoto.thumbnailUrl !== selectedPhoto.imageUrl && (
													<div className="aspect-square bg-muted rounded-lg overflow-hidden">
														<img
															src={selectedPhoto.thumbnailUrl}
															alt={`${selectedPhoto.title} thumbnail`}
															className="w-full h-full object-cover"
														/>
													</div>
												)}
											</div>
											
											{/* Photo Information */}
											<div className="space-y-4">
												<div>
													<h4 className="text-lg font-semibold text-foreground mb-2">{selectedPhoto.title}</h4>
													{selectedPhoto.description && (
														<p className="text-muted-foreground">{selectedPhoto.description}</p>
													)}
												</div>
												
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-muted-foreground">Photographer:</span>
														<span className="text-sm text-foreground">{selectedPhoto.photographer || 'Unknown'}</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-muted-foreground">Category:</span>
														<span className="text-sm text-foreground capitalize">{selectedPhoto.category}</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-muted-foreground">Location:</span>
														<span className="text-sm text-foreground">{selectedPhoto.location || 'Not specified'}</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-muted-foreground">Date:</span>
														<span className="text-sm text-foreground">
															{selectedPhoto.date ? new Date(selectedPhoto.date).toLocaleDateString() : 'Unknown'}
														</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-muted-foreground">Status:</span>
														<span className={`text-sm px-2 py-1 rounded-full ${
															selectedPhoto.isApproved 
																? 'bg-green-100 text-green-800' 
																: 'bg-amber-100 text-amber-800'
														}`}>
															{selectedPhoto.isApproved ? 'Approved' : 'Pending Approval'}
														</span>
													</div>
												</div>
												
												{/* Tags */}
												{selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
													<div>
														<span className="text-sm font-medium text-muted-foreground block mb-2">Tags:</span>
														<div className="flex flex-wrap gap-2">
															{selectedPhoto.tags.map((tag, index) => (
																<span
																	key={index}
																	className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded-full"
																>
																	{tag}
																</span>
															))}
														</div>
													</div>
												)}
												
												{/* Action Buttons */}
												<div className="pt-4 border-t border-border">
													{!selectedPhoto.isApproved && (
														<button
															onClick={() => {
																handleApprovePhoto(selectedPhoto.id!);
																closePhotoModal();
															}}
															className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors mb-3"
														>
															<FaCheck className="inline mr-2" />
															Approve Photo
														</button>
													)}
													<button
														onClick={() => {
															handleDeletePhoto(selectedPhoto.id!);
															closePhotoModal();
														}}
														className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
													>
														<FaTrash className="inline mr-2" />
														Delete Photo
													</button>
												</div>
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

export default Admin;