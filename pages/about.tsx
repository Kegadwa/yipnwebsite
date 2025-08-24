import React from "react";
import { FaHeart, FaHandshake, FaSeedling, FaGlobeAfrica, FaBullseye, FaLightbulb } from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";

const values = [
	{
		icon: <FaHeart className="text-3xl text-secondary" />,
		title: "Wellness First",
		description:
			"We prioritize holistic well-being, creating spaces where mind, body, and spirit can flourish together.",
	},
	{
		icon: <FaHandshake className="text-3xl text-secondary" />,
		title: "Community Connection",
		description:
			"Building meaningful relationships and fostering a supportive network of wellness enthusiasts in Nairobi.",
	},
	{
		icon: <FaSeedling className="text-3xl text-secondary" />,
		title: "Nature Integration",
		description:
			"Connecting with the natural world as an essential part of our wellness practice and environmental consciousness.",
	},
	{
		icon: <FaGlobeAfrica className="text-3xl text-secondary" />,
		title: "Accessibility",
		description:
			"Making yoga and wellness practices accessible to everyone, regardless of experience level or background.",
	},
];

const missions = [
	{
		icon: <FaBullseye className="text-3xl text-secondary" />,
		title: "Our Mission",
		content:
			"To create transformative wellness experiences that bring the Nairobi community together through yoga, meditation, and mindful living practices in beautiful natural settings.",
	},
	{
		icon: <FaLightbulb className="text-3xl text-secondary" />,
		title: "Our Vision",
		content:
			"To be Nairobi&apos;s leading wellness community, inspiring thousands to embrace mindful living while fostering deep connections with nature and each other.",
	},
];

const meditationScene = "/meditation-scene.jpg"; // Use a public asset path

const AboutPage = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-4 py-16">
				{/* Hero Section */}
				<section
					className="relative h-96 flex items-center justify-center overflow-hidden"
					style={{
						backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="absolute inset-0 bg-primary/60"></div>
					<div className="relative z-10 text-center text-white px-4">
						<span className="inline-block px-3 py-1 bg-secondary text-white rounded mb-4">
							Our Story
						</span>
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							About YIPN
						</h1>
						<p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
							Discover the heart and soul behind Yoga in the Park Nairobi -
							where community, wellness, and nature unite.
						</p>
					</div>
				</section>

				{/* Main Content */}
				<section className="py-20 bg-gradient-to-b from-white to-gray-100">
					<div className="container mx-auto px-4">
						{/* Our Story */}
						<div className="max-w-4xl mx-auto mb-20">
							<div className="bg-white rounded-lg shadow p-8 text-center">
								<h2 className="text-3xl font-bold mb-2">Our Story</h2>
								<p className="text-lg text-gray-700 mb-4">
									How Yoga in the Park Nairobi began
								</p>
								<div className="text-gray-700 leading-relaxed">
									<p className="mb-6">
										Yoga in the Park Nairobi (YIPN) was born from a simple yet
										powerful vision: to create accessible, transformative
										wellness experiences in the heart of Kenya&apos;s capital.
										Founded by a group of passionate yoga practitioners and
										wellness enthusiasts, YIPN emerged from the recognition
										that our fast-paced urban lives often disconnect us from
										nature, community, and our inner selves.
									</p>
									<p className="mb-6">
										Our journey began with small gatherings in Nairobi&apos;s green
										spaces, where friends would come together to practice
										yoga, share meditation sessions, and simply connect with
										one another. What started as intimate circles has grown
										into a vibrant community movement that attracts hundreds
										of wellness seekers from all walks of life.
									</p>
									<p className="mb-6">
										Today, YIPN represents more than just yoga sessions. We
										are a community dedicated to holistic wellness,
										environmental consciousness, and the belief that when we come together with intention 
										and mindfulness, we create positive ripples that extend far beyond our mats. Our events feature 
										expert instructors, sound healing practitioners, meditation guides, and wellness educators who 
										share our commitment to authentic, transformative experiences.
									</p>
									<p>
										Every YIPN gathering is an invitation to slow down, breathe deeply, move mindfully, and remember 
										that wellness is not a destination but a journey we can take together. Welcome to our community - 
										we&apos;re honored to be part of your wellness story.
									</p>
								</div>
							</div>
						</div>

						{/* Mission & Vision */}
						<div className="max-w-6xl mx-auto mb-20">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{missions.map((mission) => (
									<div key={mission.title} className="bg-white rounded-lg shadow p-8 text-center">
										<div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
											<span className="text-3xl">{mission.icon}</span>
										</div>
										<h3 className="text-2xl font-bold mb-2">{mission.title}</h3>
										<p className="text-gray-700">{mission.content}</p>
									</div>
								))}
							</div>
						</div>

						{/* Our Values */}
						<div className="max-w-6xl mx-auto mb-20">
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
									Our Core Values
								</h2>
								<p className="text-lg text-gray-700 max-w-2xl mx-auto">
									These values guide everything we do, from planning our events to building our community.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
								{values.map((value) => (
									<div key={value.title} className="bg-white rounded-lg shadow p-8 text-center">
										<div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
											<span className="text-3xl">{value.icon}</span>
										</div>
										<h3 className="text-xl font-bold mb-2">{value.title}</h3>
										<p className="text-gray-700 text-sm">{value.description}</p>
									</div>
								))}
							</div>
						</div>

						{/* Wellness Quotes */}
						<div className="max-w-4xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg shadow p-8 text-center">
									<div className="text-4xl text-secondary mb-4">&quot;</div>
									<p className="text-lg italic text-primary mb-4">
										Yoga is not about touching your toes. It is about what you learn on the way down.
									</p>
									<p className="text-sm text-gray-500">- Judith Hanson Lasater</p>
								</div>
								<div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow p-8 text-center">
									<div className="text-4xl text-secondary mb-4">&quot;</div>
									<p className="text-lg italic text-primary mb-4">
										The success of yoga does not lie in the ability to attain the perfect posture but in how it helps healing.
									</p>
									<p className="text-sm text-gray-500">- T.K.V. Desikachar</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default AboutPage;