// components/common/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const shopByCategory = [
    { name: 'Skincare', path: '/products?category=skincare' },
    { name: 'Haircare', path: '/products?category=haircare' },
    { name: 'Makeup', path: '/products?category=makeup' },
    { name: 'Fragrances', path: '/products?category=fragrances' },
    { name: 'Body Care', path: '/products?category=body-care' },
  ];

  const aboutUs = [
    { name: 'About Glowcare360', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Press', path: '/press' },
  ];

  const ourServices = [
    { name: 'Shop By Brand', path: '/products?filter=brand' },
    { name: 'Skin Consultation', path: '/skin-test' },
    { name: 'Health Services', path: '/health-services' },
    { name: 'Prescription Services', path: '/prescription' },
    { name: 'Store Locator', path: '/store-locator' },
  ];

  const customerCare = [
    { name: 'Delivery & Returns', path: '/delivery' },
    { name: 'My Account', path: '/profile' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Track Order', path: '/orders' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
    { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
    { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com' },
  ];

  const SocialIcon = ({ icon }: { icon: string }) => {
    const icons: Record<string, React.ReactElement> = {
      facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <footer className="w-full" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold" style={{ color: '#0B0B0B' }}>
                  <span className="font-serif italic">Glowcare</span>
                  <span style={{ color: '#C9A24D' }}>360</span>
                </span>
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  Your Trusted Beauty Partner
                </span>
              </div>
            </Link>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              Premium skincare & beauty products delivered to your doorstep.
            </p>
          </div>

          {/* Shop By Category */}
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#C9A24D' }}>
              Shop By Category
            </h3>
            <ul className="space-y-2">
              {shopByCategory.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: '#4B5563' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#C9A24D' }}>
              About Us
            </h3>
            <ul className="space-y-2">
              {aboutUs.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: '#4B5563' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#C9A24D' }}>
              Our Services
            </h3>
            <ul className="space-y-2">
              {ourServices.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: '#4B5563' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#C9A24D' }}>
              Customer Care
            </h3>
            <ul className="space-y-2">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: '#4B5563' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#C9A24D' }}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A24D' }} />
                <a
                  href="tel:+254714016010"
                  className="text-sm transition-colors"
                  style={{ color: '#4B5563' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                >
                  +254 714 016 010
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A24D' }} />
                <a
                  href="mailto:info@glowcare360.com"
                  className="text-sm transition-colors break-all"
                  style={{ color: '#4B5563' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                >
                  info@glowcare360.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A24D' }} />
                <span className="text-sm" style={{ color: '#4B5563' }}>
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-8 h-px"
          style={{ backgroundColor: '#E5E7EB' }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Social Links */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#0B0B0B' }}>
              Find us on
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: '#0B0B0B', color: '#F5F5F5' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A24D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B0B0B';
                  }}
                  aria-label={social.name}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#0B0B0B' }}>
              Payment Methods
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-8 px-3 rounded flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <span className="text-xs font-bold" style={{ color: '#4CAF50' }}>M-PESA</span>
              </div>
              <div className="h-8 w-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <svg viewBox="0 0 38 24" className="h-5">
                  <circle cx="15" cy="12" r="7" fill="#EB001B" />
                  <circle cx="23" cy="12" r="7" fill="#F79E1B" />
                  <path d="M19 7.5c1.3 1.1 2.1 2.8 2.1 4.5s-.8 3.4-2.1 4.5c-1.3-1.1-2.1-2.8-2.1-4.5s.8-3.4 2.1-4.5z" fill="#FF5F00" />
                </svg>
              </div>
              <div className="h-8 w-12 rounded flex items-center justify-center" style={{ backgroundColor: '#1A1F71' }}>
                <span className="text-xs font-bold text-white">VISA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: '#0B0B0B' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                to="/terms"
                className="transition-colors"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                Terms & Conditions
              </Link>
              <span style={{ color: '#4B5563' }}>|</span>
              <Link
                to="/privacy"
                className="transition-colors"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                Privacy Policy
              </Link>
              <span style={{ color: '#4B5563' }}>|</span>
              <Link
                to="/cookies"
                className="transition-colors"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A24D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                Cookie Policy
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm" style={{ color: '#6B7280' }}>
              © 2025 Glowcare360. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
