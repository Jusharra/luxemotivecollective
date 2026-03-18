import { Link } from 'react-router-dom'
import { BUSINESS } from '../config'

const HOURS = [
  { day: 'Monday',    hours: BUSINESS.hoursWeekday },
  { day: 'Tuesday',   hours: BUSINESS.hoursWeekday },
  { day: 'Wednesday', hours: BUSINESS.hoursWeekday },
  { day: 'Thursday',  hours: BUSINESS.hoursWeekday },
  { day: 'Friday',    hours: BUSINESS.hoursWeekday },
  { day: 'Saturday',  hours: BUSINESS.hoursSaturday },
  { day: 'Sunday',    hours: BUSINESS.hoursSunday, closed: true },
]

const VALUES = [
  { icon: '🤝', title: 'Honesty First',       desc: "We show you what's needed and what can wait. We'll never recommend a service your car doesn't require." },
  { icon: '🔬', title: 'Precision Work',      desc: 'Our ASE-certified technicians use professional-grade equipment and OEM-quality parts.' },
  { icon: '💬', title: 'Clear Communication', desc: 'We explain everything in plain English before we start. No surprise bills.' },
  { icon: '🏘', title: 'Community Roots',     desc: 'We live and work in the Central Valley. Taking care of our neighbors is what drives us.' },
]

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <section className="py-20 text-center bg-gradient-to-b from-[#130505] to-cv-dark border-b border-cv-border">
        <div className="container">
          <h1 className="text-5xl font-black text-white mb-3">About Us</h1>
          <p className="text-cv-muted text-lg">A family-owned shop built on trust, skill, and honest service.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="page-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-6 leading-tight">
                Central Valley's Trusted Auto Shop
              </h2>
              <div className="space-y-4 text-cv-muted text-sm leading-relaxed">
                <p>
                  Central Valley Auto Care has served drivers throughout the Central Valley for over
                  [X] years. What started as a small neighborhood oil change shop has grown into a
                  full-service auto repair center — but our core values haven't changed a bit.
                </p>
                <p>
                  We're a <strong className="text-white">family-owned business</strong> and we treat
                  every customer like a neighbor, not a ticket number. No pressure upsells, no
                  confusing jargon — just straight talk about what your vehicle needs and a fair
                  price to fix it.
                </p>
                <p>
                  Our team of{' '}
                  <strong className="text-white">ASE-certified mechanics</strong> handles everything
                  from routine oil changes to complex engine diagnostics. We invest in the latest
                  diagnostic tools so we can identify issues fast and get you back on the road safely.
                </p>
              </div>
              <Link to="/services#booking" className="btn-primary mt-8 inline-flex">
                Book a Service
              </Link>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '10+',  label: 'Years in Business' },
                { value: 'ASE',  label: 'Certified Technicians' },
                { value: '⭐⭐⭐⭐⭐', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="card p-7 text-center hover:border-red-600/40 hover:-translate-y-1 transition-all"
                >
                  <div className="text-3xl font-black text-red-500 mb-2 leading-none">{value}</div>
                  <div className="text-cv-muted text-xs font-semibold uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-section bg-cv-card">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Our Promise</span>
            <h2 className="text-4xl font-black text-white mt-2">What Sets Us Apart</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-cv-input border border-cv-border rounded-xl p-7 text-center hover:border-red-600/40 hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-cv-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section id="hours-location" className="page-section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Visit Us</span>
            <h2 className="text-4xl font-black text-white mt-2">Hours &amp; Location</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hours */}
            <div className="card p-7">
              <h3 className="text-white font-bold text-base mb-5">🕐 Shop Hours</h3>
              <table className="w-full text-sm">
                <tbody>
                  {HOURS.map(({ day, hours, closed }) => (
                    <tr key={day} className="border-b border-cv-border/40 last:border-0">
                      <td className={`py-2.5 font-semibold ${closed ? 'text-cv-dim' : 'text-white'}`}>{day}</td>
                      <td className={`py-2.5 text-right ${closed ? 'text-cv-dim' : 'text-cv-muted'}`}>{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 text-[0.72rem] text-cv-dim border-t border-cv-border pt-4 leading-relaxed">
                <strong className="text-cv-muted">Holiday Hours:</strong> Hours may vary on major
                holidays. Call ahead or check our{' '}
                <Link to="/contact" className="underline hover:text-white">contact page</Link>.
              </p>
            </div>

            {/* Location */}
            <div className="card p-7">
              <h3 className="text-white font-bold text-base mb-5">📍 Find Us</h3>
              <address className="not-italic text-cv-muted text-sm leading-relaxed mb-5">
                <strong className="text-white block">Central Valley Auto Care</strong>
                {BUSINESS.address}
              </address>
              <div className="flex flex-col gap-2 mb-5">
                <a
                  href="https://maps.google.com/?q=Central+Valley+Auto+Care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-sm text-center text-sm"
                >
                  Open in Google Maps
                </a>
                <a
                  href="https://maps.apple.com/?q=Central+Valley+Auto+Care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-sm text-center text-sm"
                >
                  Open in Apple Maps
                </a>
              </div>
              {/* Map embed placeholder */}
              <div className="border border-dashed border-cv-border rounded-lg p-6 text-center text-cv-dim text-xs leading-relaxed">
                <div className="text-2xl mb-2">🗺</div>
                <p>Paste your Google Maps embed iframe here.</p>
                <p className="mt-1 text-[0.65rem]">
                  maps.google.com → Search business → Share → Embed a map → Copy HTML
                </p>
              </div>
            </div>

            {/* Contact quick */}
            <div className="card p-7">
              <h3 className="text-white font-bold text-base mb-5">📞 Reach Us</h3>
              <div className="space-y-3">
                {[
                  { href: BUSINESS.phoneHref, icon: '📞', label: 'Call Us',   value: BUSINESS.phone },
                  { href: BUSINESS.smsHref,   icon: '💬', label: 'Text Us',   value: BUSINESS.phone },
                  { href: `mailto:${BUSINESS.email}`, icon: '✉', label: 'Email Us', value: BUSINESS.email },
                ].map(({ href, icon, label, value }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 bg-cv-input border border-cv-border rounded-xl p-4 hover:border-red-600/50 transition-colors group"
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-cv-dim text-[0.65rem] font-bold uppercase tracking-wide">{label}</div>
                      <div className="text-white text-sm font-semibold group-hover:text-red-400 transition-colors truncate">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <Link
                to="/services#booking"
                className="btn-primary w-full text-center mt-5"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VIP CTA */}
      <section className="page-section bg-cv-card">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#1a0505] to-cv-input border border-red-600/20 rounded-2xl p-10">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Join the VIP Club — It's Free</h2>
              <p className="text-cv-muted">
                Get maintenance reminders, a free tire rotation, birthday discounts, and SMS service alerts.
              </p>
            </div>
            <Link to="/#vip-form" className="btn-primary flex-shrink-0 px-8 py-4 text-base">
              Join VIP Club
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
