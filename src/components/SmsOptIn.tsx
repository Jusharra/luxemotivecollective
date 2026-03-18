interface SmsOptInProps {
  checked: boolean
  onChange: (checked: boolean) => void
  compact?: boolean
}

export default function SmsOptIn({ checked, onChange, compact = false }: SmsOptInProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        compact
          ? 'bg-white/3 border-cv-border'
          : 'bg-green-500/5 border-green-500/20'
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        {/* Hidden native checkbox */}
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />

        {/* Custom checkbox */}
        <span
          className={`flex-shrink-0 mt-0.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
            checked
              ? 'bg-green-500 border-green-500'
              : 'bg-cv-input border-cv-border'
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
              <path
                d="M1.5 5l2.5 2.5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        {/* Legal text */}
        <span className="text-[0.72rem] text-cv-muted leading-relaxed">
          {compact ? (
            <>
              Send me appointment confirmations and service updates by text. Reply{' '}
              <strong className="text-white">STOP</strong> to cancel. Msg &amp; data rates may apply.
            </>
          ) : (
            <>
              <strong className="text-white block mb-1">Yes, send me SMS reminders &amp; alerts!</strong>
              I agree to receive recurring automated marketing text messages (including service
              reminders, special offers, and appointment alerts) from Central Valley Auto Care at the
              phone number provided. Message &amp; data rates may apply. Message frequency varies.
              Reply <strong className="text-white">STOP</strong> to cancel,{' '}
              <strong className="text-white">HELP</strong> for help. Consent is not a condition of
              purchase.{' '}
              <a href="/#sms-policy" className="underline text-cv-dim hover:text-white">
                SMS Terms
              </a>{' '}
              |{' '}
              <a href="/contact#privacy" className="underline text-cv-dim hover:text-white">
                Privacy Policy
              </a>
            </>
          )}
        </span>
      </label>
    </div>
  )
}
