import React, { useState, useEffect } from "react";
import { FaSpinner, FaSearch, FaShoppingCart, FaHeart, FaTimes, FaTrash, FaFilter, FaSort, FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaEye } from "react-icons/fa";
import { productService, testFirebaseConnection, imageService, categoryService } from "../lib/firebase-services";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface Product {
	id?: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	imageUrl?: string;
	additionalUrls?: string[];
	tags: string[];
	isActive: boolean;
	variants?: any[];
	createdAt?: Date;
	updatedAt?: Date;
}

interface Category {
	id?: string;
	name: string;
	description: string;
	imageUrl?: string;
	isActive: boolean;
}

interface ProductModalProps {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
	onAddToCart: (product: Product, quantity: number, selectedVariants: { [key: string]: string }) => void;
}

// Color detection function
const getColorFromName = (colorName: string) => {
	const colorMap: { [key: string]: string } = {
		'black': '#000000',
		'white': '#FFFFFF',
		'red': '#FF0000',
		'blue': '#0000FF',
		'green': '#008000',
		'yellow': '#FFFF00',
		'purple': '#800080',
		'orange': '#FFA500',
		'pink': '#FFC0CB',
		'brown': '#A52A2A',
		'gray': '#808080',
		'grey': '#808080',
		'navy': '#000080',
		'maroon': '#800000',
		'olive': '#808000',
		'teal': '#008080',
		'lime': '#00FF00',
		'aqua': '#00FFFF',
		'fuchsia': '#FF00FF',
		'silver': '#C0C0C0',
		'gold': '#FFD700',
		'indigo': '#4B0082',
		'violet': '#EE82EE',
		'coral': '#FF7F50',
		'salmon': '#FA8072',
		'khaki': '#F0E68C',
		'plum': '#DDA0DD',
		'turquoise': '#40E0D0',
		'azure': '#F0FFFF',
		'ivory': '#FFFFF0',
		'snow': '#FFFAFA',
		'mistyrose': '#FFE4E1',
		'lavender': '#E6E6FA',
		'honeydew': '#F0FFF0',
		'mintcream': '#F5FFFA',
		'aliceblue': '#F0F8FF',
		'ghostwhite': '#F8F8FF',
		'whitesmoke': '#F5F5F5',
		'seashell': '#FFF5EE',
		'beige': '#F5F5DC',
		'oldlace': '#FDF5E6',
		'floralwhite': '#FFFAF0',
		'cornsilk': '#FFF8DC',
		'lemonchiffon': '#FFFACD',
		'lightyellow': '#FFFFE0',
		'lightcyan': '#E0FFFF',
		'lightblue': '#ADD8E6',
		'lightgreen': '#90EE90',
		'lightpink': '#FFB6C1',
		'lightsalmon': '#FFA07A',
		'lightcoral': '#F08080',
		'lightsteelblue': '#B0C4DE',
		'lightgray': '#D3D3D3',
		'lightgrey': '#D3D3D3',
		'palegreen': '#98FB98',
		'paleturquoise': '#AFEEEE',
		'palevioletred': '#DB7093',
		'papayawhip': '#FFEFD5',
		'peachpuff': '#FFDAB9',
		'powderblue': '#B0E0E6',
		'rosybrown': '#BC8F8F',
		'sandybrown': '#F4A460',
		'skyblue': '#87CEEB',
		'slategray': '#708090',
		'slategrey': '#708090',
		'springgreen': '#00FF7F',
		'steelblue': '#4682B4',
		'tan': '#D2B48C',
		'thistle': '#D8BFD8',
		'tomato': '#FF6347',
		'wheat': '#F5DEB3',
		'yellowgreen': '#9ACD32'
	};
	
	const normalizedName = colorName.toLowerCase().trim();
	return colorMap[normalizedName] || '#CCCCCC'; // Default gray if color not found
};

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
	const [quantity, setQuantity] = useState(1);

	if (!product) return null;

	// Combine main image with additional URLs
	const images = [
		...(product.imageUrl ? [product.imageUrl] : []),
		...(product.additionalUrls || [])
	];
	
	// Check if all required variants are selected
	const requiredVariants = product.variants?.filter((v: any) => v.type === 'color' || v.type === 'size') || [];
	const allVariantsSelected = requiredVariants.every((variant: any) => selectedVariants[variant.name]);

	const handleAddToCart = () => {
		if (requiredVariants.length > 0 && !allVariantsSelected) {
			alert('Please select all required variants before adding to cart');
			return;
		}
		
		onAddToCart(product, quantity, selectedVariants);
		onClose();
	};

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
			<div className={`bg-card rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
				{/* Header */}
				<div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
					<h2 className="text-lg sm:text-2xl font-bold text-foreground truncate pr-4">{product.name}</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground flex-shrink-0"
					>
						<FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
					</button>
				</div>

				<div className="flex flex-col lg:flex-row">
					{/* Left Side - Image Carousel */}
					<div className="lg:w-1/2 p-4 sm:p-6">
						<div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
							{images.length > 0 ? (
								<>
									<img
										src={imageService.convertGsUrlToStorageUrl(images[selectedImageIndex])}
										alt={product.name}
										className="w-full h-full object-contain p-4"
									/>
									{images.length > 1 && (
										<>
											<button
												onClick={prevImage}
												className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
											>
												<FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
											</button>
											<button
												onClick={nextImage}
												className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
											>
												<FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
											</button>
										</>
									)}
								</>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<FaHeart className="text-4xl sm:text-6xl text-muted" />
								</div>
							)}
						</div>

						{/* Image Thumbnails */}
						{images.length > 1 && (
							<div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
								{images.map((_, index) => (
									<button
										key={index}
										onClick={() => setSelectedImageIndex(index)}
										className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
											index === selectedImageIndex
												? 'border-primary scale-110'
												: 'border-border hover:border-primary/50'
										}`}
									>
										<img
											src={imageService.convertGsUrlToStorageUrl(images[index])}
											alt={`${product.name} ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right Side - Product Details */}
					<div className="lg:w-1/2 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}>
						{/* Price */}
						<div className="text-2xl sm:text-3xl font-bold text-primary">
							KSh {product.price.toLocaleString()}
						</div>

						{/* Description */}
						<div className="space-y-2 sm:space-y-3">
							<h3 className="text-base sm:text-lg font-semibold text-foreground">Description</h3>
							<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
						</div>

						{/* Variants */}
						{product.variants && product.variants.length > 0 && (
							<div className="space-y-2 sm:space-y-3">
								<h3 className="text-base sm:text-lg font-semibold text-foreground">Variants</h3>
								<div className="space-y-2 sm:space-y-3">
									{product.variants.map((variant: any, index: number) => (
										<div key={index} className="space-y-2">
											<label className="text-sm font-medium text-muted-foreground">
												{variant.name} {requiredVariants.some(v => v.name === variant.name) && <span className="text-red-500">*</span>}
											</label>
											<div className="flex flex-wrap gap-2">
												{variant.options.map((option: string, optIndex: number) => (
													<button
														key={optIndex}
														onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
														className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
															selectedVariants[variant.name] === option
																? 'bg-primary text-primary-foreground border-2 border-primary'
																: 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground border-2 border-transparent'
														}`}
													>
														{variant.type === 'color' && (
															<div 
																className="w-3 h-3 rounded-full border border-gray-300" 
																style={{ backgroundColor: getColorFromName(option) }}
																title={option}
															/>
														)}
														{option}
													</button>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Quantity */}
						<div className="space-y-2 sm:space-y-3">
							<h3 className="text-base sm:text-lg font-semibold text-foreground">Quantity</h3>
							<div className="flex items-center gap-3">
								<button
									onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
									className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
								>
									<FaMinus className="w-3 h-3 sm:w-4 sm:h-4" />
								</button>
								<span className="w-12 sm:w-16 text-center text-base sm:text-lg font-semibold">{quantity}</span>
								<button
									onClick={() => setQuantity(prev => prev + 1)}
									className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
								>
									<FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3 pt-4">
							<button
								onClick={handleAddToCart}
								className="w-full bg-primary text-primary-foreground py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
							>
								Add to Cart
							</button>
							<button
								onClick={onClose}
								className="w-full bg-muted text-muted-foreground py-2 sm:py-3 rounded-xl font-medium hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-border"
							>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

interface CartItem {
	product: Product;
	quantity: number;
	selectedVariants?: { [key: string]: string };
}

export default function Shop() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [firebaseStatus, setFirebaseStatus] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
	const [sortBy, setSortBy] = useState<string>("newest");
	const [showCart, setShowCart] = useState(false);
	const [showMpesaPayment, setShowMpesaPayment] = useState(false);
	const [showCheckoutForm, setShowCheckoutForm] = useState(false);
	const [checkoutFormData, setCheckoutFormData] = useState({
		name: '',
		email: '',
		phone: '',
		mpesaCode: ''
	});
	const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [showProductModal, setShowProductModal] = useState(false);

	useEffect(() => {
		checkFirebaseAndLoadData();
	}, []);

	const checkFirebaseAndLoadData = async () => {
		try {
			setLoading(true);
			setFirebaseStatus("Checking Firebase connection...");
			
			const isConnected = await testFirebaseConnection();
			if (isConnected) {
				setFirebaseStatus("Firebase connected, loading data...");
				await Promise.all([loadProducts(), loadCategories()]);
			} else {
				setFirebaseStatus("Firebase connection failed");
			}
		} catch (error) {
			console.error("Error checking Firebase:", error);
			setFirebaseStatus("Firebase connection failed");
		} finally {
			setLoading(false);
		}
	};

	const loadProducts = async () => {
		try {
			console.log("Loading products from Firebase...");
			const allProducts = await productService.readAll();
			console.log("Products loaded:", allProducts);
			console.log("Products length:", allProducts.length);
			
			// Log image URLs for debugging
			allProducts.forEach((product: Product) => {
				if (product.imageUrl) {
					console.log(`Product: ${product.name}, Original URL: ${product.imageUrl}, Converted URL: ${imageService.convertGsUrlToStorageUrl(product.imageUrl)}`);
				}
			});
			
			console.log("Products data:", JSON.stringify(allProducts, null, 2));
			setProducts(allProducts);
			setFilteredProducts(allProducts);
			setFirebaseStatus(`Loaded ${allProducts.length} products successfully`);
		} catch (error) {
			console.error("Error loading products:", error);
			setFirebaseStatus("Failed to load products");
			setProducts([]);
			setFilteredProducts([]);
		}
	};

	const loadCategories = async () => {
		try {
			console.log("Loading categories from Firebase...");
			const allCategories = await categoryService.readAll();
			console.log("Categories loaded:", allCategories);
			setCategories(allCategories);
		} catch (error) {
			console.error("Error loading categories:", error);
			setCategories([]);
		}
	};

	useEffect(() => {
		let filtered = products;
		
		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter(product => product.category === selectedCategory);
		}
		
		// Filter by price range
		filtered = filtered.filter(product => 
			product.price >= priceRange[0] && product.price <= priceRange[1]
		);
		
		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(product =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}
		
		// Sort products
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "name":
					return a.name.localeCompare(b.name);
				case "popular":
					return (b.stock || 0) - (a.stock || 0);
				case "newest":
				default:
					return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
			}
		});
		
		setFilteredProducts(filtered);
	}, [products, searchTerm, selectedCategory, priceRange, sortBy]);

	const addToCart = (product: Product, quantity: number = 1, selectedVariants?: { [key: string]: string }) => {
		setCart(prevCart => {
			// Create a unique key for the cart item based on product and variants
			const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : 'default';
			const existingItemIndex = prevCart.findIndex(item => 
				item.product.id === product.id && 
				JSON.stringify(item.selectedVariants || {}) === variantKey
			);
			
			if (existingItemIndex !== -1) {
				// Update existing item quantity
				const updatedCart = [...prevCart];
				updatedCart[existingItemIndex].quantity += quantity;
				return updatedCart;
			} else {
				// Add new item
				return [...prevCart, { 
					product, 
					quantity, 
					selectedVariants: selectedVariants || {} 
				}];
			}
		});
		setShowCart(true);
	};

	const removeFromCart = (cartItem: CartItem) => {
		setCart(prevCart => prevCart.filter(item => 
			!(item.product.id === cartItem.product.id && 
			  JSON.stringify(item.selectedVariants || {}) === JSON.stringify(cartItem.selectedVariants || {}))
		));
	};

	const updateCartQuantity = (cartItem: CartItem, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(cartItem);
			return;
		}
		setCart(prevCart =>
			prevCart.map(item => {
				if (item.product.id === cartItem.product.id && 
					JSON.stringify(item.selectedVariants || {}) === JSON.stringify(cartItem.selectedVariants || {})) {
					return { ...item, quantity };
				}
				return item;
			})
		);
	};

	const getCartTotal = () => {
		return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
	};

	const getCartItemCount = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const handlePaymentComplete = () => {
		setShowMpesaPayment(false);
		setShowCheckoutForm(true);
	};

	const handleCheckoutFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmittingOrder(true);

		try {
			// Prepare order data
			const orderData = {
				customerInfo: checkoutFormData,
				items: cart,
				total: getCartTotal(),
				orderDate: new Date().toISOString(),
				orderId: `YIPN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
			};

			// Send email receipt
			await sendOrderReceipt(orderData);

			// Clear cart and show success
			setCart([]);
			setShowCheckoutForm(false);
			setCheckoutFormData({ name: '', email: '', phone: '', mpesaCode: '' });
			
			// Show success message
			alert('Order submitted successfully! Check your email for the receipt.');
		} catch (error) {
			console.error('Error submitting order:', error);
			alert('Error submitting order. Please try again.');
		} finally {
			setIsSubmittingOrder(false);
		}
	};

	const sendOrderReceipt = async (orderData: any) => {
		try {
			const response = await fetch('/api/send-order-receipt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				throw new Error('Failed to send receipt');
			}

			return await response.json();
		} catch (error) {
			console.error('Error sending receipt:', error);
			throw error;
		}
	};

	const handleCheckout = () => {
		setShowCart(false);
		setShowMpesaPayment(true);
	};

	const openProductModal = (product: Product) => {
		setSelectedProduct(product);
		setShowProductModal(true);
	};

	const sortOptions = [
		{ value: "newest", label: "Newest First" },
		{ value: "price-low", label: "Price: Low to High" },
		{ value: "price-high", label: "Price: High to Low" },
		{ value: "popular", label: "Most Popular" },
		{ value: "name", label: "Name: A to Z" },
	];

	const maxPrice = Math.max(...products.map(p => p.price), 10000);

	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />
			
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
						YIPN Merchandise
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
						Take a piece of the YIPN experience home with our curated collection of wellness products and branded merchandise.
					</p>
				</div>
			</section>
			
			<main className="flex-1">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-primary mb-4">YIPN Shop</h1>
						<p className="text-xl text-muted-foreground">
							Discover wellness products to enhance your journey
						</p>
					</div>

					{/* Enhanced Filters and Search */}
					<div className="mb-8 space-y-6">
						{/* Search Bar */}
						<div className="relative">
							<FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
							<input
								type="text"
								placeholder="Search products..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-lg"
							/>
						</div>

						{/* Filters Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{/* Category Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
									<FaFilter className="w-4 h-4" />
									Category
								</label>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								>
									<option value="all">All Categories</option>
									{categories.map(category => (
										<option key={category.id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
							</div>

							{/* Price Range Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-muted-foreground">
									Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
								</label>
								<div className="flex gap-2">
									<input
										type="range"
										min="0"
										max={maxPrice}
										value={priceRange[0]}
										onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
										className="flex-1"
									/>
									<input
										type="range"
										min="0"
										max={maxPrice}
										value={priceRange[1]}
										onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
										className="flex-1"
									/>
								</div>
							</div>

							{/* Sort Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
									<FaSort className="w-4 h-4" />
									Sort By
								</label>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								>
									{sortOptions.map(option => (
										<option key={option.value} value={option.value}>
											{option.value === "newest" ? "Newest First" : option.label}
										</option>
									))}
								</select>
							</div>

							{/* Cart Button */}
							<div className="flex items-end">
								<button
									onClick={() => setShowCart(true)}
									className="relative w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
								>
									<FaShoppingCart className="w-5 h-5" />
									<span>Cart ({getCartItemCount()})</span>
								</button>
							</div>
						</div>
					</div>

					{/* Products Grid */}
					{loading ? (
						<div className="text-center py-12">
							<FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-primary" />
							<p className="text-muted-foreground">Loading products...</p>
						</div>
					) : filteredProducts.length === 0 ? (
						<div className="text-center py-12">
							<FaSearch className="text-4xl mx-auto mb-4 text-muted" />
							<p className="text-xl text-muted-foreground mb-2">No products found</p>
							<p className="text-muted-foreground">
								{searchTerm || selectedCategory !== "all" || priceRange[0] > 0 || priceRange[1] < maxPrice
									? "Try adjusting your search or filters" 
									: "No products available at the moment"
								}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredProducts.map((product, index) => (
								<div 
									key={product.id} 
									className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-fade-in border border-border"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									{/* Photo Container */}
									<div className="relative aspect-[1/1.2] bg-muted overflow-hidden rounded-t-2xl">
										{/* Combine main image with additional URLs for slideshow */}
										{(() => {
											const allImages = [
												...(product.imageUrl ? [product.imageUrl] : []),
												...(product.additionalUrls || [])
											];
											
											if (allImages.length > 0) {
												return (
													<div className="relative w-full h-full">
														<img
															src={imageService.convertGsUrlToStorageUrl(allImages[0])}
															alt={product.name}
															className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
															onError={(e) => {
																const target = e.currentTarget as HTMLImageElement;
																target.style.display = 'none';
																const nextSibling = target.nextElementSibling as HTMLElement;
																if (nextSibling) nextSibling.style.display = 'flex';
															}}
														/>
														
														{/* Image counter for multiple images */}
														{allImages.length > 1 && (
															<div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
																1/{allImages.length}
															</div>
														)}
													</div>
												);
											} else {
												return (
													<div className="w-full h-full flex items-center justify-center">
														<FaHeart className="text-6xl text-muted" />
													</div>
												);
											}
										})()}
									</div>

									{/* Product Info */}
									<div className="p-5 space-y-4">
										{/* Product Name */}
										<h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
											{product.name}
										</h3>
										
										{/* Categories and Variants Capsules */}
										<div className="space-y-3">
											{/* Category */}
											<div className="flex flex-wrap gap-2">
												<span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-sm">
													{product.category}
												</span>
											</div>
											
																						{/* Variants Preview */}
											{product.variants && product.variants.length > 0 && (
												<div className="flex flex-wrap gap-2">
													{product.variants.slice(0, 2).map((variant: any, vIndex: number) => (
														<div key={vIndex} className="flex items-center gap-2">
															<span className="text-xs text-muted-foreground">{variant.name}:</span>
															<div className="flex gap-1">
																{variant.options.slice(0, 3).map((option: string, oIndex: number) => (
																	<span
																		key={oIndex}
																		className="w-3 h-3 rounded-full border-2 border-background shadow-sm"
																		style={{ 
																			backgroundColor: variant.type === 'color' ? getColorFromName(option) : '#CCCCCC'
																		}}
																		title={option}
																	/>
																))}
																{variant.options.length > 3 && (
																	<span className="text-xs text-muted-foreground">+{variant.options.length - 3}</span>
																)}
															</div>
														</div>
													))}
												</div>
											)}
										</div>
										
										{/* Spacing */}
										<div className="h-4"></div>
										
										{/* Price and Action Buttons */}
										<div className="flex items-center justify-between">
											<span className="text-2xl font-bold text-primary">
												KSh {product.price.toLocaleString()}
											</span>
											<div className="flex gap-2">
												<button 
													onClick={() => openProductModal(product)}
													className="w-12 h-12 bg-muted text-foreground rounded-xl hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105"
													title="View More"
												>
													<FaEye className="w-4 h-4" />
												</button>
												<button 
													onClick={() => {
														// Check if product has required variants
														const hasRequiredVariants = product.variants?.some((v: any) => v.type === 'color' || v.type === 'size');
														if (hasRequiredVariants) {
															// Open modal for variant selection
															openProductModal(product);
														} else {
															// Add to cart directly if no variants
															addToCart(product);
														}
													}}
													className="w-12 h-12 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105"
													title={product.variants?.some((v: any) => v.type === 'color' || v.type === 'size') ? "Select Variants" : "Add to Cart"}
												>
													<FaShoppingCart className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>

			{/* Product Modal */}
			<ProductModal
				product={selectedProduct}
				isOpen={showProductModal}
				onClose={() => {
					setShowProductModal(false);
					setSelectedProduct(null);
				}}
				onAddToCart={addToCart}
			/>

			{/* Shopping Cart Modal */}
			{showCart && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6 border-b border-border pb-4">
							<h3 className="text-2xl font-bold text-primary">Shopping Cart</h3>
							<button
								onClick={() => setShowCart(false)}
								className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
								title="Close cart"
								aria-label="Close cart"
							>
								<FaTimes className="w-5 h-5" />
							</button>
						</div>
						
						{cart.length === 0 ? (
							<div className="text-center py-12">
								<FaShoppingCart className="text-6xl mx-auto mb-4 text-muted" />
								<p className="text-xl text-muted-foreground mb-2">Your cart is empty</p>
								<p className="text-muted-foreground mb-6">Add some products to get started!</p>
								<button
									onClick={() => setShowCart(false)}
									className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
								>
									Continue Shopping
								</button>
							</div>
						) : (
							<>
								<div className="space-y-4 mb-6">
									{cart.map((item) => (
										<div key={`${item.product.id}-${JSON.stringify(item.selectedVariants || {})}`} className="flex items-center space-x-4 p-4 border border-border rounded-xl bg-muted bg-opacity-30">
											<div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
												{item.product.imageUrl ? (
													<img
														src={imageService.convertGsUrlToStorageUrl(item.product.imageUrl)}
														alt={item.product.name}
														className="w-full h-full object-cover"
														onError={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															target.style.display = 'none';
														}}
													/>
												) : (
													<FaHeart className="text-3xl text-muted" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-foreground text-base mb-1 truncate">{item.product.name}</h4>
												<p className="text-muted-foreground text-sm mb-2">{item.product.description}</p>
												
												{/* Display selected variants */}
												{item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
													<div className="flex flex-wrap gap-1 mb-2">
														{Object.entries(item.selectedVariants).map(([variantName, variantValue]) => (
															<span key={variantName} className="inline-block px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
																{variantName}: {variantValue}
															</span>
														))}
													</div>
												)}
												
												<p className="text-lg font-bold text-primary">KSh {item.product.price.toLocaleString()}</p>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex items-center space-x-2 bg-background rounded-lg p-1">
													<button
														onClick={() => updateCartQuantity(item, item.quantity - 1)}
														className="w-8 h-8 rounded-full bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center text-sm font-bold"
													>
														-
													</button>
													<span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
													<button
														onClick={() => updateCartQuantity(item, item.quantity + 1)}
														className="w-8 h-8 rounded-full bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center text-sm font-bold"
													>
														+
													</button>
												</div>
												<button
													onClick={() => removeFromCart(item)}
													className="text-destructive hover:text-destructive/80 p-2 rounded-full hover:bg-destructive hover:bg-opacity-10 transition-colors"
													title="Remove item"
												>
													<FaTrash className="w-4 h-4" />
												</button>
											</div>
										</div>
									))}
								</div>

								<div className="border-t border-border pt-6 space-y-4">
									<div className="flex justify-between items-center text-lg">
										<span className="font-semibold text-foreground">Subtotal:</span>
										<span className="font-bold text-primary">KSh {getCartTotal().toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold text-foreground">Total Items:</span>
										<span className="font-bold text-primary">{getCartItemCount()}</span>
									</div>
									<div className="pt-4 space-y-3">
										<button 
											onClick={handleCheckout}
											className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
										>
											Proceed to Checkout
										</button>
										<button 
											onClick={() => setShowCart(false)}
											className="w-full bg-muted text-muted-foreground py-3 rounded-xl font-medium hover:bg-muted/80 transition-colors"
										>
											Continue Shopping
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* M-Pesa Payment Modal */}
			{showMpesaPayment && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-6 border-b border-border pb-4">
							<h3 className="text-2xl font-bold text-primary">M-Pesa Payment</h3>
							<button
								onClick={() => setShowMpesaPayment(false)}
								className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
								title="Close payment modal"
								aria-label="Close payment modal"
							>
								<FaTimes className="w-5 h-5" />
							</button>
						</div>
						
						<div className="space-y-6">
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">📱</span>
								</div>
								<h4 className="text-lg font-semibold text-foreground mb-2">Payment via M-Pesa</h4>
								<p className="text-muted-foreground">Total Amount: <span className="font-bold text-primary">KSh {getCartTotal().toLocaleString()}</span></p>
							</div>

							<div className="space-y-4">
								<div className="bg-muted p-4 rounded-xl">
									<h5 className="font-semibold text-foreground mb-3">Payment Steps:</h5>
									<ol className="space-y-2 text-sm text-muted-foreground">
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
											<span>Go to M-Pesa menu on your phone</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
											<span>Select &quot;Buy Goods and Services&quot;</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
											<span>Enter Till Number: <span className="font-bold text-primary">308787</span></span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
											<span>Enter Amount: <span className="font-bold text-primary">KSh {getCartTotal().toLocaleString()}</span></span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
											<span>Enter your M-Pesa PIN</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
											<span>Confirm payment</span>
										</li>
									</ol>
								</div>

								<div className="bg-green-50 border border-green-200 p-4 rounded-xl">
									<h5 className="font-semibold text-green-800 mb-2">Important Notes:</h5>
									<ul className="text-sm text-green-700 space-y-1">
										<li>• Keep your payment confirmation message</li>
										<li>• Payment will be processed within 24 hours</li>
										<li>• You&apos;ll receive an email confirmation</li>
										<li>• For support, contact: yogaintheparknairobi@gmail.com</li>
									</ul>
								</div>
							</div>

							<div className="flex space-x-3 pt-4">
								<button
									onClick={handlePaymentComplete}
									className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
								>
									Payment Complete
								</button>
								<button
									onClick={() => setShowMpesaPayment(false)}
									className="flex-1 px-4 py-3 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Checkout Form Modal */}
			{showCheckoutForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6 border-b border-border pb-4">
							<h3 className="text-2xl font-bold text-primary">Complete Your Order</h3>
							<button
								onClick={() => setShowCheckoutForm(false)}
								className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
								title="Close checkout form"
								aria-label="Close checkout form"
							>
								<FaTimes className="w-5 h-5" />
							</button>
						</div>
						
						<form onSubmit={handleCheckoutFormSubmit} className="space-y-6">
							<div className="space-y-4">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
										Full Name *
									</label>
									<input
										type="text"
										id="name"
										required
										value={checkoutFormData.name}
										onChange={(e) => setCheckoutFormData(prev => ({ ...prev, name: e.target.value }))}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
										placeholder="Enter your full name"
									/>
								</div>

								<div>
									<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
										Email Address *
									</label>
									<input
										type="email"
										id="email"
										required
										value={checkoutFormData.email}
										onChange={(e) => setCheckoutFormData(prev => ({ ...prev, email: e.target.value }))}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
										placeholder="Enter your email address"
									/>
								</div>

								<div>
									<label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
										Phone Number *
									</label>
									<input
										type="tel"
										id="phone"
										required
										value={checkoutFormData.phone}
										onChange={(e) => setCheckoutFormData(prev => ({ ...prev, phone: e.target.value }))}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
										placeholder="Enter your phone number"
									/>
								</div>

								<div>
									<label htmlFor="mpesaCode" className="block text-sm font-medium text-foreground mb-2">
										M-Pesa Transaction Code *
									</label>
									<input
										type="text"
										id="mpesaCode"
										required
										value={checkoutFormData.mpesaCode}
										onChange={(e) => setCheckoutFormData(prev => ({ ...prev, mpesaCode: e.target.value.toUpperCase() }))}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-mono tracking-wider"
										placeholder="Enter M-Pesa code"
										style={{ textTransform: 'uppercase' }}
									/>
								</div>
							</div>

							<div className="bg-muted p-4 rounded-xl">
								<h5 className="font-semibold text-foreground mb-3">Order Summary</h5>
								<div className="space-y-2 text-sm">
									{cart.map((item) => (
										<div key={`${item.product.id}-${JSON.stringify(item.selectedVariants || {})}`} className="flex justify-between">
											<span className="text-muted-foreground">
												{item.product.name} x {item.quantity}
												{item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
													<span className="text-xs block text-muted-foreground">
														({Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')})
													</span>
												)}
											</span>
											<span className="font-medium">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
										</div>
									))}
									<div className="border-t border-border pt-2 mt-2">
										<div className="flex justify-between font-semibold">
											<span>Total:</span>
											<span className="text-primary">KSh {getCartTotal().toLocaleString()}</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex space-x-3 pt-4">
								<button
									type="submit"
									disabled={isSubmittingOrder}
									className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmittingOrder ? 'Submitting...' : 'Submit Order'}
								</button>
								<button
									type="button"
									onClick={() => setShowCheckoutForm(false)}
									className="flex-1 px-4 py-3 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			
			<Footer />
		</div>
	);
}