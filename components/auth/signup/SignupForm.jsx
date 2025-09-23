import React, { useState } from 'react';
import { signup } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Basic validation
      if (!email || !password || !username) {
        setError('Please fill in all fields');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Password validation
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      try {
        // Register user and send OTP
        const response = await signup(email, password, username);
        console.log('Signup response:', response);
        
        if (response.message?.includes('OTP sent')) {
          console.log('Redirecting to verify page...');
          // Force navigation without client-side routing
          window.location.href = `/verify?email=${encodeURIComponent(email)}`;
        } else {
          console.log('Unexpected response format:', response);
          setError('Unexpected response from server');
        }
      } catch (err) {
        console.error('Error during signup:', err);
        throw err; // Re-throw to be caught by outer catch block
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="w-full max-w-[300px]">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Email Input */}
      <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-[18px] gap-1.5 rounded-2xl">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/lw8umszb_expires_30_days.png" 
          className="w-6 h-6 object-fill"
          alt="Email icon"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-[#1C1C1C] bg-transparent text-xs flex-1 py-[3px] border-0 outline-none"
        />
      </div>

      {/* Username Input */}
      <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-[18px] gap-1.5 rounded-2xl">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/lw8umszb_expires_30_days.png" 
          className="w-6 h-6 object-fill"
          alt="Username icon"
        />
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-[#1C1C1C] bg-transparent text-xs flex-1 py-[3px] border-0 outline-none"
        />
      </div>
      
      {/* Password Input */}
      <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-6 gap-1.5 rounded-2xl">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/z6zsoj8h_expires_30_days.png" 
          className="w-6 h-6 object-fill"
          alt="Password icon"
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-[#1C1C1C] bg-transparent text-xs flex-1 py-[3px] border-0 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="focus:outline-none"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#666" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#666" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* OTP verification moved to /verify page */}

      <div className="flex justify-center mb-6">
        <button
          type="submit"
          disabled={loading}
          className={`flex flex-col items-start text-left py-[17px] px-[30px] rounded-2xl border-0 cursor-pointer hover:opacity-90 transition-opacity ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ background: "linear-gradient(180deg, #9181F4, #5038ED)" }}
        >
          <span className="text-white text-xs font-bold">
            {loading ? "Processing..." : "Sign Up"}
          </span>
        </button>
      </div>

      {/* Sign Up with Others Section */}
      {/* Divider */}
      <div className="flex items-center w-full mb-6">
        <div className="flex-1 h-px bg-[#F0EDFF]"></div>
        <span className="text-neutral-600 text-xs mx-4">or</span>
        <div className="flex-1 h-px bg-[#F0EDFF]"></div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/yi5k60rh_expires_30_days.png"
            className="w-6 h-6 object-contain"
            alt="Google icon"
          />
          <span className="text-[#1C1C1C] text-xs">Sign Up with Google</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center w-full py-3 px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/n7l74m9p_expires_30_days.png"
            className="w-6 h-6 object-contain"
            alt="Facebook icon"
          />
          <span className="text-[#1C1C1C] text-xs">Sign Up with Facebook</span>
        </button>
      </div>

      {/* Link to Sign In */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-neutral-600 text-xs">Sudah Memiliki Akun?</span>
        <button 
          type="button"
          onClick={() => router.push('/signin')}
          className="text-[#39DA49] text-xs font-bold hover:underline focus:outline-none"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
