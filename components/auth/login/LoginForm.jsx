"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginUser } from "@/lib/auth"; 
import { setToken } from "@/lib/auth";          

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 🔑 panggil API login
      const res = await loginUser(email, password);

      if (res.access_token) {
        setToken(res.access_token); // simpan token
      }

      const returnUrl = sessionStorage.getItem("returnUrl");
      if (returnUrl) {
        sessionStorage.removeItem("returnUrl");
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[300px]">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-[18px] gap-1.5 rounded-2xl">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/a2vl56z8_expires_30_days.png"
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

      {/* Password Input */}
      <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-6 gap-1.5 rounded-2xl">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/s3s03r4u_expires_30_days.png"
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
            // 👁 open
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="#666"
              className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639
                   C3.423 7.51 7.36 4.5 12 4.5
                   c4.638 0 8.573 3.007 9.963 7.178
                   .07.207.07.431 0 .639
                   C20.577 16.49 16.64 19.5 12 19.5
                   c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            // 👁 hidden
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="#666" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12
                   C3.226 16.338 7.244 19.5 12 19.5
                   c.993 0 1.953-.138 2.863-.395M6.228 6.228
                   A10.45 10.45 0 0112 4.5c4.756 0
                   8.773 3.162 10.065 7.498a10.523 10.523
                   0 01-4.293 5.774M6.228 6.228L3 3
                   m3.228 3.228l3.65 3.65m7.894 7.894L21 21
                   m-3.228-3.228l-3.65-3.65m0 0
                   a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex flex-col items-start text-left py-[17px] px-[30px] rounded-2xl border-0 cursor-pointer hover:opacity-90 transition-opacity ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ background: "linear-gradient(180deg, #9181F4, #5038ED)" }}
        >
          <span className="text-white text-xs font-bold">
            {isLoading ? "Signing in..." : "Login Now"}
          </span>
        </button>
      </div>
    </form>
  );
}
