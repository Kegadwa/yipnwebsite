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
									<p className="text-muted-foreground">
										Secure your spot for this amazing wellness experience
									</p>
								</div>
								<form onSubmit={handlePurchase} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="block text-sm font-medium text-foreground">Ticket Type</label>
											<select 
												value={selectedTicketType} 
												onChange={(e) => setSelectedTicketType(e.target.value)}
												className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
											>
												<option value="">Select ticket type</option>
												<option value="individual">Individual - KSh 2,000</option>
												<option value="couple">Couple - KSh 3,800</option>
												<option value="group4">Group of 4 - KSh 7,600</option>
											</select>
										</div>

										<div className="space-y-2">
											<label className="block text-sm font-medium text-foreground">Quantity</label>
											<select 
												value={quantity} 
												onChange={(e) => setQuantity(parseInt(e.target.value))}
												className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
											>
												{[1, 2, 3, 4, 5].map((num) => (
													<option key={num} value={num}>{num}</option>
												))}
											</select>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="block text-sm font-medium text-foreground">Full Name</label>
											<input
												type="text"
												value={buyerName}
												onChange={(e) => setBuyerName(e.target.value)}
												placeholder="Enter your full name"
												required
												className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
											/>
										</div>

										<div className="space-y-2">
											<label className="block text-sm font-medium text-foreground">Email Address</label>
											<input
												type="email"
												value={buyerEmail}
												onChange={(e) => setBuyerEmail(e.target.value)}
												placeholder="Enter your email address"
												required
												className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-background text-foreground"
											/>
										</div>
									</div>

									{selectedTicketType && (
										<div className="bg-muted rounded-lg p-6">
											<h4 className="font-semibold mb-2 text-foreground">Order Summary</h4>
											<div className="flex justify-between items-center mb-2">
												<span className="text-foreground">{selectedTicketType} ticket(s) x {quantity}</span>
												<span className="font-semibold text-foreground">KSh {getTotalPrice().toLocaleString()}</span>
											</div>
											<div className="flex justify-between items-center text-sm text-muted-foreground">
												<span>Total tickets: {getTicketQuantity(selectedTicketType)}</span>
											</div>
										</div>
									)}

									<button 
										type="submit" 
										disabled={!selectedTicketType || !buyerName || !buyerEmail || isProcessing}
										className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
											!selectedTicketType || !buyerName || !buyerEmail || isProcessing
												? "bg-muted text-muted-foreground cursor-not-allowed"
												: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transform hover:scale-105"
										}`}
									>
										{isProcessing ? (
											<>
												<FaSpinner className="inline mr-3 animate-spin" />
												Processing...
											</>
										) : (
											<>
												<FaTicketAlt className="inline mr-3" />
												Purchase Tickets - KSh {getTotalPrice().toLocaleString()}
											</>
										)}
									</button>
								</form>
							</div>
						</>
					)}
				</div>
			</div>
			
			<Footer />
		</div>
	);
}