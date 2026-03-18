import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Users, Calendar, MessageSquare,
  LogOut, Menu, X, Send, Download, Settings,
} from 'lucide-react'
import { DASHBOARD_PASSWORD, MAKE_MESSAGE_WEBHOOK } from '../config'

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'contacts' | 'vip' | 'bookings' | 'messages'

interface AirtablePlaceholderProps {
  icon: string
  title: string
  description: string
  embedHint: string
}

// ─── Subcomponents ────────────────────────────────────────────────────────────
function AirtablePlaceholder({ icon, title, description, embedHint }: AirtablePlaceholderProps) {
  return (
    <div className="flex-1 border border-dashed border-[#2a2d3e] rounded-xl p-12 text-center text-[#5c6080] flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm max-w-md leading-relaxed mb-4">{description}</p>
      <code className="bg-[#0f111a] text-orange-400 text-xs px-4 py-2.5 rounded-lg block max-w-lg w-full text-left break-all">
        {embedHint}
      </code>
      <p className="text-xs mt-4 text-[#5c6080]">
        Airtable → Interfaces → Create Interface → Share → Embed → paste{' '}
        <code className="text-orange-400">&lt;iframe&gt;</code> code here
      </p>
    </div>
  )
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS: { tab: Tab; icon: ReactNode; label: string }[] = [
  { tab: 'overview',  icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
  { tab: 'contacts',  icon: <Users className="w-4 h-4" />,           label: 'All Contacts' },
  { tab: 'vip',       icon: <span className="text-sm">🏆</span>,      label: 'VIP Members' },
  { tab: 'bookings',  icon: <Calendar className="w-4 h-4" />,         label: 'Appointments' },
  { tab: 'messages',  icon: <MessageSquare className="w-4 h-4" />,    label: 'Send Message' },
]

// ─── Message types ────────────────────────────────────────────────────────────
type MsgType = 'sms' | 'email' | 'call'

// ─── Dashboard (protected) ────────────────────────────────────────────────────
export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('db_auth') === 'true'
  )
  const [pinInput, setPinInput]   = useState('')
  const [pinError, setPinError]   = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Message compose state
  const [msgType, setMsgType]   = useState<MsgType>('sms')
  const [msgTo, setMsgTo]       = useState<string[]>(['All Contacts'])
  const [msgSubject, setMsgSubject] = useState('')
  const [msgBody, setMsgBody]   = useState('')
  const [sending, setSending]   = useState(false)

  function login() {
    if (pinInput === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('db_auth', 'true')
      setAuthenticated(true)
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  function logout() {
    sessionStorage.removeItem('db_auth')
    setAuthenticated(false)
  }

  function toggleAudience(audience: string) {
    setMsgTo(prev =>
      prev.includes(audience) ? prev.filter(a => a !== audience) : [...prev, audience]
    )
  }

  async function sendMessage() {
    if (!msgBody.trim()) { toast.error('Please write a message first.'); return }
    if (msgTo.length === 0) { toast.error('Please select an audience.'); return }

    if (!MAKE_MESSAGE_WEBHOOK) {
      toast('⚠ Configure MAKE_MESSAGE_WEBHOOK in src/config.ts to enable sending.', {
        icon: '⚠',
        style: { background: '#1e2235', color: '#f59e0b', border: '1px solid #2a2d3e' },
      })
      return
    }

    setSending(true)
    try {
      const res = await fetch(MAKE_MESSAGE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:     msgType,
          audience: msgTo,
          body:     msgBody,
          subject:  msgSubject,
          sent_at:  new Date().toISOString(),
        }),
      })
      if (res.ok) {
        toast.success('Message sent to Make.com!')
        setMsgBody('')
        setMsgSubject('')
      } else {
        toast.error('Make.com returned an error.')
      }
    } catch {
      toast.error('Failed to reach Make.com webhook.')
    } finally {
      setSending(false)
    }
  }

  // ── Login Gate ──────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-[#0f111a] flex items-center justify-center p-4">
        <div className="bg-[#161824] border border-[#2a2d3e] rounded-2xl p-10 w-full max-w-sm text-center">
          <Settings className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-white font-extrabold text-xl mb-1">Owner Dashboard</h2>
          <p className="text-[#9ba3c0] text-sm mb-6">Central Valley Auto Care — Staff Access Only</p>

          {pinError && (
            <p className="text-red-400 text-sm mb-3">Incorrect password. Try again.</p>
          )}

          <input
            type="password"
            placeholder="Enter dashboard password"
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full px-4 py-3 bg-[#0f111a] border border-[#2a2d3e] rounded-xl text-white text-sm mb-4 focus:outline-none focus:border-red-500"
            autoComplete="current-password"
          />
          <button
            onClick={login}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
          >
            Access Dashboard
          </button>
          <Link to="/" className="block mt-4 text-[#5c6080] text-xs hover:text-white transition-colors">
            ← Back to Website
          </Link>
        </div>
      </div>
    )
  }

  // ── Dashboard Layout ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f111a] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-[#161824] border-b border-[#2a2d3e] z-50 flex items-center px-6 gap-4">
        <button
          className="text-[#9ba3c0] hover:text-white transition-colors lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <Settings className="w-5 h-5 text-red-500" />
          <div className="leading-tight">
            <div className="text-white font-extrabold text-sm">Central Valley Auto Care</div>
            <div className="text-red-500 text-[0.6rem] font-bold uppercase tracking-widest">Owner Dashboard</div>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link to="/" className="text-[#9ba3c0] text-xs hover:text-white transition-colors hidden sm:block">
            ← Back to Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-bold rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </header>

      <div className="flex pt-[70px]">
        {/* Sidebar */}
        <aside
          className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[240px] bg-[#161824] border-r border-[#2a2d3e] z-40 transition-transform duration-300 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="flex-1 py-4">
            <div className="px-4 mb-2">
              <p className="text-[#5c6080] text-[0.65rem] font-bold uppercase tracking-widest px-2 mb-1">
                Main
              </p>
            </div>

            {NAV_ITEMS.slice(0, 1).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-2 ${
                  activeTab === tab
                    ? 'text-white bg-red-600/10 border-red-600'
                    : 'text-[#9ba3c0] hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {icon} {label}
              </button>
            ))}

            <div className="px-4 mt-4 mb-2">
              <p className="text-[#5c6080] text-[0.65rem] font-bold uppercase tracking-widest px-2 mb-1">
                Customers
              </p>
            </div>

            {NAV_ITEMS.slice(1, 4).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-2 ${
                  activeTab === tab
                    ? 'text-white bg-red-600/10 border-red-600'
                    : 'text-[#9ba3c0] hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {icon} {label}
              </button>
            ))}

            <div className="px-4 mt-4 mb-2">
              <p className="text-[#5c6080] text-[0.65rem] font-bold uppercase tracking-widest px-2 mb-1">
                Communication
              </p>
            </div>

            {NAV_ITEMS.slice(4).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-2 ${
                  activeTab === tab
                    ? 'text-white bg-red-600/10 border-red-600'
                    : 'text-[#9ba3c0] hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#2a2d3e]">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-[#9ba3c0] hover:text-white text-xs transition-colors"
            >
              🌐 View Website
            </Link>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-[240px] p-6 min-h-[calc(100vh-70px)]">

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
                  <p className="text-[#9ba3c0] text-sm mt-1">Welcome back. Here's a snapshot of your business.</p>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors hidden sm:flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Contacts',       value: '—', note: 'Sync with Airtable' },
                  { label: 'VIP Members',           value: '—', note: 'SMS opt-in list' },
                  { label: 'SMS Opt-In',            value: '—', note: 'Active subscribers' },
                  { label: 'Appointments (Month)',  value: '—', note: 'View in Airtable' },
                ].map(({ label, value, note }) => (
                  <div key={label} className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-5">
                    <div className="text-[#9ba3c0] text-[0.7rem] font-bold uppercase tracking-wider mb-2">{label}</div>
                    <div className="text-white text-3xl font-black mb-1">{value}</div>
                    <div className="text-[#5c6080] text-xs">{note}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: <Users className="w-6 h-6" />,    label: 'View Contacts',   desc: 'Browse all customers',       action: () => setActiveTab('contacts') },
                  { icon: <Download className="w-6 h-6" />, label: 'Download List',    desc: 'Export via Airtable CSV',    action: () => toast('Export from Airtable → Grid view menu → Download CSV', { icon: 'ℹ' }) },
                  { icon: <Send className="w-6 h-6" />,     label: 'Send Message',     desc: 'Blast SMS or email',         action: () => setActiveTab('messages') },
                  { icon: <Calendar className="w-6 h-6" />, label: 'Appointments',     desc: 'View pending bookings',      action: () => setActiveTab('bookings') },
                ].map(({ icon, label, desc, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-6 text-center hover:border-red-600/50 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="text-[#9ba3c0] mb-2 flex justify-center">{icon}</div>
                    <div className="text-white font-bold text-sm">{label}</div>
                    <div className="text-[#5c6080] text-xs mt-1">{desc}</div>
                  </button>
                ))}
              </div>

              {/* Airtable embed */}
              <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2a2d3e]">
                  <h3 className="text-white font-bold text-sm">Airtable Interface</h3>
                </div>
                <AirtablePlaceholder
                  icon="📊"
                  title="Connect Your Airtable Interface"
                  description="Replace this section with your Airtable Interface embed. Go to Airtable → Interfaces → Create Interface → Share → Enable public link or embed → copy the iframe code."
                  embedHint='<iframe src="https://airtable.com/embed/YOUR_INTERFACE_ID" width="100%" height="800px" style="background:transparent;border:none;"></iframe>'
                />
              </div>
            </div>
          )}

          {/* ── Contacts ── */}
          {activeTab === 'contacts' && (
            <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">All Contacts</h1>
                  <p className="text-[#9ba3c0] text-sm mt-1">Your full customer database synced from Make.com → Airtable.</p>
                </div>
                <button
                  onClick={() => toast('Export from Airtable → Grid view menu → Download CSV', { icon: 'ℹ' })}
                  className="flex items-center gap-2 px-4 py-2 border border-[#2a2d3e] text-[#9ba3c0] hover:text-white hover:border-[#9ba3c0] text-sm rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl overflow-hidden flex-1 flex flex-col">
                <AirtablePlaceholder
                  icon="👥"
                  title="Airtable Contacts View"
                  description="Embed your Airtable Contacts table interface here. Filter by VIP status, SMS opt-in, signup date, and more."
                  embedHint='<iframe src="https://airtable.com/embed/YOUR_CONTACTS_VIEW" width="100%" height="100%" style="background:transparent;border:none;"></iframe>'
                />
              </div>
            </div>
          )}

          {/* ── VIP Members ── */}
          {activeTab === 'vip' && (
            <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">VIP Members</h1>
                  <p className="text-[#9ba3c0] text-sm mt-1">Customers who joined the VIP Club through the website.</p>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Message VIPs
                </button>
              </div>
              <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl overflow-hidden flex-1 flex flex-col">
                <AirtablePlaceholder
                  icon="🏆"
                  title="VIP Members View"
                  description="Embed a filtered Airtable view here showing only VIP Club members. In Airtable, filter your Contacts table where source = 'vip_signup'."
                  embedHint='<iframe src="https://airtable.com/embed/YOUR_VIP_VIEW" width="100%" height="100%" style="background:transparent;border:none;"></iframe>'
                />
              </div>
            </div>
          )}

          {/* ── Bookings ── */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Appointments</h1>
                <p className="text-[#9ba3c0] text-sm mt-1">Booking requests submitted through the website — sent via Make.com.</p>
              </div>
              <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl overflow-hidden flex-1 flex flex-col">
                <AirtablePlaceholder
                  icon="📅"
                  title="Bookings / Appointments View"
                  description="Embed your Airtable Bookings table here. Recommended columns: Name, Phone, Vehicle, Service, Preferred Date, Status (Pending / Confirmed / Completed), Notes."
                  embedHint='<iframe src="https://airtable.com/embed/YOUR_BOOKINGS_VIEW" width="100%" height="100%" style="background:transparent;border:none;"></iframe>'
                />
              </div>
            </div>
          )}

          {/* ── Send Message ── */}
          {activeTab === 'messages' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-white">Send Message</h1>
                <p className="text-[#9ba3c0] text-sm mt-1">Trigger a manual SMS or email campaign via Make.com.</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Message type */}
                <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-4">Message Type</h3>
                  <div className="flex gap-2">
                    {([
                      { type: 'sms' as MsgType,   label: '💬 SMS / Text' },
                      { type: 'email' as MsgType, label: '✉ Email' },
                      { type: 'call' as MsgType,  label: '📞 Call List' },
                    ] as { type: MsgType; label: string }[]).map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => setMsgType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          msgType === type
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-[#2a2d3e] text-[#9ba3c0] hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {msgType === 'call' && (
                    <div className="mt-4 bg-[#0f111a] border border-[#2a2d3e] rounded-lg p-4 text-sm text-[#9ba3c0]">
                      <strong className="text-white">📞 Call List Mode:</strong> This generates a
                      filtered list of customers for manual or automated outbound calling, sent to
                      your Make.com scenario.
                    </div>
                  )}
                </div>

                {/* Audience */}
                <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-4">Send To</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All Contacts', 'VIP Members Only', 'SMS Opt-In Only', 'Due for Oil Change', 'Inactive (90+ days)'].map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAudience(a)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          msgTo.includes(a)
                            ? 'bg-red-600/15 border-red-600 text-white'
                            : 'border-[#2a2d3e] text-[#9ba3c0] hover:text-white'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compose */}
                <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-bold text-sm">Compose</h3>

                  {msgType === 'email' && (
                    <div>
                      <label className="block text-[#9ba3c0] text-xs font-semibold uppercase tracking-wide mb-1.5">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Your vehicle is due for service!"
                        value={msgSubject}
                        onChange={e => setMsgSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f111a] border border-[#2a2d3e] rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[#9ba3c0] text-xs font-semibold uppercase tracking-wide mb-1.5">
                      Message Body
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Hi {FirstName}, it's time for your next service at Central Valley Auto Care! Book now: [LINK] Reply STOP to opt out."
                      value={msgBody}
                      onChange={e => setMsgBody(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0f111a] border border-[#2a2d3e] rounded-lg text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                    />
                    <p className="mt-1 text-[#5c6080] text-xs">
                      Use &#123;FirstName&#125; for personalization. Keep SMS under 160 characters.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={sendMessage}
                      disabled={sending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? 'Sending…' : 'Send via Make.com'}
                    </button>
                    <button
                      onClick={() => {
                        if (!msgBody) { toast.error('Write a message first.'); return }
                        toast(msgBody.replace(/\{FirstName\}/g, 'John'), { icon: '👁', duration: 5000 })
                      }}
                      className="px-5 py-2.5 border border-[#2a2d3e] text-[#9ba3c0] hover:text-white text-sm rounded-lg transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Setup guide */}
                <div className="bg-[#161824] border border-[#2a2d3e] rounded-xl p-6">
                  <h4 className="text-white font-bold text-sm mb-3">Make.com Setup</h4>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[#9ba3c0] text-sm leading-relaxed">
                    <li>In Make.com, create a new scenario with a <strong className="text-white">Webhook</strong> trigger</li>
                    <li>Add an Airtable "Search Records" module to get your target audience</li>
                    <li>Add a loop + SMS module (Twilio) or Email module (SendGrid / Mailchimp)</li>
                    <li>Copy your webhook URL and paste it as <code className="bg-[#0f111a] px-1.5 py-0.5 rounded text-orange-400 text-xs">MAKE_MESSAGE_WEBHOOK</code> in <code className="bg-[#0f111a] px-1.5 py-0.5 rounded text-orange-400 text-xs">src/config.ts</code></li>
                    <li>Test with a message to yourself first</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
