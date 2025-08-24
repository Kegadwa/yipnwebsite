import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-blue-600">YIPN</span>
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/">
              <span className="text-gray-700 hover:text-blue-600">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <span className="text-gray-700 hover:text-blue-600">About</span>
            </Link>
          </li>
          <li>
            <Link href="/events">
              <span className="text-gray-700 hover:text-blue-600">Events</span>
            </Link>
          </li>
          <li>
            <Link href="/shop">
              <span className="text-gray-700 hover:text-blue-600">Shop</span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="text-gray-700 hover:text-blue-600">Contact</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
