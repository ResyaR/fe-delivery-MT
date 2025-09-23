import React from 'react';

const VerifyHero = () => {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/b39dk663_expires_30_days.png" 
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-2xl mx-auto px-8">
          <div 
            className="w-full bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k8ek3yau_expires_30_days.png')] 
            bg-cover bg-center rounded-3xl overflow-hidden"
          >
            <div className="bg-[#FFFFFF33] backdrop-blur-sm border border-[#FFFFFF82] rounded-3xl p-8 relative">
              <h2 className="text-white text-3xl lg:text-4xl font-bold max-w-xs">
                Verify Your Email to Get Started
              </h2>
              
              {/* Decorative Package Icon */}
              <div className="absolute -left-4 bottom-12">
                <img
                  src="/delivery-package.png"
                  className="w-20 h-20 rounded-2xl object-contain"
                  alt="Delivery icon"
                />
              </div>
              
              {/* Spacer to maintain height */}
              <div className="h-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyHero;