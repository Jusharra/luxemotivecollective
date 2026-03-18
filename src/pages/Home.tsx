import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'
import SmsOptIn from '../components/SmsOptIn'
import { postToWebhook } from '../lib/webhooks'
import { formatPhone, normalizePhone, isValidEmail, isValidPhone } from '../utils/format'

// ─── Types ───────────────────────────────────────────────────────────────────
interface VipForm {
  first_name: string
  last_name:  string
  email:      string
  phone:      string
  birthdate:  string
  sms_optin:  boolean
}
interface VipErrors {
  first_name?: string
  last_name?:  string
  email?:      string
  phone?:      string
  birthdate?:  string
}

const INITIAL_FORM: VipForm = {
  first_name: '',
  last_name:  '',
  email:      '',
  phone:      '',
  birthdate:  '',
  sms_optin:  false,
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(f: VipForm): VipErrors {
  const e: VipErrors = {}
  if (!f.first_name)                  e.first_name = 'First name is required.'
  if (!f.last_name)                   e.last_name  = 'Last name is required.'
  if (!f.email)                       e.email      = 'Email is required.'
  else if (!isValidEmail(f.email))    e.email      = 'Please enter a valid email.'
  if (!f.phone)                       e.phone      = 'Phone number is required.'
  else if (!isValidPhone(f.phone))    e.phone      = 'Enter a valid 10-digit number.'
  if (!f.birthdate)                   e.birthdate  = 'Date of birth is required.'
  return e
}

// ─── Service Overview Data ────────────────────────────────────────────────────
const SERVICES_OVERVIEW = [
  { icon: '🛢', title: 'Oil Change',      desc: 'Conventional, synthetic blend & full synthetic. Quick turnaround.' },
  { icon: '🔄', title: 'Tire Rotation',  desc: 'Extend tire life. Free with VIP membership.' },
  { icon: '🛑', title: 'Brake Service',  desc: 'Inspection, pad replacement, rotor service and more.' },
  { icon: '🔋', title: 'Battery Service',desc: 'Testing, charging, and replacement. All major brands.' },
  { icon: '❄',  title: 'A/C Service',    desc: 'Refrigerant recharge, leak diagnosis, full system repair.' },
  { icon: '🔧', title: 'General Repair', desc: 'Engine, transmission, suspension — complete diagnostic & repair.' },
]

// ─── Why Us Data ─────────────────────────────────────────────────────────────
const WHY_US = [
  { icon: '🛡', title: 'ASE Certified Techs',    desc: 'All mechanics are ASE certified with years of hands-on experience.' },
  { icon: '⏱', title: 'Quick Turnaround',         desc: 'Most oil changes done in 30 minutes or less. Your time matters.' },
  { icon: '💰', title: 'Transparent Pricing',      desc: 'No surprises. We show you the cost before any work begins.' },
  { icon: '⭐', title: '5-Star Reviews',            desc: 'Hundreds of satisfied customers throughout the Central Valley.' },
]

// ─── Field component ─────────────────────────────────────────────────────────
function Field({
  label, id, error, children,
}: {
  label: string; id: string; error?: string; children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-cv-muted mb-1.5 uppercase tracking-wide">
        {label} <span className="text-red-400">*</span>
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [form, setForm]       = useState<VipForm>(INITIAL_FORM)
  const [errors, setErrors]   = useState<VipErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function update(field: keyof VipForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof VipErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    const ok = await postToWebhook('vip', {
      source:      'vip_signup',
      first_name:  form.first_name,
      last_name:   form.last_name,
      email:       form.email,
      phone:       normalizePhone(form.phone),
      birthdate:   form.birthdate,
      sms_optin:   form.sms_optin ? 'yes' : 'no',
      signup_date: new Date().toISOString(),
      offer:       'free_tire_rotation',
    })
    setLoading(false)

    if (ok) {
      setSuccess(true)
      toast.success('Welcome to the VIP Club!')
    } else {
      toast.error('Something went wrong. Please call us to join.')
    }
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-cv-dark">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cv-dark/95 via-[#130505]/90 to-cv-dark/80" />
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(ellipse_at_70%_50%,rgba(220,38,38,0.12)_0%,transparent_65%)]" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block bg-red-600/10 border border-red-600/20 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              🏆 Central Valley's Most Trusted Auto Shop
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.08] mb-6 tracking-tight">
              Join the <span className="text-red-500">VIP Club</span><br />
              &amp; Never Miss a<br />
              <span className="text-red-500">Service Again</span>
            </h1>
            <p className="text-cv-muted text-lg leading-relaxed mb-8 max-w-xl">
              Exclusive maintenance reminders, priority booking, and member-only deals —{' '}
              <strong className="text-white">all free</strong>.
            </p>

            <div className="flex flex-col gap-2.5 mb-10">
              {[
                'Free tire rotation with membership',
                'SMS & email service alerts',
                'Priority scheduling',
                'Birthday discounts',
              ].map(perk => (
                <div key={perk} className="flex items-center gap-2.5 text-cv-muted text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </div>

            <a
              href="#vip-form"
              className="btn-primary inline-flex text-base px-8 py-4 rounded-xl"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('vip-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              Join VIP Club – It's Free
            </a>
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ── */}
      <div className="bg-gradient-to-r from-red-900 via-red-600 to-red-900 py-4 px-6">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 text-center">
          <span className="text-white text-sm">
            🔥 <strong>LIMITED TIME:</strong> Join the VIP Club today and get a{' '}
            <strong>FREE Tire Rotation</strong> on your next visit
          </span>
          <a
            href="#vip-form"
            className="px-4 py-1.5 bg-white text-red-700 text-xs font-bold rounded-lg hover:bg-white/90 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('vip-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Claim Offer
          </a>
        </div>
      </div>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="page-section bg-cv-dark">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Our Services</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-3">Everything Your Vehicle Needs</h2>
            <p className="text-cv-muted max-w-xl mx-auto">
              From quick oil changes to complete repairs — we do it all with honesty and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_OVERVIEW.map(({ icon, title, desc }) => (
              <Link
                key={title}
                to="/services"
                className="card p-7 hover:border-red-600/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(220,38,38,0.12)] transition-all duration-200 group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-red-400 transition-colors">
                  {title}
                </h3>
                <p className="text-cv-muted text-sm leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services" className="btn-outline btn-sm">
              View All Services &amp; Book →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIP SIGNUP FORM ── */}
      <section
        id="vip-form"
        className="page-section bg-gradient-to-b from-[#130505] via-cv-dark to-cv-dark scroll-mt-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: benefits */}
            <div>
              <span className="section-label">VIP Club</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-8 leading-tight">
                Join Free — Start Saving Today
              </h2>
              <ul className="space-y-6">
                {[
                  { icon: '🎁', title: 'Free Tire Rotation',       desc: 'Redeemable on your next visit, no strings attached.' },
                  { icon: '📅', title: 'Maintenance Reminders',    desc: 'We track your intervals and alert you by SMS & email.' },
                  { icon: '📞', title: 'Priority Service Calls',   desc: 'VIP members get called first when slots open.' },
                  { icon: '🎂', title: 'Birthday Special',         desc: 'A surprise discount every year on your birthday.' },
                  { icon: '💬', title: 'Real-Time SMS Alerts',     desc: 'Get notified the moment your vehicle is ready.' },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">{title}</div>
                      <div className="text-cv-muted text-sm mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form card */}
            <div className="card overflow-hidden shadow-2xl">
              {/* Card header */}
              <div className="bg-red-600 px-7 py-5 text-center">
                <h3 className="text-white font-extrabold text-xl">Create Your VIP Account</h3>
                <p className="text-red-200 text-sm mt-1">Takes less than 60 seconds</p>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-white text-xl font-extrabold mb-3">Welcome to the VIP Club!</h3>
                  <p className="text-cv-muted text-sm mb-6">
                    Check your phone and email for your welcome message and free tire rotation voucher.
                  </p>
                  <Link to="/services#booking" className="btn-primary">
                    Book Your First Service
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-7 space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" id="first_name" error={errors.first_name}>
                      <input
                        id="first_name"
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        value={form.first_name}
                        onChange={e => update('first_name', e.target.value)}
                        className={`input-base ${errors.first_name ? 'input-error-state' : ''}`}
                      />
                    </Field>
                    <Field label="Last Name" id="last_name" error={errors.last_name}>
                      <input
                        id="last_name"
                        type="text"
                        placeholder="Smith"
                        autoComplete="family-name"
                        value={form.last_name}
                        onChange={e => update('last_name', e.target.value)}
                        className={`input-base ${errors.last_name ? 'input-error-state' : ''}`}
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" id="email" error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@email.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      className={`input-base ${errors.email ? 'input-error-state' : ''}`}
                    />
                  </Field>

                  <Field label="Phone Number" id="phone" error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="(559) 555-0100"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={e => update('phone', formatPhone(e.target.value))}
                      className={`input-base ${errors.phone ? 'input-error-state' : ''}`}
                    />
                  </Field>

                  <Field label="Date of Birth" id="birthdate" error={errors.birthdate}>
                    <input
                      id="birthdate"
                      type="date"
                      autoComplete="bday"
                      value={form.birthdate}
                      onChange={e => update('birthdate', e.target.value)}
                      className={`input-base ${errors.birthdate ? 'input-error-state' : ''}`}
                    />
                    <p className="mt-1 text-[0.7rem] text-cv-dim">Used to send your exclusive birthday discount</p>
                  </Field>

                  <SmsOptIn
                    checked={form.sms_optin}
                    onChange={v => update('sms_optin', v)}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base"
                  >
                    {loading ? 'Submitting…' : 'Join VIP Club & Claim Free Tire Rotation'}
                  </button>

                  <p className="text-center text-[0.7rem] text-cv-dim">
                    By submitting, you agree to our{' '}
                    <Link to="/contact#privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    We never sell your information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="page-section bg-cv-card">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Why Central Valley Auto Care</span>
            <h2 className="text-4xl font-black text-white mt-2">Honest. Fast. Affordable.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-cv-input border border-cv-border rounded-xl p-7 text-center hover:border-red-600/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-cv-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="page-section bg-cv-card border-t border-cv-border">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Simple Process</span>
            <h2 className="text-4xl font-black text-white mt-2">How the VIP Club Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: '📋',
                title: 'Join Free',
                desc: 'Fill out the form above in under 60 seconds. No credit card, no commitment — just your name and number.',
              },
              {
                step: '02',
                icon: '🔔',
                title: 'We Track Your Intervals',
                desc: "We monitor your service history and send you a heads-up by SMS or email before you're ever overdue.",
              },
              {
                step: '03',
                icon: '🚗',
                title: 'Book & Save',
                desc: 'Priority scheduling, member-only discounts, and a free tire rotation waiting for you on your next visit.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="text-6xl font-black text-cv-border/60 leading-none mb-4 select-none">
                  {step}
                </div>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-extrabold text-lg mb-3">{title}</h3>
                <p className="text-cv-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#vip-form"
              className="btn-primary inline-flex text-sm px-6 py-3 rounded-xl"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('vip-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              Join the VIP Club — It's Free
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
