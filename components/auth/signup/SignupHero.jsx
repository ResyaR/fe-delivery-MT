import React from 'react';

const SignupHero = () => {
  return (
    <div className="h-screen w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/b39dk663_expires_30_days.png" 
          className="h-full w-full object-cover"
          alt="Background"
        />
      </div>

      {/* Purple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-purple-900/30 mix-blend-multiply" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-8">
          <div className="bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k8ek3yau_expires_30_days.png')] bg-cover bg-center rounded-3xl overflow-hidden">
            <div className="bg-[#FFFFFF33] backdrop-blur-sm border border-[#FFFFFF82] rounded-3xl p-8 relative">
              <h2 className="text-white text-3xl lg:text-4xl font-bold max-w-sm">
                Your Logistics Partner for Seamless Delivery
              </h2>

              {/* Decorative Icon */}
              <div className="absolute -left-4 bottom-12">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/qshhccgx_expires_30_days.png"
                  className="w-20 h-20 rounded-2xl object-contain"
                  alt="Delivery icon"
                />
              </div>

              {/* Spacer untuk maintain height */}
              <div className="h-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupHero;