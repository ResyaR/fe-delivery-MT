"use client";

export default function MTTransFoodFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-card-dark py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center text-subtle-light dark:text-subtle-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="text-left sm:text-center md:text-left">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-foreground-light dark:text-foreground-dark">Quick Links</h4>
            <ul className="space-y-2">
              <li><a className="hover:text-primary transition-colors break-words" href="/">Home</a></li>
              <li><a className="hover:text-primary transition-colors break-words" href="#">Offers</a></li>
              <li><a className="hover:text-primary transition-colors break-words" href="#">Menu</a></li>
              <li><a className="hover:text-primary transition-colors break-words" href="#">Reservation</a></li>
            </ul>
          </div>
          <div className="text-left sm:text-center md:text-left">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-foreground-light dark:text-foreground-dark">Contact Info</h4>
            <ul className="space-y-2">
              <li><a className="hover:text-primary transition-colors break-all" href="mailto:info@mttrans.com">info@mttrans.com</a></li>
              <li><a className="hover:text-primary transition-colors break-words" href="tel:+62123456789">+62 123 456 789</a></li>
            </ul>
          </div>
          <div className="text-left sm:text-center md:text-left sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-foreground-light dark:text-foreground-dark">Social Media</h4>
            <div className="flex justify-start sm:justify-center md:justify-start gap-4 sm:gap-6">
              <a className="hover:text-primary transition-colors" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                </svg>
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-subtle-light/20 dark:border-subtle-dark/20 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <p className="text-sm sm:text-base break-words">© 2025 MT Trans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
