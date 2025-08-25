import React, { useState, useEffect } from "react";
import { FaSpinner, FaSearch, FaShoppingCart, FaHeart, FaTimes, FaTrash } from "react-icons/fa";
import { productService, testFirebaseConnection, imageService } from "../lib/firebase-services";
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
	tags: string[];
	isActive: boolean;
	variants?: any[];
	createdAt?: Date;
	updatedAt?: Date;
}

export default function Shop() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
	const [firebaseStatus, setFirebaseStatus] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [showCart, setShowCart] = useState(false);
	const [showMpesaPayment, setShowMpesaPayment] = useState(false);

	useEffect(() => {
		checkFirebaseAndLoadProducts();
	}, []);

	const checkFirebaseAndLoadProducts = async () => {
		try {
			setLoading(true);
			setFirebaseStatus("Checking Firebase connection...");
			
			const isConnected = await testFirebaseConnection();
			if (isConnected) {
				setFirebaseStatus("Firebase connected, loading products...");
				await loadProducts();
			} else {
				setFirebaseStatus("Firebase connection failed");
			}
		} catch (error) {
			console.error("Error checking Firebase:", error);
			setFirebaseStatus("Error checking Firebase connection");
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

	useEffect(() => {
		let filtered = products;
		
		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter(product => product.category === selectedCategory);
		}
		
		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(product =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}
		
		setFilteredProducts(filtered);
	}, [products, searchTerm, selectedCategory]);

	const addToCart = (product: Product) => {
		setCart(prevCart => {
			const existingItem = prevCart.find(item => item.product.id === product.id);
			if (existingItem) {
				return prevCart.map(item =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				return [...prevCart, { product, quantity: 1 }];
			}
		});
		setShowCart(true);
	};

	const removeFromCart = (productId: string) => {
		setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
	};

	const updateCartQuantity = (productId: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}
		setCart(prevCart =>
			prevCart.map(item =>
				item.product.id === productId
					? { ...item, quantity }
					: item
			)
		);
	};

	const getCartTotal = () => {
		return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
	};

	const getCartItemCount = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const handleCheckout = () => {
		// Show M-Pesa payment procedure
		setShowCart(false);
		setShowMpesaPayment(true);
	};

	const categories = [
		{ value: "all", label: "All Products" },
		{ value: "mats", label: "Yoga Mats" },
		{ value: "accessories", label: "Accessories" },
		{ value: "wellness", label: "Wellness" },
		{ value: "clothing", label: "Clothing" },
		{ value: "books", label: "Books" },
	];

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

					{/* Search and Filters */}
					<div className="mb-8 space-y-4">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1 relative">
								<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search products..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								aria-label="Filter by category"
							>
								{categories.map(category => (
									<option key={category.value} value={category.value}>
										{category.value === "all" ? "All Categories" : category.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Cart Button */}
					<div className="flex justify-end mb-6">
						<button
							onClick={() => setShowCart(true)}
							className="relative px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105"
						>
							<FaShoppingCart className="w-5 h-5" />
							<span className="font-semibold">Shopping Cart</span>
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
									{cart.length}
								</span>
							)}
						</button>
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
								{searchTerm || selectedCategory !== "all" 
									? "Try adjusting your search or filters" 
									: "No products available at the moment"
								}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredProducts.map((product) => (
								<div key={product.id} className="bg-card rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
									{/* Product Image */}
									<div className="relative h-64 bg-muted overflow-hidden">
										{product.imageUrl ? (
											<img
												src={imageService.convertGsUrlToStorageUrl(product.imageUrl)}
												alt={product.name}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
												onError={(e) => {
													const target = e.currentTarget as HTMLImageElement;
													target.style.display = 'none';
													const nextSibling = target.nextElementSibling as HTMLElement;
													if (nextSibling) nextSibling.style.display = 'flex';
												}}
											/>
										) : null}
										<div className={`absolute inset-0 flex items-center justify-center ${product.imageUrl ? 'hidden' : 'flex'}`}>
											<FaHeart className="text-4xl text-muted" />
										</div>
										
										{/* Category Badge */}
										<div className="absolute top-3 left-3">
											<span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
												{product.category}
											</span>
										</div>
										
										{/* Quick Add to Cart Button */}
										<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
											<button
												onClick={() => addToCart(product)}
												className="group relative w-16 h-16 bg-primary text-primary-foreground rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary/90 shadow-lg hover:scale-110 flex items-center justify-center"
												title="Add to Cart"
											>
												<FaShoppingCart className="w-6 h-6 transition-all duration-300 group-hover:scale-110" />
												<span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
													Add to Cart
												</span>
											</button>
										</div>
									</div>

									{/* Product Info */}
									<div className="p-5">
										<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
											{product.name}
										</h3>
										
										<p className="text-muted-foreground text-sm mb-4 leading-relaxed">
											{product.description}
										</p>
										
										{/* Tags */}
										{product.tags && product.tags.length > 0 && (
											<div className="flex flex-wrap gap-2 mb-4">
												{product.tags.slice(0, 3).map((tag, index) => (
													<span key={index} className="inline-block px-2 py-1 rounded bg-secondary bg-opacity-20 text-secondary-foreground text-xs">
														{tag}
													</span>
												))}
											</div>
										)}
										
										<div className="flex items-center justify-between">
											<span className="text-2xl font-bold text-primary">
												KSh {product.price.toLocaleString()}
											</span>
											<button 
												onClick={() => addToCart(product)}
												className="group relative w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110"
												title="Add to Cart"
											>
												<FaShoppingCart className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
												<span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
													Add to Cart
												</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>

			{/* Shopping Cart Modal */}
			{showCart && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6 border-b border-border pb-4">
							<h3 className="text-2xl font-bold text-primary">Shopping Cart</h3>
							<button
								onClick={() => setShowCart(false)}
								className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
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
									className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									Continue Shopping
								</button>
							</div>
						) : (
							<>
								<div className="space-y-4 mb-6">
									{cart.map((item) => (
										<div key={item.product.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-muted bg-opacity-30">
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
												<p className="text-lg font-bold text-primary">KSh {item.product.price.toLocaleString()}</p>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex items-center space-x-2 bg-background rounded-lg p-1">
													<button
														onClick={() => updateCartQuantity(item.product.id!, item.quantity - 1)}
														className="w-8 h-8 rounded-full bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center text-sm font-bold"
													>
														-
													</button>
													<span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
													<button
														onClick={() => updateCartQuantity(item.product.id!, item.quantity + 1)}
														className="w-8 h-8 rounded-full bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center text-sm font-bold"
													>
														+
													</button>
												</div>
												<button
													onClick={() => removeFromCart(item.product.id!)}
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
									<div className="flex justify-between items-center text-lg">
										<span className="font-semibold text-foreground">Total Items:</span>
										<span className="font-bold text-primary">{getCartItemCount()}</span>
									</div>
									<div className="pt-4 space-y-3">
										<button 
											onClick={handleCheckout}
											className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
										>
											Proceed to Checkout
										</button>
										<button 
											onClick={() => setShowCart(false)}
											className="w-full bg-muted text-muted-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
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
					<div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-6 border-b border-border pb-4">
							<h3 className="text-2xl font-bold text-primary">M-Pesa Payment</h3>
							<button
								onClick={() => setShowMpesaPayment(false)}
								className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
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
								<div className="bg-muted p-4 rounded-lg">
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

								<div className="bg-green-50 border border-green-200 p-4 rounded-lg">
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
									onClick={() => {
										setShowMpesaPayment(false);
										setCart([]); // Clear cart after payment
									}}
									className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
								>
									Payment Complete
								</button>
								<button
									onClick={() => setShowMpesaPayment(false)}
									className="flex-1 px-4 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			
			<Footer />
		</div>
	);
}