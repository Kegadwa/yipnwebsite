import React from "react";
import Link from "next/link";
import { FaHome, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<Navigation />
			
			{/* Hero Section */}
			<section className="relative py-32 flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-primary/60"></div>
				<div className="relative z-10 text-center text-white px-4">
					<div className="mb-8">
						{/* YIPN Logo */}
						<div className="mb-6">
							<img 
								src="/2.png" 
								alt="YIPN Logo" 
								className="w-20 h-20 mx-auto object-contain"
							/>
						</div>
						<FaExclamationTriangle className="text-6xl text-yellow-400 mx-auto mb-4" />
						<h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
						<h2 className="text-2xl md:text-3xl font-semibold mb-4">
							Page Not Found
						</h2>
						<p className="text-xl max-w-md mx-auto text-white/90 mb-8">
							The page you&apos;re looking for doesn&apos;t exist or has been moved.
						</p>
					</div>
					
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/">
							<button className="inline-flex items-center space-x-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
								<FaHome className="w-5 h-5" />
								<span>Go Home</span>
							</button>
						</Link>
						<button 
							onClick={() => window.history.back()}
							className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
						>
							<FaArrowLeft className="w-5 h-5" />
							<span>Go Back</span>
						</button>
					</div>
				</div>
			</section>
			
			{/* Additional Help Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h3 className="text-2xl font-bold text-foreground mb-6">
							Looking for something specific?
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Link href="/events" className="group">
								<div className="p-6 bg-card rounded-xl shadow-card hover:shadow-xl transition-all duration-300 group-hover:scale-105">
									<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<FaHome className="w-6 h-6 text-secondary" />
									</div>
									<h4 className="font-semibold text-foreground mb-2">Events</h4>
									<p className="text-sm text-muted-foreground">Find upcoming yoga events and workshops</p>
								</div>
							</Link>
							
							<Link href="/about" className="group">
								<div className="p-6 bg-card rounded-xl shadow-card hover:shadow-xl transition-all duration-300 group-hover:scale-105">
									<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<FaHome className="w-6 h-6 text-secondary" />
									</div>
									<h4 className="font-semibold text-foreground mb-2">About Us</h4>
									<p className="text-sm text-muted-foreground">Learn more about our wellness community</p>
								</div>
							</Link>
							
							<Link href="/contact" className="group">
								<div className="p-6 bg-card rounded-xl shadow-card hover:shadow-xl transition-all duration-300 group-hover:scale-105">
									<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<FaHome className="w-6 h-6 text-secondary" />
									</div>
									<h4 className="font-semibold text-foreground mb-2">Contact</h4>
									<p className="text-sm text-muted-foreground">Get in touch with our team</p>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</section>
			
			<Footer />
		</div>
	);
}
