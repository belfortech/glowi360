// components/common/SaleCards.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Stethoscope, Sparkles, ScanFace, ArrowRight, MessageCircle, Star } from 'lucide-react';

const SaleCards: React.FC = () => {
  const navigate = useNavigate();

  // Color palette
  const colors = {
    black: '#0B0B0B',
    gold: '#C9A24D',
    goldLight: '#D4AF37',
    offWhite: '#F5F5F5',
    ivory: '#FAF7F2',
    charcoal: '#2B2B2B',
  };

  // Service categories with icons
  const serviceCategories = [
    {
      id: 1,
      name: 'Dermatologists',
      description: 'Expert skin care',
      link: '/services/dermatologists',
      icon: UserCircle,
    },
    {
      id: 2,
      name: 'Consultations',
      description: 'Professional advice',
      link: '/services/consultations',
      icon: Stethoscope,
    },
    {
      id: 3,
      name: 'Skin Advisory',
      description: 'Personalized tips',
      link: '/services/skin-advisory',
      icon: Sparkles,
    },
    {
      id: 4,
      name: 'AI Skin Analysis',
      description: 'Smart diagnostics',
      link: '/services/ai-skin-analysis',
      icon: ScanFace,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mb-12">
      {/* Health Services Section Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{
            background: `${colors.gold}15`,
            border: `1px solid ${colors.gold}30`,
          }}
        >
          <Star className="w-4 h-4" style={{ color: colors.gold }} />
          <span className="text-sm font-semibold" style={{ color: colors.gold }}>
            Premium Services
          </span>
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: colors.charcoal }}
        >
          Glowcare Health Services
        </h2>
        <p className="text-lg md:text-xl" style={{ color: '#6B7280' }}>
          How can we help you today?
        </p>
      </div>

      {/* Service Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {serviceCategories.map((service, index) => (
          <button
            key={service.id}
            onClick={() => navigate(service.link)}
            className="group relative py-8 px-5 rounded-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            style={{
              background: colors.offWhite,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.gold}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Background gradient on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${colors.ivory} 0%, ${colors.offWhite} 100%)`,
              }}
            />

            {/* Gold accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{
                background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldLight})`,
              }}
            />

            {/* Icon Container */}
            <div className="relative flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.goldLight}10 100%)`,
                  border: `2px solid ${colors.gold}30`,
                }}
              >
                <service.icon
                  className="w-7 h-7 transition-colors duration-300"
                  style={{ color: colors.gold }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="relative text-center">
              <span
                className="block font-bold text-base mb-1 transition-colors duration-300"
                style={{ color: colors.charcoal }}
              >
                {service.name}
              </span>
              <span
                className="text-sm transition-colors duration-300"
                style={{ color: '#9CA3AF' }}
              >
                {service.description}
              </span>
            </div>

            {/* Arrow indicator */}
            <div
              className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
              style={{ background: colors.gold }}
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </div>

            {/* Corner decoration */}
            <div
              className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: colors.gold }}
            />
          </button>
        ))}
      </div>

      {/* Speak to an Advisor Banner */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.black} 0%, ${colors.charcoal} 100%)`,
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top right glow */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, ${colors.gold}40 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
          {/* Bottom left glow */}
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${colors.goldLight}30 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
          {/* Decorative circles */}
          <div
            className="absolute top-10 right-1/4 w-2 h-2 rounded-full"
            style={{ background: colors.gold, opacity: 0.4 }}
          />
          <div
            className="absolute bottom-10 left-1/3 w-3 h-3 rounded-full"
            style={{ background: colors.goldLight, opacity: 0.3 }}
          />
        </div>

        <div className="relative flex flex-col lg:flex-row items-center p-8 lg:p-0">
          {/* Left - Illustration Section */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start lg:pl-12 py-6 lg:py-10">
            <div className="relative">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `conic-gradient(from 0deg, ${colors.gold}00, ${colors.gold}40, ${colors.goldLight}40, ${colors.gold}00)`,
                  transform: 'scale(1.15)',
                }}
              />
              {/* Main circle */}
              <div
                className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                  boxShadow: `0 20px 40px ${colors.gold}40`,
                }}
              >
                {/* Inner content */}
                <div
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.charcoal} 0%, ${colors.black} 100%)`,
                  }}
                >
                  <MessageCircle
                    className="w-12 h-12 lg:w-14 lg:h-14"
                    style={{ color: colors.gold }}
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div
                className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full"
                style={{
                  background: colors.ivory,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <span className="text-xs font-bold" style={{ color: colors.gold }}>
                  FREE
                </span>
              </div>
            </div>
          </div>

          {/* Center - Content Section */}
          <div className="flex-1 px-6 lg:px-12 py-4 lg:py-10 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{
                background: `${colors.gold}20`,
                border: `1px solid ${colors.gold}40`,
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: colors.gold }} />
              <span className="text-xs font-semibold" style={{ color: colors.gold }}>
                Expert Guidance
              </span>
            </div>
            <h3
              className="text-2xl lg:text-4xl font-bold mb-3"
              style={{ color: colors.offWhite }}
            >
              Speak to an Advisor
            </h3>
            <p
              className="text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ color: '#9CA3AF' }}
            >
              Book your free, one-to-one online consultation with one of our qualified beauty and skincare advisors.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
              {['Free Consultation', '24/7 Support', 'Expert Advice'].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: `${colors.gold}30` }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.gold}
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: colors.offWhite }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - CTA Button */}
          <div className="px-6 pb-8 lg:pb-0 lg:pr-12">
            <button
              onClick={() => navigate('/consultation')}
              className="group relative px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                color: colors.black,
                boxShadow: `0 10px 30px ${colors.gold}40`,
              }}
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shine 1.5s infinite',
                }}
              />
              <span className="relative flex items-center gap-2">
                Book Now
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>

            {/* Secondary link */}
            <p className="text-center mt-3">
              <button
                onClick={() => navigate('/services')}
                className="text-sm underline-offset-4 hover:underline transition-colors"
                style={{ color: '#9CA3AF' }}
              >
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
          }}
        />
      </div>

      {/* Shine animation keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `
      }} />
    </section>
  );
};

export default SaleCards;
