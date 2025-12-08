"use client";

export default function MTTransFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="mb-6 sm:mb-0 col-span-1 sm:col-span-2 lg:col-span-1">
            <a className="flex items-center gap-3" href="/">
              <img 
                src="/logo.png" 
                alt="MT Trans Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-black">MT TRANS</span>
                <span className="text-xs sm:text-sm text-black font-medium">YOUR BEST DELIVERY</span>
              </div>
            </a>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 break-words">Pengiriman cepat, aman, dan terpercaya untuk semua kebutuhan Anda.</p>
          </div>
          
          <div>
            <h2 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-gray-900 uppercase">Quick Links</h2>
            <ul className="text-sm sm:text-base text-gray-600 font-medium space-y-2 sm:space-y-3">
              <li><a className="hover:text-[#E00000] transition-colors break-words" href="/">Home</a></li>
              <li><a className="hover:text-[#E00000] transition-colors break-words" href="/cek-ongkir">Services</a></li>
              <li><a className="hover:text-[#E00000] transition-colors break-words" href="/pricing">Pricing</a></li>
              <li><a className="hover:text-[#E00000] transition-colors break-words" href="#">About</a></li>
            </ul>
          </div>
          
          <div>
            <h2 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-gray-900 uppercase">Contact Info</h2>
            <ul className="text-sm sm:text-base text-gray-600 font-medium space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <a href="mailto:info@mttrans.com" className="hover:text-[#E00000] transition-colors break-all">info@mttrans.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <a href="tel:+621234567890" className="hover:text-[#E00000] transition-colors break-words">+62 123 4567 890</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd"></path>
                </svg>
                <span className="break-words">Jl. Pengiriman No. 123, Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-gray-900 uppercase">Social Media</h2>
            <div className="flex space-x-4 sm:space-x-5">
              <a className="text-gray-500 hover:text-[#E00000] transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center" href="#" aria-label="Facebook">
                <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                </svg>
              </a>
              <a className="text-gray-500 hover:text-[#E00000]" href="#">
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path>
                </svg>
              </a>
              <a className="text-gray-500 hover:text-[#E00000] transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center" href="#" aria-label="Instagram">
                <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path>
                </svg>
              </a>
              <a className="text-gray-500 hover:text-[#E00000] transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center" href="#" aria-label="Twitter">
                <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-6 sm:my-8 border-gray-200"/>
        <div className="flex items-center justify-center">
          <span className="text-xs sm:text-sm text-gray-500 text-center break-words">© 2025 MT Trans. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
