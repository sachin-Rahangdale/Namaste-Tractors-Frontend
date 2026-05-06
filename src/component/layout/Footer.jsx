export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12 border-t-4 border-green-600">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Namaste<span className="text-green-500">Tractors</span>
              </h3>
              <p className="text-slate-400 mt-2 max-w-xs">
                Empowering farmers with modern technology and expert machinery insights.
              </p>
            </div>

            <a 
              href="/enquiry/new" 
              className="inline-flex items-center w-fit bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {/* Help Icon */}
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10a4 4 0 118 0c0 2-2 3-2 3m-2 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
              </svg>
              Need Help?
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold border-b border-slate-700 pb-2">Get in Touch</h4>

            <div className="space-y-3">
              <a href="mailto:rahangdalesachin02@gmail.com" className="flex items-center text-slate-300 hover:text-green-400">
                {/* Mail Icon */}
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 8l9 6 9-6M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"/>
                </svg>
                rahangdalesachin02@gmail.com
              </a>

              <a href="tel:+917558448762" className="flex items-center text-slate-300 hover:text-green-400">
                {/* Phone Icon */}
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 013 4.18 2 2 0 015 2h4.09a2 2 0 012 1.72c.12.9.37 1.78.73 2.61a2 2 0 01-.45 2.11L10 9a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.83.36 1.71.61 2.61.73A2 2 0 0122 16.92z"/>
                </svg>
                +91 7558448762
              </a>

              <a href="https://wa.me/917558448762" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-300 hover:text-green-400">
                {/* WhatsApp Icon */}
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-8.94 14.32L2 22l5.84-1.53A10 10 0 1012 2zm5.26 14.74c-.23.64-1.36 1.18-1.88 1.23-.48.05-1.08.07-1.75-.14-.41-.13-.94-.3-1.62-.59-2.85-1.23-4.71-4.1-4.85-4.3-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.18.01.42-.07.66.5.23.55.78 1.9.85 2.04.07.14.12.3.02.49-.1.19-.15.3-.29.46-.14.16-.3.36-.43.48-.14.12-.28.25-.12.49.16.25.72 1.18 1.55 1.91 1.07.95 1.97 1.25 2.22 1.39.25.14.39.12.54-.07.14-.19.6-.7.76-.94.16-.25.33-.21.56-.13.23.07 1.44.68 1.69.8.25.12.42.19.48.3.06.12.06.68-.17 1.32z"/>
                </svg>
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold border-b border-slate-700 pb-2">Follow Us</h4>

            <div className="flex space-x-5">
              {/* YouTube */}
              <a href="https://youtube.com/@namastetractors" target="_blank" rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-red-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.6 3.2H4.4A2.4 2.4 0 002 5.6v12.8a2.4 2.4 0 002.4 2.4h15.2a2.4 2.4 0 002.4-2.4V5.6a2.4 2.4 0 00-2.4-2.4zM10 15.5V8.5l6 3.5-6 3.5z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/torque_only" target="_blank" rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-pink-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-slate-500 text-sm mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} NamasteTractors. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}