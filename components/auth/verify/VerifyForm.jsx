import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/signup');
    }
  }, [searchParams, router]);

  const handleVerify = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate OTP format
      const otpValue = otp.join('');
      if (otpValue.length !== 4) {
        setError('Please enter the complete 4-digit OTP code');
        return;
      }

      console.log('Submitting OTP:', { email, otp: otpValue });

      const response = await api.post('/auth/verify-otp', {
        email,
        otp: otpValue
      });

      console.log('Verification response:', response.data);

      if (response.data?.message?.includes('verified')) {
        setError('Email verified successfully! Redirecting to login...');
        // Delay redirect to show success message
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1500);
        return;
      }

      // If we got here without a verified message, something went wrong
      setError('Verification failed. Please check your OTP and try again.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      setLoading(true);
      
      const response = await api.post('/auth/verify-otp', { 
        email,
        resend: true 
      });
      
      console.log('Resend response:', response.data);
      
      // Reset OTP inputs
      setOtp(['', '', '', '']);
      
      // Show success message in green
      setError('New OTP code has been sent to your email');
    } catch (err) {
      console.error('Resend error:', err.response?.data || err);
      if (err.response?.data?.message) {
        // Show the exact error message from the server
        setError(err.response.data.message);
      } else {
        setError('Failed to resend OTP. Please try again in a few minutes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[300px] mx-auto">
      {error && (
        <div className={`w-full mb-4 p-3 rounded-lg text-sm ${error.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      {/* OTP Input Fields */}
      <div className="grid grid-cols-4 gap-3 mb-6 w-full">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            name={`otp-${index}`}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full h-[60px] bg-[#EFEDFFCC] rounded-2xl text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-[#5038ED] transition-all"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button 
        onClick={handleVerify}
        disabled={loading || otp.join('').length !== 4}
        className="w-full py-4 px-6 mb-6 rounded-2xl border-0 cursor-pointer bg-gradient-to-b from-[#9181F4] to-[#5038ED] hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-white font-bold">
          {loading ? 'Verifying...' : 'Verify Email'}
        </span>
      </button>

      {/* Resend Code */}
      <div className="flex items-center gap-2">
        <span className="text-neutral-600 text-sm">
          Didn't receive the code?
        </span>
        <button 
          onClick={handleResend}
          disabled={loading}
          className="text-[#5038ED] text-sm font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resend
        </button>
      </div>
    </div>
  );
};

export default VerifyForm;