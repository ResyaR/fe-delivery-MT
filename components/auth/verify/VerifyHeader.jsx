import React from 'react';

const VerifyHeader = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto mb-4">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-3">
        Verify Your Email
      </h1>
      <p className="text-neutral-600 text-sm sm:text-base">
        We have sent a verification code to your email
      </p>
    </div>
  );
};

export default VerifyHeader;