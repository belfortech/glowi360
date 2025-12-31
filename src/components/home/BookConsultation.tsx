// components/home/BookConsultation.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const BookConsultation: React.FC = () => {
  return (
    <section
      className="w-full py-12 lg:py-16"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2
              className="text-2xl lg:text-3xl font-bold mb-2"
              style={{ color: '#F5F5F5' }}
            >
              Book Your <span style={{ color: '#C9A24D' }}>Consultation</span> Today
            </h2>
            <p
              className="text-sm lg:text-base"
              style={{ color: '#9CA3AF' }}
            >
              Connect with certified doctors for expert healthcare advice.
            </p>
          </div>

          {/* CTA Button */}
          <button
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#C9A24D',
              color: '#0B0B0B',
              boxShadow: '0 4px 20px rgba(201, 162, 77, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4B65E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A24D';
            }}
          >
            Book Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookConsultation;
