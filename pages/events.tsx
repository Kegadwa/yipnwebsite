import React, { useState } from "react";
import { FaSpinner, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaCheck, FaPrint } from "react-icons/fa";
import { ticketService, emailService, Event } from "../lib/firebase-services";
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
			{ name: "Yoga Flow Session (Gentle Power Vinyasa)", time: "09:20 - 10:20" },
			{ name: "Tea & Wellness Break", time: "10:20 - 10:50" },
			{ name: "Pilates for Core Strength & Stability", time: "10:50 - 11:35" },
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
					backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
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

					{isPurchased ? (
						<div className="bg-card rounded-2xl shadow-card p-12 mb-8 text-center">
							<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<FaCheck className="text-4xl text-green-600" />
							</div>
							<h2 className="text-2xl font-bold text-foreground mb-4">
								Payment Successful!
							</h2>
							<p className="text-muted-foreground mb-6">
								Thank you {buyerName}! Your tickets have been confirmed and a confirmation email has been sent to {buyerEmail}.
							</p>
							<div className="bg-muted rounded-xl p-6 mb-6">
								<h3 className="text-lg font-semibold mb-4">Your Ticket Numbers:</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{ticketNumbers.map((ticketNumber, index) => (
										<div key={index} className="flex items-center justify-center space-x-2 bg-background rounded-lg p-3 border">
											<FaTicketAlt className="w-4 h-4 text-secondary" />
											<span className="font-mono text-sm">{ticketNumber}</span>
										</div>
									))}
								</div>
							</div>
							<button onClick={() => window.print()} className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors">
								<FaPrint className="inline mr-2" />
								Print Confirmation
							</button>
						</div>
					) : (
						<>
							{/* Current Event Details */}
							<div className="bg-card rounded-2xl shadow-card mb-8 p-8">
								<div className="text-center mb-6">
									<h2 className="text-2xl font-bold text-foreground mb-2">{currentEvent.eventName}</h2>
									<p className="text-lg text-muted-foreground">
										A transformative day of yoga, meditation, and wellness in beautiful Nairobi
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
									<div className="flex items-center justify-center md:justify-start space-x-3">
										<FaCalendarAlt className="w-5 h-5 text-secondary" />
										<span className="text-foreground">Saturday, August 30th, 2024</span>
									</div>
									<div className="flex items-center justify-center md:justify-start space-x-3">
										<FaClock className="w-5 h-5 text-secondary" />
										<span className="text-foreground">9:00 AM onwards</span>
									</div>
									<div className="flex items-center justify-center md:justify-start space-x-3">
										<FaMapMarkerAlt className="w-5 h-5 text-secondary" />
										<span className="text-foreground">TuWork Nairobi</span>
									</div>
								</div>

								{/* Schedule */}
								<div className="mb-8">
									<h3 className="text-xl font-semibold mb-4 text-center text-foreground">Event Schedule</h3>
									<div className="space-y-3">
										{currentEvent.activities.map((activity, index) => (
											<div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
												<span className="font-medium text-foreground">{activity.name}</span>
												<span className="text-secondary text-sm">{activity.time}</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Ticket Purchase */}
							<div className="bg-card rounded-2xl shadow-card p-8">
								<div className="text-center mb-6">
									<h2 className="text-2xl font-bold text-foreground mb-2">Book Your Tickets</h2>
									<p className="text-muted-foreground mb-6">
										Secure your spot for this amazing wellness experience
									</p>
									
									{/* KenyaBuzz Poster */}
									<div className="mb-6">
										<img 
											src="https://static.kenyabuzz.com/posters/events/1756018213231.webp" 
											alt="Yoga in the Park Event Poster" 
											className="w-full max-w-md mx-auto rounded-lg shadow-lg"
										/>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
										<div className="text-center p-4 border rounded-lg transition-all duration-300 hover:border-secondary hover:shadow-md">
											<p className="font-semibold text-lg text-foreground">Individual</p>
											<p className="text-2xl font-bold text-secondary">KSh 2,000</p>
											<p className="text-sm text-muted-foreground">1 ticket</p>
										</div>
										<div className="text-center p-4 border rounded-lg transition-all duration-300 hover:border-secondary hover:shadow-md">
											<p className="font-semibold text-lg text-foreground">Couple</p>
											<p className="text-2xl font-bold text-secondary">KSh 3,800</p>
											<p className="text-sm text-muted-foreground">2 tickets</p>
										</div>
										<div className="text-center p-4 border rounded-lg transition-all duration-300 hover:border-secondary hover:shadow-md">
											<p className="font-semibold text-lg text-foreground">Group of 4</p>
											<p className="text-2xl font-bold text-secondary">KSh 7,600</p>
											<p className="text-sm text-muted-foreground">4 tickets</p>
										</div>
									</div>
									
									<a 
										href="https://kenyabuzz.com/events/event/yoga-in-the-park-1" 
										target="_blank" 
										rel="noopener noreferrer"
										className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
									>
										<FaTicketAlt className="w-6 h-6" />
										<span>Buy Tickets on KenyaBuzz</span>
									</a>
								</div>
							</div>
						</>
					)}
				</div>
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
									<a 
										href="/gallery-edition-1" 
										className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
									>
										<span>View Gallery</span>
									</a>
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
											src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
											alt="Edition 1 yoga session" 
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
										<img 
											src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
											alt="Edition 1 meditation session" 
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
									<a 
										href="/gallery-edition-1" 
										className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
									>
										<span>View Full Gallery</span>
									</a>
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