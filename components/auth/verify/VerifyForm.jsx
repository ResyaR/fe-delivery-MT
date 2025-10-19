import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useToast } from '@/components/common/ToastProvider';

const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/signup');
    }
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
        showSuccess('Email berhasil diverifikasi! Mengarahkan ke halaman login...');
        // Delay redirect to show success message
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1500);
        return;
      }

      // If we got here without a verified message, something went wrong
      showError('Verifikasi gagal. Silakan periksa kode OTP Anda.');
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal memverifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return; // Prevent resend if countdown is active
    
    try {
      setError('');
      setLoading(true);
      
      const response = await api.post('/auth/resend-otp', { 
        email
      });
      
      console.log('Resend response:', response.data);
      
      // Reset OTP inputs
      setOtp(['', '', '', '']);
      
      // Reset countdown
      setCountdown(30);
      
      // Show success message in green
      showSuccess('Kode OTP baru telah dikirim ke email Anda');
    } catch (err) {
      console.error('Resend error:', err.response?.data || err);
      if (err.response?.data?.message) {
        // Show the exact error message from the server
        showError(err.response.data.message);
      } else {
        showError('Gagal mengirim ulang OTP. Silakan coba lagi dalam beberapa menit.');
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

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4);
    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      if (i < 4 && /[0-9]/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus the last filled input
    const lastFilledIndex = newOtp.findIndex((val, i) => !val && i > 0) - 1;
    if (lastFilledIndex >= 0) {
      const targetInput = document.querySelector(`input[name=otp-${lastFilledIndex}]`);
      if (targetInput) targetInput.focus();
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 text-[#E00000] mb-4">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Verifikasi Akun Anda
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Masukkan kode 4 digit yang telah dikirim ke nomor telepon atau email Anda.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-8">
        {error && (
          <div className={`w-full mb-4 p-3 rounded-lg text-sm ${error.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 sm:gap-4" id="otp-container">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                name={`otp-${index}`}
                type="text"
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input border-gray-300 focus:border-[#E00000] text-gray-900"
                style={{
                  width: '3.5rem',
                  height: '4rem',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  backgroundColor: 'transparent',
                  caretColor: '#E00000'
                }}
              />
            ))}
          </div>

          {/* Verify Button */}
          <div>
            <button 
              type="submit"
              disabled={loading || otp.join('').length !== 4}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E00000] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00000] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verifikasi'}
            </button>
          </div>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <div className="text-sm">
            <button 
              onClick={handleResend}
              disabled={loading || countdown > 0}
              className="font-medium text-gray-600 hover:text-[#E00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim Ulang Kode
            </button>
            {countdown > 0 && (
              <span className="text-gray-600 ml-2">({countdown.toString().padStart(2, '0')}:00)</span>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Tidak menerima kode? Periksa folder spam atau coba nomor lain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;