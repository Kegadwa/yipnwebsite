import React from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const NavbarTest: React.FC = () => {
  const testCases = [
    {
      screenSize: 'Desktop (lg: 1024px+)',
      features: [
        'Gallery dropdown with Edition 1 & Edition 2',
        'Main Gallery link visible',
        'Admin link visible (if admin)',
        'All navigation items visible'
      ]
    },
    {
      screenSize: 'Tablet (md: 768px - lg: 1023px)',
      features: [
        'Mobile hamburger menu',
        'Gallery dropdown in mobile menu',
        'Main Gallery link in mobile menu',
        'Admin link visible in mobile menu (if admin)'
      ]
    },
    {
      screenSize: 'Mobile (sm: 640px - md: 767px)',
      features: [
        'Mobile hamburger menu',
        'Gallery dropdown in mobile menu',
        'Main Gallery link in mobile menu',
        'Admin link hidden from mobile menu'
      ]
    },
    {
      screenSize: 'Small Mobile (< 640px)',
      features: [
        'Mobile hamburger menu',
        'Gallery dropdown in mobile menu',
        'Main Gallery link in mobile menu',
        'Admin link hidden from mobile menu'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FaEye className="mr-2" />
        Navbar Responsive Test Guide
      </h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Test Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open your browser's developer tools (F12)</li>
          <li>Toggle device toolbar (Ctrl+Shift+M)</li>
          <li>Test different screen sizes using the dropdown</li>
          <li>Check that navigation behaves as expected for each size</li>
        </ol>
      </div>

      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaCheck className="text-green-500 mr-2" />
              {testCase.screenSize}
            </h3>
            
            <div className="space-y-2">
              {testCase.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 text-sm" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Key Changes Made:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>✅ <strong>Desktop Navigation:</strong> Gallery dropdown + main Gallery link visible</li>
          <li>✅ <strong>Mobile Navigation:</strong> Gallery dropdown in mobile menu</li>
          <li>✅ <strong>Admin Visibility:</strong> Hidden on small screens (&lt; md breakpoint)</li>
          <li>✅ <strong>Responsive Design:</strong> Different behavior for different screen sizes</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Expected Behavior:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Wide screens:</strong> Full navigation with gallery dropdown and admin link</li>
          <li>• <strong>Medium screens:</strong> Hamburger menu with all links including admin</li>
          <li>• <strong>Small screens:</strong> Hamburger menu without admin link</li>
          <li>• <strong>Gallery access:</strong> Available on all screen sizes via dropdown</li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarTest;

