// components/common/HealthXDifferent.tsx
import React from 'react';
import { 
  Shield, 
  Clock, 
  Heart,
  CheckCircle
} from 'lucide-react';

const HealthXDifferent: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Doctor-Integrated Pharmacy",
      description: "Get prescriptions reviewed by licensed doctors within the platform."
    },
    {
      icon: Shield,
      title: "Verified & Authentic Medication",
      description: "All drugs are approved and compliant with Kenya's PPB and KMFDC regulations."
    },
    {
      icon: Heart,
      title: "Insurance & Subscription Support",
      description: "Check eligibility instantly and pay using insurance or HealthX wellness plans."
    },
    {
      icon: Clock,
      title: "Seamless End-to-End Care",
      description: "From consultation to delivery, HealthX connects pharmacy, telehealth, and chronic care."
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-7 lg:px-4 mb-12">
      <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center"
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Content Section */}
        <div className="w-full max-w-[471px] flex flex-col gap-6">
          <h2 className="font-inter font-semibold text-[28px] text-[#0D0D0D] leading-[130%] mb-1">
            What Makes HealthX Different
          </h2>
          
          <div className="flex flex-col gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-[48px] h-[48px] border-[1.2px] border-[#D9D9D9] rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-[20px] h-[20px] text-[#1364FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-inter font-medium text-[18px] text-[#0C0C0C] mb-1 leading-[130%]">
                    {feature.title}
                  </h3>
                  <p className="font-inter font-normal text-[14px] text-[#6C7278] leading-[140%]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Image Section */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[380px]">
            <img 
              src="/healthx-doctor.jpg" 
              alt="Healthcare professional"
              className="w-full h-auto rounded-[10px] object-cover max-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthXDifferent;