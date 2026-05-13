export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white mt-0"
      style={{ background: 'linear-gradient(160deg, #0a2a1e 0%, #0F3D2E 60%, #1a5c40 100%)' }}
    >
      {/* Top accent line */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #FBBF24, #22734f, #FBBF24)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand Section */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl float">🚜</span>
                <h3 className="font-display text-2xl font-extrabold tracking-tight">
                  Namaste<span style={{ color: '#FBBF24' }}>Tractors</span>
                </h3>
              </div>
              <p className="text-green-300 text-sm leading-relaxed max-w-xs">
                Empowering India's farmers with modern technology, expert guidance, and the best tractor deals.
              </p>
            </div>
            
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="font-black text-white text-sm uppercase tracking-widest pb-2 border-b border-white/10">Get in Touch</h4>
            <div className="space-y-3">
              <a href="mailto:rahangdalesachin02@gmail.com" className="flex items-center gap-3 text-green-300 hover:text-white transition-colors text-sm group">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 8l9 6 9-6M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"/>
                  </svg>
                </span>
                rahangdalesachin02@gmail.com
              </a>
              <a href="tel:+917558448762" className="flex items-center gap-3 text-green-300 hover:text-white transition-colors text-sm group">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 013 4.18 2 2 0 015 2h4.09a2 2 0 012 1.72c.12.9.37 1.78.73 2.61a2 2 0 01-.45 2.11L10 9a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.83.36 1.71.61 2.61.73A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                +91 7558448762
              </a>
              <a href="https://wa.me/917558448762" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-300 hover:text-white transition-colors text-sm group">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 00-8.94 14.32L2 22l5.84-1.53A10 10 0 1012 2zm5.26 14.74c-.23.64-1.36 1.18-1.88 1.23-.48.05-1.08.07-1.75-.14-.41-.13-.94-.3-1.62-.59-2.85-1.23-4.71-4.1-4.85-4.3-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.18.01.42-.07.66.5.23.55.78 1.9.85 2.04.07.14.12.3.02.49-.1.19-.15.3-.29.46-.14.16-.3.36-.43.48-.14.12-.28.25-.12.49.16.25.72 1.18 1.55 1.91 1.07.95 1.97 1.25 2.22 1.39.25.14.39.12.54-.07.14-.19.6-.7.76-.94.16-.25.33-.21.56-.13.23.07 1.44.68 1.69.8.25.12.42.19.48.3.06.12.06.68-.17 1.32z"/>
                  </svg>
                </span>
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Social + Quick links */}
          <div className="flex flex-col gap-5">
            <h4 className="font-black text-white text-sm uppercase tracking-widest pb-2 border-b border-white/10">Follow Us</h4>
            <div className="flex gap-3">
              <a href="https://youtube.com/@namastetractors" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#EF4444'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.6 3.2H4.4A2.4 2.4 0 002 5.6v12.8a2.4 2.4 0 002.4 2.4h15.2a2.4 2.4 0 002.4-2.4V5.6a2.4 2.4 0 00-2.4-2.4zM10 15.5V8.5l6 3.5-6 3.5z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/torque_only" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#EC4899'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>
            </div>
            <div className="mt-2 space-y-2 text-sm text-green-300">
              <a href="/tractors" className="block hover:text-white transition-colors">🚜 Browse Tractors</a>
              <a href="/articles" className="block hover:text-white transition-colors">📰 Expert Articles</a>
              <a href="/products" className="block hover:text-white transition-colors">⚙️ Marketplace</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-400">
            <p>© {new Date().getFullYear()} NamasteTractors. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}