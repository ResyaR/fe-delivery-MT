import React from 'react';

const SignupHeader = () => {
  return (
    <div className="flex flex-col items-center self-stretch mb-2.5">
      <span className="text-black text-2xl sm:text-3xl font-bold">
        sign up
      </span>
      <span className="text-neutral-600 text-sm sm:text-base mt-2">
        How do I get started with this service?
      </span>
    </div>
  );
};

export default SignupHeader;
