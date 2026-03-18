import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import SmsOptIn from '../components/SmsOptIn'
import { postToWebhook } from '../lib/webhooks'
import { formatPhone, normalizePhone, isValidPhone } from '../utils/format'
import { BUSINESS } from '../config'

// ─── Service Catalog Data ─────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'oil-change', icon: '🛢', img: '/images/oil-change.jpg', title: 'Oil Change Service',
    desc: 'Every oil change includes a multi-point inspection, fluid top-off, and tire pressure check.',
    features: ['Conventional (up to 5 qts)', 'Synthetic Blend', 'Full Synthetic', 'High-Mileage Formula', 'Filter replacement included'],
    bookValue: 'Oil Change – Full Synthetic',
  },
  {
    id: 'tires', icon: '🔄', img: '/images/tires.jpg', title: 'Tire Services',
    desc: 'Extend the life of your tires and improve safety. VIP members receive one free rotation per visit.',
    features: ['Tire Rotation ✦ FREE for VIP Members', 'Tire Balancing', 'Flat Repair / Plug & Patch', 'TPMS Reset', 'New Tire Installation'],
    bookValue: 'Tire Rotation',
  },
  {
    id: 'brakes', icon: '🛑', img: '/images/brakes.jpg', title: 'Brake Service',
    desc: 'Our ASE-certified techs inspect and repair your braking system to keep you and your family safe.',
    features: ['Brake Inspection (FREE)', 'Brake Pad Replacement', 'Rotor Resurfacing or Replacement', 'Brake Fluid Flush', 'Caliper Service'],
    bookValue: 'Brake Service',
  },
  {
    id: 'battery', icon: '🔋', img: '/images/battery.jpg', title: 'Battery Service',
    desc: "Don't get stranded. We test your battery's health and replace it with a warranty-backed battery.",
    features: ['FREE Battery Test', 'Battery Replacement', 'Charging System Test', 'Terminal Cleaning', 'All major brands available'],
    bookValue: 'Battery Test & Replacement',
  },
  {
    id: 'ac', icon: '❄', img: '/images/ac.jpg', title: 'A/C & Heating',
    desc: 'Stay comfortable year-round. We diagnose and repair your climate control system quickly.',
    features: ['A/C Performance Check', 'Refrigerant Recharge (R-134a / R-1234yf)', 'Leak Detection & Repair', 'Compressor Service', 'Heater Core Diagnosis'],
    bookValue: 'A/C Service',
  },
  {
    id: 'engine', icon: '🔧', img: '/images/engine.jpg', title: 'Engine & Transmission',
    desc: 'From check engine lights to full transmission service, we handle the complex stuff.',
    features: ['Check Engine Light Diagnosis', 'Transmission Fluid Service', 'Coolant Flush', 'Spark Plug Replacement', 'Timing Belt / Chain Service'],
    bookValue: 'Engine Diagnostics / Check Engine Light',
  },
  {
    id: 'fluids', icon: '💧', img: '/images/fluids.jpg', title: 'Filters & Fluids',
    desc: 'Preventive maintenance keeps costly repairs away. We handle all your filter and fluid service needs.',
    features: ['Engine Air Filter', 'Cabin Air Filter', 'Fuel Filter', 'Power Steering Fluid Flush', 'Differential / Transfer Case'],
    bookValue: 'Filters & Fluids',
  },
  {
    id: 'diagnostics', icon: '🔍', img: '/images/diagnostics.jpg', title: 'Inspection & Diagnostics',
    desc: "Not sure what's wrong? We run a full diagnostic and give you a clear, honest report.",
    features: ['30-Point Vehicle Inspection', 'OBD-II Scan & Report', 'Pre-Purchase Inspection', 'Smog Check (where applicable)', 'Written estimate included'],
    bookValue: '30-Point Inspection',
  },
]

const SERVICE_OPTIONS = [
  'Oil Change – Conventional',
  'Oil Change – Synthetic Blend',
  'Oil Change – Full Synthetic',
  'Tire Rotation',
  'Tire Balancing',
  'Flat Repair',
  'New Tire Installation',
  'Brake Inspection (FREE)',
  'Brake Pad Replacement',
  'Battery Test & Replacement',
  'A/C Service',
  'Engine Diagnostics / Check Engine Light',
  'Transmission Service',
  'Coolant Flush',
  'Filters & Fluids',
  '30-Point Inspection',
  'Other / Not Sure',
]

// ─── Booking form types ───────────────────────────────────────────────────────
interface BookingForm {
  first_name:     string
  last_name:      string
  phone:          string
  email:          string
  vehicle_year:   string
  vehicle_make:   string
  vehicle_model:  string
  mileage:        string
  service:        string
  preferred_date: string
  preferred_time: string
  notes:          string
  sms_optin:      boolean
}
interface BookingErrors {
  first_name?:    string
  last_name?:     string
  phone?:         string
  vehicle_year?:  string
  vehicle_make?:  string
  vehicle_model?: string
  service?:       string
  preferred_date?: string
}

const INITIAL: BookingForm = {
  first_name: '', last_name: '', phone: '', email: '',
  vehicle_year: '', vehicle_make: '', vehicle_model: '', mileage: '',
  service: '', preferred_date: '', preferred_time: '', notes: '',
  sms_optin: true,
}

function validateBooking(f: BookingForm): BookingErrors {
  const e: BookingErrors = {}
  if (!f.first_name)    e.first_name    = 'Required.'
  if (!f.last_name)     e.last_name     = 'Required.'
  if (!f.phone)         e.phone         = 'Required.'
  else if (!isValidPhone(f.phone)) e.phone = 'Enter a valid 10-digit number.'
  if (!f.vehicle_year)  e.vehicle_year  = 'Required.'
  else {
    const yr = parseInt(f.vehicle_year, 10)
    if (isNaN(yr) || yr < 1980 || yr > new Date().getFullYear() + 2)
      e.vehicle_year = 'Enter a valid year.'
  }
  if (!f.vehicle_make)  e.vehicle_make  = 'Required.'
  if (!f.vehicle_model) e.vehicle_model = 'Required.'
  if (!f.service)       e.service       = 'Please select a service.'
  if (!f.preferred_date) e.preferred_date = 'Please select a date.'
  return e
}

// Get tomorrow's date string for min date
function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ─── Field component ─────────────────────────────────────────────────────────
function Field({ label, required = false, error, children }: {
  label: string; required?: boolean; error?: string; children: ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-cv-muted mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Services() {
  const location = useLocation()
  const bookingRef = useRef<HTMLElement>(null)
  const [form, setForm]       = useState<BookingForm>(INITIAL)
  const [errors, setErrors]   = useState<BookingErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Scroll to booking section when #booking hash is present
  useEffect(() => {
    if (location.hash === '#booking') {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [location.hash])

  function update(field: keyof BookingForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof BookingErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function prefillService(value: string) {
    setForm(prev => ({ ...prev, service: value }))
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validateBooking(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    const ok = await postToWebhook('booking', {
      source:         'booking_request',
      first_name:     form.first_name,
      last_name:      form.last_name,
      phone:          normalizePhone(form.phone),
      email:          form.email,
      vehicle_year:   form.vehicle_year,
      vehicle_make:   form.vehicle_make,
      vehicle_model:  form.vehicle_model,
      mileage:        form.mileage,
      service:        form.service,
      preferred_date: form.preferred_date,
      preferred_time: form.preferred_time,
      notes:          form.notes,
      sms_optin:      form.sms_optin ? 'yes' : 'no',
      submitted_at:   new Date().toISOString(),
    })
    setLoading(false)

    if (ok) {
      setSuccess(true)
      toast.success('Appointment request received!')
    } else {
      toast.error('Request failed. Please call us to book.')
    }
  }

  return (
    <>
      {/* Page Hero */}
      <section className="py-20 text-center bg-gradient-to-b from-[#130505] to-cv-dark border-b border-cv-border">
        <div className="container">
          <h1 className="text-5xl font-black text-white mb-3">Our Services</h1>
          <p className="text-cv-muted text-lg">Professional auto repair and maintenance — done right the first time.</p>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="page-section bg-cv-dark">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Full Service Menu</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-3">What We Do Best</h2>
            <p className="text-cv-muted">Click "Book" on any service to jump to the scheduling form below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SERVICES.map(({ id, icon, img, title, desc, features, bookValue }) => (
              <div
                key={id}
                id={id}
                className="card overflow-hidden hover:border-red-600/40 transition-colors"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cv-card via-cv-card/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-extrabold text-base mb-2">{title}</h3>
                  <p className="text-cv-muted text-sm leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1 mb-5">
                    {features.map(f => (
                      <li key={f} className="text-cv-muted text-xs flex items-center gap-2">
                        <span className="text-red-500 font-bold">–</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => prefillService(bookValue)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Book {title.split(' ')[0]} Service →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section
        id="booking"
        ref={bookingRef}
        className="page-section bg-cv-card scroll-mt-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-14 items-start">
            {/* Left info */}
            <div>
              <span className="section-label">Schedule Service</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-4 leading-tight">
                Book Your Appointment
              </h2>
              <p className="text-cv-muted mb-6">
                We'll confirm your appointment by phone or text within 1 business hour.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { icon: '📍', text: BUSINESS.address },
                  { icon: '📞', text: BUSINESS.phone },
                  { icon: '⏰', text: `Mon–Fri ${BUSINESS.hoursWeekday} / Sat ${BUSINESS.hoursSaturday}` },
                ].map(({ icon, text }) => (
                  <div key={icon} className="flex items-center gap-3 text-cv-muted text-sm">
                    <span className="text-base">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-1">
                  🏆 VIP Members get priority scheduling!
                </p>
                <Link to="/#vip-form" className="text-red-400 text-xs hover:text-red-300">
                  Not a member? Join free →
                </Link>
              </div>
            </div>

            {/* Booking form */}
            <div className="bg-cv-input border border-cv-border rounded-xl p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-white text-xl font-extrabold mb-3">Appointment Request Received!</h3>
                  <p className="text-cv-muted text-sm mb-2">
                    We'll call or text you within 1 business hour to confirm.
                  </p>
                  <p className="text-cv-muted text-sm">
                    Need immediate help? Call{' '}
                    <a href={BUSINESS.phoneHref} className="text-red-400 hover:text-red-300">
                      {BUSINESS.phone}
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" required error={errors.first_name}>
                      <input type="text" placeholder="First" value={form.first_name}
                        onChange={e => update('first_name', e.target.value)}
                        className={`input-base ${errors.first_name ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Last Name" required error={errors.last_name}>
                      <input type="text" placeholder="Last" value={form.last_name}
                        onChange={e => update('last_name', e.target.value)}
                        className={`input-base ${errors.last_name ? 'input-error-state' : ''}`} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone" required error={errors.phone}>
                      <input type="tel" placeholder="(559) 555-0100" value={form.phone}
                        onChange={e => update('phone', formatPhone(e.target.value))}
                        className={`input-base ${errors.phone ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Email">
                      <input type="email" placeholder="john@email.com" value={form.email}
                        onChange={e => update('email', e.target.value)}
                        className="input-base" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Year" required error={errors.vehicle_year}>
                      <input type="text" placeholder="2019" maxLength={4} value={form.vehicle_year}
                        onChange={e => update('vehicle_year', e.target.value)}
                        className={`input-base ${errors.vehicle_year ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Make" required error={errors.vehicle_make}>
                      <input type="text" placeholder="Toyota" value={form.vehicle_make}
                        onChange={e => update('vehicle_make', e.target.value)}
                        className={`input-base ${errors.vehicle_make ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Model" required error={errors.vehicle_model}>
                      <input type="text" placeholder="Camry" value={form.vehicle_model}
                        onChange={e => update('vehicle_model', e.target.value)}
                        className={`input-base ${errors.vehicle_model ? 'input-error-state' : ''}`} />
                    </Field>
                  </div>

                  <Field label="Approx. Mileage">
                    <input type="text" placeholder="85,000" value={form.mileage}
                      onChange={e => update('mileage', e.target.value)}
                      className="input-base" />
                  </Field>

                  <Field label="Service Needed" required error={errors.service}>
                    <div className="relative">
                      <select
                        value={form.service}
                        onChange={e => update('service', e.target.value)}
                        className={`input-base appearance-none pr-10 ${errors.service ? 'input-error-state' : ''}`}
                      >
                        <option value="">— Select a service —</option>
                        {SERVICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cv-dim pointer-events-none">▾</span>
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Preferred Date" required error={errors.preferred_date}>
                      <input type="date" min={getTomorrow()} value={form.preferred_date}
                        onChange={e => update('preferred_date', e.target.value)}
                        className={`input-base ${errors.preferred_date ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Preferred Time">
                      <div className="relative">
                        <select value={form.preferred_time}
                          onChange={e => update('preferred_time', e.target.value)}
                          className="input-base appearance-none pr-10">
                          <option value="">Any time</option>
                          {['7:30 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM']
                            .map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cv-dim pointer-events-none">▾</span>
                      </div>
                    </Field>
                  </div>

                  <Field label="Additional Notes">
                    <textarea
                      rows={3}
                      placeholder="Describe any symptoms, warning lights, or special requests…"
                      value={form.notes}
                      onChange={e => update('notes', e.target.value)}
                      className="input-base resize-none"
                    />
                  </Field>

                  <SmsOptIn
                    checked={form.sms_optin}
                    onChange={v => update('sms_optin', v)}
                    compact
                  />

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                    {loading ? 'Sending…' : 'Request Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
