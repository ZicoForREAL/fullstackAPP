import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Transform Your Fitness Journey
              </h1>
              <p className="text-xl mb-8">
                Connect with professional coaches, access personalized workout plans, and achieve your fitness goals.
              </p>
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/fitness-hero.jpg"
                alt="Fitness Training"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">Expert Coaches</h3>
            <p className="text-gray-600">
              Connect with certified fitness professionals who will guide you through your journey.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
            <p className="text-gray-600">
              Get customized workout and nutrition plans tailored to your goals and needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">Fitness Store</h3>
            <p className="text-gray-600">
              Access quality fitness products and supplements recommended by experts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-8">
            Join our community of fitness enthusiasts and professional coaches today.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 