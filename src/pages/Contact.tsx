import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { postToWebhook } from '../lib/webhooks'
import { formatPhone, isValidPhone } from '../utils/format'
import { BUSINESS } from '../config'

interface ContactForm {
  name:    string
  phone:   string
  email:   string
  subject: string
  message: string
}
interface ContactErrors {
  name?:    string
  phone?:   string
  subject?: string
  message?: string
}

const INITIAL: ContactForm = { name: '', phone: '', email: '', subject: '', message: '' }

function validate(f: ContactForm): ContactErrors {
  const e: ContactErrors = {}
  if (!f.name)    e.name    = 'Name is required.'
  if (!f.phone)   e.phone   = 'Phone number is required.'
  else if (!isValidPhone(f.phone)) e.phone = 'Enter a valid 10-digit number.'
  if (!f.subject) e.subject = 'Please select a subject.'
  if (!f.message) e.message = 'Please enter a message.'
  return e
}

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

export default function Contact() {
  const [form, setForm]       = useState<ContactForm>(INITIAL)
  const [errors, setErrors]   = useState<ContactErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function update(field: keyof ContactForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof ContactErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    const ok = await postToWebhook('contact', {
      source:  'contact_form',
      name:    form.name,
      phone:   form.phone,
      email:   form.email,
      subject: form.subject,
      message: form.message,
      sent_at: new Date().toISOString(),
    })
    setLoading(false)

    if (ok) {
      setSuccess(true)
      toast.success('Message sent!')
    } else {
      toast.error('Failed to send. Please call us directly.')
    }
  }

  return (
    <>
      {/* Page Hero */}
      <section className="py-20 text-center bg-gradient-to-b from-[#130505] to-cv-dark border-b border-cv-border">
        <div className="container">
          <h1 className="text-5xl font-black text-white mb-3">Contact Us</h1>
          <p className="text-cv-muted text-lg">We're here to help. Reach us by phone, text, or the form below.</p>
        </div>
      </section>

      {/* Contact option cards */}
      <section className="page-section">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: BUSINESS.phoneHref,
                icon: '📞', title: 'Call Us',
                value: BUSINESS.phone,
                sub: `Mon–Fri ${BUSINESS.hoursWeekday}`,
              },
              {
                href: BUSINESS.smsHref,
                icon: '💬', title: 'Text Us',
                value: BUSINESS.phone,
                sub: 'Usually responds within the hour',
              },
              {
                href: `mailto:${BUSINESS.email}`,
                icon: '✉', title: 'Email Us',
                value: BUSINESS.email,
                sub: 'We respond within 24 hours',
              },
              {
                href: '/services#booking',
                icon: '📅', title: 'Book Online',
                value: 'Request an appointment',
                sub: 'Confirmed within 1 business hour',
                isRoute: true,
              },
            ].map(({ href, icon, title, value, sub, isRoute }) =>
              isRoute ? (
                <Link
                  key={title}
                  to={href}
                  className="card p-7 text-center hover:border-red-600/50 hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="text-4xl mb-3">{icon}</div>
                  <h3 className="text-white font-extrabold text-base mb-1 group-hover:text-red-400 transition-colors">{title}</h3>
                  <p className="text-cv-muted text-sm font-semibold mb-1">{value}</p>
                  <p className="text-cv-dim text-xs">{sub}</p>
                </Link>
              ) : (
                <a
                  key={title}
                  href={href}
                  className="card p-7 text-center hover:border-red-600/50 hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="text-4xl mb-3">{icon}</div>
                  <h3 className="text-white font-extrabold text-base mb-1 group-hover:text-red-400 transition-colors">{title}</h3>
                  <p className="text-cv-muted text-sm font-semibold mb-1">{value}</p>
                  <p className="text-cv-dim text-xs">{sub}</p>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="page-section bg-cv-card">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-14 items-start">
            {/* Left info */}
            <div>
              <span className="section-label">Send a Message</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-4 leading-tight">Have a Question?</h2>
              <p className="text-cv-muted text-sm mb-8">
                Ask us anything about your vehicle, our services, or pricing. We'll get back to you promptly.
              </p>
              <div className="space-y-5">
                {[
                  { icon: '📍', label: 'Address',      value: BUSINESS.address },
                  { icon: '📞', label: 'Phone / Text',  value: BUSINESS.phone,  href: BUSINESS.phoneHref },
                  { icon: '⏰', label: 'Hours',
                    value: `Mon–Fri: ${BUSINESS.hoursWeekday}\nSat: ${BUSINESS.hoursSaturday}\nSun: ${BUSINESS.hoursSunday}` },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <div className="text-white text-xs font-bold uppercase tracking-wide mb-0.5">{label}</div>
                      {href ? (
                        <a href={href} className="text-cv-muted text-sm hover:text-white transition-colors">{value}</a>
                      ) : (
                        <div className="text-cv-muted text-sm whitespace-pre-line leading-relaxed">{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-cv-input border border-cv-border rounded-xl p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-white text-xl font-extrabold mb-3">Message Sent!</h3>
                  <p className="text-cv-muted text-sm mb-2">Thanks for reaching out. We'll be in touch shortly.</p>
                  <p className="text-cv-muted text-sm">
                    Need urgent help? Call{' '}
                    <a href={BUSINESS.phoneHref} className="text-red-400 hover:text-red-300">{BUSINESS.phone}</a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Your Name" required error={errors.name}>
                      <input type="text" placeholder="Full name" value={form.name}
                        onChange={e => update('name', e.target.value)}
                        className={`input-base ${errors.name ? 'input-error-state' : ''}`} />
                    </Field>
                    <Field label="Phone" required error={errors.phone}>
                      <input type="tel" placeholder="(559) 555-0100" value={form.phone}
                        onChange={e => update('phone', formatPhone(e.target.value))}
                        className={`input-base ${errors.phone ? 'input-error-state' : ''}`} />
                    </Field>
                  </div>

                  <Field label="Email">
                    <input type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => update('email', e.target.value)}
                      className="input-base" />
                  </Field>

                  <Field label="Subject" required error={errors.subject}>
                    <div className="relative">
                      <select value={form.subject} onChange={e => update('subject', e.target.value)}
                        className={`input-base appearance-none pr-10 ${errors.subject ? 'input-error-state' : ''}`}>
                        <option value="">— Select a topic —</option>
                        {['Service Question','Pricing Inquiry','Appointment / Scheduling','Vehicle Issue / Concern','VIP Club Question','Feedback / Compliment','Other']
                          .map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cv-dim pointer-events-none">▾</span>
                    </div>
                  </Field>

                  <Field label="Message" required error={errors.message}>
                    <textarea rows={5}
                      placeholder="Tell us what's going on with your vehicle or what you'd like to know…"
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      className={`input-base resize-none ${errors.message ? 'input-error-state' : ''}`}
                    />
                  </Field>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="page-section border-t border-cv-border">
        <div className="container">
          <div className="border border-dashed border-cv-border rounded-2xl p-12 text-center text-cv-dim">
            <div className="text-4xl mb-3">🗺</div>
            <h3 className="text-white font-bold text-base mb-2">Add Your Google Maps Embed Here</h3>
            <p className="text-sm mb-1">
              Go to{' '}
              <span className="text-cv-muted">maps.google.com</span> → Search your business → Share →
              Embed a map → Copy the{' '}
              <code className="bg-cv-input px-1.5 py-0.5 rounded text-xs text-orange-400">&lt;iframe&gt;</code>{' '}
              code and replace this section in{' '}
              <code className="bg-cv-input px-1.5 py-0.5 rounded text-xs text-orange-400">src/pages/Contact.tsx</code>
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" className="page-section bg-cv-card border-t border-cv-border">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-white font-bold text-xl mb-6">Privacy Policy</h3>
          <div className="space-y-4 text-cv-muted text-sm leading-relaxed">
            <p><strong className="text-white">Last updated: 2025</strong></p>
            <p>
              Central Valley Auto Care is committed to protecting the personal information you share
              with us. This Privacy Policy describes how we collect, use, and protect your information
              when you use our website or sign up for our VIP Club.
            </p>
            <div>
              <h4 className="text-white font-semibold mb-2">Information We Collect</h4>
              <p>
                We collect information you voluntarily provide including: first and last name, email
                address, phone number, date of birth, and vehicle information when booking a service.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">How We Use Your Information</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>To confirm and manage service appointments</li>
                <li>To send maintenance reminders and service alerts via email and/or SMS</li>
                <li>To send exclusive offers and promotions to VIP Club members</li>
                <li>To send birthday discounts</li>
                <li>To respond to your inquiries</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Text Message Marketing</h4>
              <p>
                By opting in to SMS messages, you consent to receive recurring automated marketing
                text messages. Message &amp; data rates may apply. Reply STOP to opt out at any time.
                Reply HELP for assistance.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">We Never Sell Your Data</h4>
              <p>
                We do not sell, trade, or share your personal information with third parties for
                their marketing purposes. Data is stored securely using Airtable's enterprise-grade
                infrastructure.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Contact</h4>
              <p>
                For privacy questions, contact us at{' '}
                <a href={`mailto:${BUSINESS.email}`} className="text-red-400 hover:text-red-300">
                  {BUSINESS.email}
                </a>{' '}
                or call{' '}
                <a href={BUSINESS.phoneHref} className="text-red-400 hover:text-red-300">
                  {BUSINESS.phone}
                </a>.
              </p>
            </div>
            <Link to="/#sms-policy" className="inline-block text-red-400 hover:text-red-300 text-sm">
              View SMS Terms →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
