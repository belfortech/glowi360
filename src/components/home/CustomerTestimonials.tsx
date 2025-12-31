// components/home/CustomerTestimonials.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: "The skincare consultation was amazing! My skin has never looked better. The personalized advice made all the difference.",
      name: "Emily Johnson",
      position: "Beauty Enthusiast",
      rating: 5,
      image: "/testimonial1.jpg"
    },
    {
      id: 2,
      text: "Glowcare's AI skin analysis gave me insights I never knew I needed. Highly recommend their services to everyone!",
      name: "Michael Chen",
      position: "Verified Customer",
      rating: 5,
      image: "/testimonial2.jpg"
    },
    {
      id: 3,
      text: "The dermatologist consultation was so convenient. Professional service from the comfort of my home. Five stars!",
      name: "Sarah Williams",
      position: "Loyal Customer",
      rating: 5,
      image: "/testimonial3.jpg"
    },
    {
      id: 4,
      text: "I've tried many skincare services, but Glowcare stands out. The quality and attention to detail is unmatched.",
      name: "David Ochieng",
      position: "Premium Member",
      rating: 5,
      image: "/testimonial4.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="w-full py-16 px-4 relative overflow-hidden">
      {/* Background with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0B0B0B 0%, #2B2B2B 50%, #1F1F1F 100%)',
        }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          transform: 'translate(50%, 50%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover why thousands trust Glowcare for their skincare journey
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C9A24D 100%)',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
              }}
            >
              <Quote className="w-7 h-7 text-white" />
            </div>
          </motion.div>

          {/* Main Card */}
          <div
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="flex flex-col items-center text-center"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-6 h-6 fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8 max-w-3xl">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden"
                    style={{
                      border: '3px solid #D4AF37',
                      boxShadow: '0 5px 20px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[currentIndex].name)}&background=D4AF37&color=fff&size=64`;
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg text-white">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {testimonials[currentIndex].position}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            {/* Pagination Dots */}
            <div className="flex gap-2 px-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 8000);
                  }}
                  className="relative w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: index === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {index === currentIndex && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: '#D4AF37',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C9A24D 100%)',
                boxShadow: '0 5px 20px rgba(212, 175, 55, 0.3)',
              }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">10K+</p>
            <p className="text-gray-400 text-sm">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">4.9</p>
            <p className="text-gray-400 text-sm">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">98%</p>
            <p className="text-gray-400 text-sm">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-gray-400 text-sm">Customer Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
