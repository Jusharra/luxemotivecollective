import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161824',
            color: '#e2e5f0',
            border: '1px solid #2a2d3e',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* Dashboard has its own full-screen layout */}
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="pt-[70px]">
                <Routes>
                  <Route path="/"        element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about"    element={<About />} />
                  <Route path="/contact"  element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
