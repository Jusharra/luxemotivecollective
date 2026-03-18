import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { BUSINESS } from '../config'

export default function Footer() {
  return (
    <footer className="bg-cv-card border-t border-cv-border pt-16 pb-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Settings className="w-5 h-5 text-red-500" />
              <div className="leading-tight">
                <div className="text-white font-extrabold text-sm">Central Valley Auto Care</div>
                <div className="text-red-500 text-[0.6rem] font-bold uppercase tracking-widest">VIP Club</div>
              </div>
            </Link>
            <p className="text-cv-dim text-sm leading-relaxed">
              Keeping Central Valley moving — one vehicle at a time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/',          label: 'Home' },
                { to: '/services',  label: 'Services' },
                { to: '/about',     label: 'About Us' },
                { to: '/contact',   label: 'Contact' },
                { to: '/services#booking', label: 'Book Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-cv-dim text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm text-cv-dim">
              <p>📍 {BUSINESS.address}</p>
              <p>
                📞{' '}
                <a href={BUSINESS.phoneHref} className="hover:text-white transition-colors">
                  {BUSINESS.phone}
                </a>
              </p>
              <p>
                ✉{' '}
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
                  {BUSINESS.email}
                </a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Shop Hours</h4>
            <div className="space-y-1.5 text-sm text-cv-dim">
              <p>Mon – Fri: {BUSINESS.hoursWeekday}</p>
              <p>Saturday: {BUSINESS.hoursSaturday}</p>
              <p className="text-cv-dim/60">Sunday: {BUSINESS.hoursSunday}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cv-border py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-cv-dim text-xs">© 2025 Central Valley Auto Care. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/contact#privacy" className="text-cv-dim hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/#sms-policy" className="text-cv-dim hover:text-white transition-colors">
              SMS Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
