"use client";

export default function CheckoutSteps({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Cart', icon: 'shopping_cart' },
    { number: 2, label: 'Alamat', icon: 'location_on' },
    { number: 3, label: 'Pembayaran', icon: 'payments' },
    { number: 4, label: 'Konfirmasi', icon: 'check_circle' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step.number === currentStep
                    ? 'bg-[#E00000] text-white'
                    : step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number < currentStep ? (
                  <span className="material-symbols-outlined">check</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">{step.icon}</span>
                )}
              </div>
              
              {/* Step Label */}
              <p 
                className={`mt-2 text-xs md:text-sm font-semibold ${
                  step.number === currentStep
                    ? 'text-[#E00000]'
                    : step.number < currentStep
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 md:mx-4">
                <div 
                  className={`h-full ${
                    step.number < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

