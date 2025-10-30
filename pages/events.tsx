import React, { useState } from "react";
import Link from "next/link";
import { FaSpinner, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaCheck, FaPrint, FaBook, FaDownload, FaMobile } from "react-icons/fa";
import { ticketService, emailService, Event } from "../lib/firebase-services";
import EventCountdown from "../components/EventCountdown";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

// Mock data matching the reference page
const mockEvents = [
	{
		id: "yipn-edition-2",
		eventName: "Yoga in the Park Nairobi - Edition Two",
		date: "2025-08-30",
		time: "08:00",
		venue: "TuWork Nairobi",
		description: "Join us for our second edition of transformative yoga, meditation, and wellness experiences in the heart of Nairobi.",
		activities: [
			{ name: "Registration & Welcome desk", time: "08:00 - 09:00" },
			{ name: "Opening & Grounding meditation", time: "09:00 - 09:20" },
			{ name: "YPilates for Core Strength & Stability", time: "09:20 - 10:20" },
			{ name: "Tea & Wellness Break", time: "10:20 - 10:50" },
			{ name: "Yoga Flow Session (Gentle Power Vinyasa)", time: "10:50 - 11:35" },
			{ name: "Stretch & Unwind Session", time: "11:35 - 12:00" },
			{ name: "Sound Healing Journey", time: "12:00 - 12:45" },
			{ name: "Wellness Lunch Break", time: "12:45 - 13:15" },
			{ name: "Guided Reflection & Journaling", time: "13:15 - 14:00" },
			{ name: "Closing Circle& Affirmations", time: "14:00 - 14:30" },
			{ name: "Vendor Market & Departure", time: "14:30 - 15:00" }
		],
		ticketPrices: {
			individual: 2000,
			couple: 3800,
			group4: 7600
		},
		status: "upcoming"
	}
];

export default function Events() {
	const [selectedTicketType, setSelectedTicketType] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [buyerName, setBuyerName] = useState('');
	const [buyerEmail, setBuyerEmail] = useState('');
	const [isPurchased, setIsPurchased] = useState(false);
	const [ticketNumbers, setTicketNumbers] = useState<string[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showEdition1Modal, setShowEdition1Modal] = useState(false);

	const currentEvent = mockEvents[0];

	const getTicketQuantity = (ticketType: string) => {
		switch (ticketType) {
			case 'individual':
				return quantity;
			case 'couple':
				return quantity * 2;
			case 'group4':
				return quantity * 4;
			default:
				return 0;
		}
	};

	const getTotalPrice = () => {
		if (!selectedTicketType) return 0;
		const price = currentEvent.ticketPrices[selectedTicketType as keyof typeof currentEvent.ticketPrices];
		return price * quantity;
	};

	const generateMultipleTicketNumbers = (count: number): string[] => {
		const tickets: string[] = [];
		for (let i = 0; i < count; i++) {
			tickets.push(`TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
		}
		return tickets;
	};

	const handlePurchase = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!selectedTicketType || !buyerName || !buyerEmail) return;

		setIsProcessing(true);

		try {
			// Create ticket in database
			const ticketData = {
				eventId: currentEvent.id,
				eventTitle: currentEvent.eventName,
				customerName: buyerName,
				customerEmail: buyerEmail,
				customerPhone: "", // Not required in this form
				quantity: getTicketQuantity(selectedTicketType),
				totalAmount: getTotalPrice(),
				status: "confirmed" as const,
				paymentMethod: "M-Pesa",
				ticketNumber: generateMultipleTicketNumbers(1)[0], // Single ticket number for the order
			};

			await ticketService.createTicket(ticketData);

			// Generate ticket numbers for display
			const totalTickets = getTicketQuantity(selectedTicketType);
			const generatedTickets = generateMultipleTicketNumbers(totalTickets);
			setTicketNumbers(generatedTickets);

			// Transform currentEvent to match Event interface for email service
			const eventForEmail: Event = {
				title: currentEvent.eventName,
				description: currentEvent.description,
				date: new Date(currentEvent.date),
				time: currentEvent.time,
				location: currentEvent.venue,
				price: currentEvent.ticketPrices.individual,
				maxTickets: 100, // Default value
				availableTickets: 100, // Default value
				category: 'wellness',
				status: currentEvent.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
			};

			// Send confirmation email
			await emailService.sendTicketConfirmation(ticketData, eventForEmail);

			// Show success state
			setIsPurchased(true);

		} catch (error) {
			console.error("Error purchasing ticket:", error);
			alert("Failed to purchase ticket. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<Navigation />
			
			{/* Hero Section */}
			<section
				className="relative py-32 flex items-center justify-center overflow-hidden"
				style={{
					backgroundImage: `url('/Ed2webp/IMG_8553.webp')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="absolute inset-0 bg-primary/60"></div>
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Events & Tickets
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
						Join us for transformative yoga experiences in the heart of Nairobi. 
						Book your tickets now for our upcoming wellness gathering.
					</p>
				</div>
			</section>
			
			<div className="container mx-auto px-4 py-20">
				<div className="max-w-4xl mx-auto">

					{/* Edition 3 Event Section */}
					<div className="bg-card rounded-2xl shadow-card mb-8 p-4 sm:p-6 md:p-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start md:items-center">
							<div>
								<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Edition 3: A Yoga in the Park Nairobi Sundowner</h2>
								<div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
									<div className="inline-flex items-center gap-2"><FaCalendarAlt /> <span>Sat, 8 Nov 2025</span></div>
									<div className="inline-flex items-center gap-2"><FaClock /> <span>3:00 PM - 9:00 PM</span></div>
									<div className="inline-flex items-center gap-2"><FaMapMarkerAlt /> <span>Amboseli lane, Lavington</span></div>
									<div className="inline-flex items-center gap-2"><FaTicketAlt /> <span>KES 3,800</span></div>
								</div>
								<p className="text-muted-foreground mb-3">Get ready to experience Edition 3 where wellness meets the magic of the golden hour. Slow down with a calming Golden Hour Yoga flow followed by a deeply restorative Sunset Flow and Meditation with Breathwork under the stars.</p>
								<p className="text-muted-foreground mb-6">Your ticket covers the entire rejuvenating experience, with warm infused teas and healthy gourmet snacks — wrapped in soft music, fresh air, and the beautiful energy of the YIPN community.</p>
								<div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
									<div className="sm:self-start">
										<EventCountdown />
									</div>
									<a href="https://kenyabuzz.com/events/event/a-yoga-in-the-park-nairobi-sundowner?fbclid=PAZXh0bgNhZW0CMTEAAacum_hZRm--l3Eck-R7jbgU1Mwc7PDXUvEuKL-GGI2zAntWLGLPuVCk9EQwCQ_aem_Mb01DgL5elAzmyQjGE-KQg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold shadow-button hover:scale-105 transition w-full sm:w-auto">
										Buy Tickets
									</a>
								</div>
							</div>
							<div>
								<a href="https://kenyabuzz.com/events/event/a-yoga-in-the-park-nairobi-sundowner?fbclid=PAZXh0bgNhZW0CMTEAAacum_hZRm--l3Eck-R7jbgU1Mwc7PDXUvEuKL-GGI2zAntWLGLPuVCk9EQwCQ_aem_Mb01DgL5elAzmyQjGE-KQg" target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-card hover:shadow-xl transition">
									<img src="https://static.kenyabuzz.com/posters/events/1759941621523.webp" alt="Edition 3 Poster" className="w-full h-full object-contain" />
								</a>
							</div>
						</div>
					</div>
									</div>
									
					{/* Coming Soon Section removed */}
				</div>
			
				{/* Edition 1 Highlights Section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
								Edition 1 Highlights
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up slide-up-delay-200">
								Relive the magic of our first edition and see what made it such a special experience for our community.
							</p>
						</div>
						
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-6 animate-slide-up slide-up-delay-300">
								<h3 className="text-2xl font-bold text-foreground">
									A Groundbreaking Success
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									Our inaugural event brought together over 150 wellness enthusiasts from across Nairobi, 
									creating an unforgettable day of yoga, meditation, and community connection.
								</p>
								<p className="text-muted-foreground leading-relaxed">
									The event featured multiple yoga sessions, guided meditation workshops, wellness talks, 
									and plenty of opportunities for participants to connect and share their wellness journeys.
								</p>
								
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">150+</p>
										<p className="text-sm text-muted-foreground">Participants</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">8</p>
										<p className="text-sm text-muted-foreground">Instructors</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">6</p>
										<p className="text-sm text-muted-foreground">Sessions</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">4</p>
										<p className="text-sm text-muted-foreground">Hours</p>
									</div>
								</div>
								
								<div className="flex flex-col sm:flex-row gap-4">
									<Link 
										href="/gallery-edition-1" 
										className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
									>
										<span>View Gallery</span>
									</Link>
									<button 
										onClick={() => setShowEdition1Modal(true)}
										className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors"
									>
										<span>Learn More</span>
									</button>
								</div>
							</div>
							
							<div className="grid grid-cols-2 gap-4 animate-slide-up slide-up-delay-400">
								<div className="space-y-4">
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 151.webp" 
											alt="Edition 1 yoga session" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 157.webp" 
											alt="Edition 1 meditation session" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
								</div>
								<div className="space-y-4 pt-8">
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 161.webp" 
											alt="Edition 1 community" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 176.webp" 
											alt="Edition 1 wellness" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			{/* Edition 2 Highlights Section */}
			<section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
								Edition 2 Highlights
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up slide-up-delay-200">
								Experience the evolution of our wellness community through our second transformative event.
							</p>
						</div>
						
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-6 animate-slide-up slide-up-delay-300">
								<h3 className="text-2xl font-bold text-foreground">
									Building on Success
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									Edition 2 brought together over 200 wellness enthusiasts for an expanded day of yoga flows, 
									meditation sessions, pilates workshops, and transformative sound healing experiences.
								</p>
								<p className="text-muted-foreground leading-relaxed">
									The event featured multiple sessions including YPilates for core strength, 
									gentle power vinyasa yoga, guided reflection journaling, and a transformative sound healing journey.
								</p>
								
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">200+</p>
										<p className="text-sm text-muted-foreground">Participants</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">11</p>
										<p className="text-sm text-muted-foreground">Sessions</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">7</p>
										<p className="text-sm text-muted-foreground">Hours</p>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-md">
										<p className="text-2xl font-bold text-secondary">100%</p>
										<p className="text-sm text-muted-foreground">Satisfaction</p>
									</div>
								</div>
								
								<div className="flex flex-col sm:flex-row gap-4">
									<Link 
										href="/gallery-edition-2" 
										className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
									>
										<span>View Gallery</span>
									</Link>
									<Link 
										href="/events" 
										className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors"
									>
										<span>Stay Updated</span>
									</Link>
								</div>
							</div>
							
							<div className="grid grid-cols-2 gap-4 animate-slide-up slide-up-delay-400">
								<div className="space-y-4">
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 181.webp" 
											alt="Edition 2 yoga session" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 183.webp" 
											alt="Edition 2 meditation session" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
								</div>
								<div className="space-y-4 pt-8">
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 193.webp" 
											alt="Edition 2 community" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
                                            src="/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 195.webp" 
											alt="Edition 2 wellness" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			{/* Edition 1 Modal */}
			{showEdition1Modal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex justify-between items-start mb-6">
								<h3 className="text-2xl font-bold text-foreground">Edition 1: The Beginning</h3>
								<button 
									onClick={() => setShowEdition1Modal(false)}
									className="text-muted-foreground hover:text-foreground transition-colors"
									title="Close modal"
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							
							<div className="space-y-6">
								<div>
									<h4 className="text-xl font-semibold text-foreground mb-3">Event Overview</h4>
									<p className="text-muted-foreground leading-relaxed">
										Edition 1 marked the beginning of our journey to bring yoga and wellness to the heart of Nairobi. 
										Held at the beautiful TuWork Nairobi, this inaugural event exceeded all expectations and set the 
										standard for future editions.
									</p>
								</div>
								
								<div>
									<h4 className="text-xl font-semibold text-foreground mb-3">What Happened</h4>
									<ul className="space-y-2 text-muted-foreground">
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Opening ceremony with traditional Kenyan blessings</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Multiple yoga sessions for different skill levels</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Guided meditation and mindfulness workshops</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Wellness talks from certified instructors</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Community networking and connection building</span>
										</li>
										<li className="flex items-start space-x-2">
											<span className="text-green-500 mt-1">•</span>
											<span>Closing ceremony with group meditation</span>
										</li>
									</ul>
								</div>
								
								<div>
									<h4 className="text-xl font-semibold text-foreground mb-3">Impact & Legacy</h4>
									<p className="text-muted-foreground leading-relaxed">
										Edition 1 not only introduced many people to the practice of yoga but also created a lasting 
										community that continues to grow. The success of this event inspired us to make YIPN a regular 
										occurrence, bringing wellness to more people across Nairobi.
									</p>
								</div>
								
								<div className="pt-6 border-t">
									<Link 
										href="/gallery-edition-1" 
										className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
									>
										<span>View Full Gallery</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			
			<Footer />
		</div>
	);
}