"use client";

import Link from "next/link";

export default function MTTransCekOngkirFooter() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MT Trans Logo" className="h-10 w-10 object-contain" />
              <div className="leading-tight">
                <h3 className="text-base font-bold text-black">MT TRANS</h3>
                <span className="text-[10px] text-black font-medium">YOUR BEST DELIVERY</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Pengiriman cepat, aman, dan terpercaya untuk semua kebutuhan Anda.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800">Useful Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Blogs</a></li>
              <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800">Main Menu</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Offers</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Menus</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Reservation</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a className="hover:text-black transition-colors" href="mailto:contact@mttrans.com">contact@mttrans.com</a></li>
              <li><a className="hover:text-black transition-colors" href="tel:+1234567890">(123) 456-7890</a></li>
            </ul>
            <div className="flex space-x-4 pt-2">
              <a className="text-[#E00000] hover:text-red-700 transition-colors" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                </svg>
              </a>
              <a className="text-[#E00000] hover:text-red-700 transition-colors" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.752 2.752c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.752 2.752c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.752-2.752c-.247-.636-.416-1.363-.465-2.427C2.013 14.784 2 14.43 2 12s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.752-2.752C5.872 2.482 6.6 2.313 7.664 2.264 8.688 2.013 9.042 2 11.47 2h.845zM12 6.848a5.152 5.152 0 100 10.304 5.152 5.152 0 000-10.304zM12 15a3 3 0 110-6 3 3 0 010 6zm4.885-9.352a1.182 1.182 0 100 2.364 1.182 1.182 0 000-2.364z" fillRule="evenodd"></path>
                </svg>
              </a>
              <a className="text-[#E00000] hover:text-red-700 transition-colors" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
          <p>© 2024 MT Trans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
