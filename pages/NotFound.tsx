import React from "react";
import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center px-4">
				<div className="mb-8">
					<FaExclamationTriangle className="text-6xl text-destructive mx-auto mb-4" />
					<h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
					<h2 className="text-2xl font-semibold text-muted-foreground mb-4">
						Page Not Found
					</h2>
					<p className="text-muted-foreground mb-8 max-w-md mx-auto">
						The page you&apos;re looking for doesn&apos;t exist or has been moved.
					</p>
				</div>
				<Link href="/">
					<button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
						<FaHome className="inline mr-2" />
						Go Home
					</button>
				</Link>
			</div>
		</div>
	);
}
