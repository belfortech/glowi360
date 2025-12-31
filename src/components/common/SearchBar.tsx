// components/common/SearchBar.tsx - UPDATED WITH PRESCRIPTION UPLOAD - COMPLETE
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Upload } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrescriptionUploadModal from '../prescription/PrescriptionUploadModal';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for products..." 
}) => {
  const [query, setQuery] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize the onSearch callback to prevent unnecessary re-renders
  const memoizedOnSearch = useCallback(onSearch, [onSearch]);

  // Real-time search with proper debouncing - ONLY when user has typed something
  useEffect(() => {
    // Don't trigger search on initial mount or for empty queries unless user explicitly searched
    if (!hasUserInteracted || (!query.trim() && location.pathname !== '/products')) {
      return;
    }

    const timeoutId = setTimeout(() => {
      console.log('🔍 SearchBar: Triggering search with query:', `"${query}"`);
      
      // If not on products page and user is searching with actual content, navigate to products page
      if (location.pathname !== '/products' && query.trim()) {
        navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      } else {
        // If on products page or empty search, use the onSearch callback
        memoizedOnSearch(query);
      }
    }, 300); // 300ms delay

    // Cleanup function to cancel previous timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, hasUserInteracted, location.pathname, navigate, memoizedOnSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasUserInteracted(true);
    
    console.log('🔍 SearchBar: Form submitted with query:', `"${query}"`);
    
    // If not on products page and user is searching, navigate to products page
    if (location.pathname !== '/products' && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      memoizedOnSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('🔍 SearchBar: Input changed to:', `"${newQuery}"`);
    
    // Mark that user has interacted with the search
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    setQuery(newQuery);
  };

  const handleUploadPrescription = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-4 mb-8">
        {/* Desktop Version */}
        <form onSubmit={handleSubmit} className="relative hidden lg:block">
          <div 
            className="relative flex items-center"
            style={{
              width: '100%',
              maxWidth: '1200px',
              height: '65px',
              borderRadius: '8px',
              background: '#D9D9D940',
              margin: '0 auto',
            }}
          >
            {/* Search Icon */}
            <Search 
              className="absolute left-4 z-10"
              style={{
                width: '24px',
                height: '24px',
                color: '#6C7278',
              }}
            />
            
            {/* Search Input */}
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full h-full pl-16 pr-52 bg-transparent border-none outline-none"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#0A0A0A99',
              }}
            />
            
            {/* Upload Prescription Button */}
            <button
              type="button"
              onClick={handleUploadPrescription}
              className="absolute right-0 flex items-center hover:opacity-90 transition-opacity"
              style={{
                width: '199px',
                height: '64px',
                top: '0.5px',
                borderRadius: '8px',
                gap: '10px',
                padding: '20px',
                background: '#D4AF37',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Upload 
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#FFFFFF',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                Upload Prescription
              </span>
            </button>
          </div>
        </form>

        {/* Mobile Version */}
        <div className="block lg:hidden">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Search Input */}
            <div 
              className="relative flex items-center"
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '8px',
                background: '#D9D9D940',
              }}
            >
              <Search 
                className="absolute left-3 z-10"
                style={{
                  width: '20px',
                  height: '20px',
                  color: '#6C7278',
                }}
              />
              
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full h-full pl-12 pr-4 bg-transparent border-none outline-none text-sm"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#0A0A0A99',
                }}
              />
            </div>

            {/* Upload Button - Separate */}
            <button
              type="button"
              onClick={handleUploadPrescription}
              className="w-full flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{
                height: '50px',
                borderRadius: '8px',
                gap: '8px',
                background: '#D4AF37',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Upload 
                style={{
                  width: '20px',
                  height: '20px',
                  color: '#FFFFFF',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#FFFFFF',
                }}
              >
                Upload Prescription
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Prescription Upload Modal */}
      <PrescriptionUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
      />
    </>
  );
};

export default SearchBar;