import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Settings } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] bg-cv-dark/95 backdrop-blur-md border-b border-cv-border transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.5)]' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Settings className="w-6 h-6 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
          <div className="leading-tight">
            <div className="text-white font-extrabold text-sm sm:text-[0.95rem]">
              Central Valley Auto Care
            </div>
            <div className="text-red-500 text-[0.6rem] font-bold uppercase tracking-[0.15em]">
              VIP Club
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-white bg-white/8'
                    : 'text-cv-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/services#booking"
              className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-1.5 text-cv-muted hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-cv-card border-b border-cv-border px-4 py-3">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
                location.pathname === to
                  ? 'text-white bg-white/10'
                  : 'text-cv-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/services#booking"
            className="block px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg text-center mt-2"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  )
}
