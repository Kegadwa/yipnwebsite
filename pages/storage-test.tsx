import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import StorageTest from '../components/StorageTest';

const StorageTestPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Firebase Storage Test - YIPN</title>
        <meta name="description" content="Test Firebase Storage upload functionality" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Firebase Storage Test
              </h1>
              <p className="text-gray-600">
                Use this page to test and debug Firebase Storage upload functionality
              </p>
            </div>
            
            <StorageTest />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default StorageTestPage;








