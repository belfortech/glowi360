// pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <div className="w-32 h-32 bg-background rounded-full mx-auto flex items-center justify-center">
            <Search className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-secondary mb-4">Page Not Found</h1>
        <p className="text-grey mb-8">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-grey mb-4">You might be looking for:</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/products')}
              className="block text-primary hover:text-primary/80 text-sm"
            >
              Browse All Products
            </button>
            <button
              onClick={() => navigate('/login')}
              className="block text-primary hover:text-primary/80 text-sm"
            >
              Login to Your Account
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="block text-primary hover:text-primary/80 text-sm"
            >
              View Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;