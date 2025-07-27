"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, GraduationCap } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on the home page
  const isHomePage = pathname === "/"

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine navigation styling for floating glass effect
  const getNavStyles = () => {
    if (!mounted) {
      // During SSR/initial render, use consistent default
      return 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/10'
    }
    
    if (isHomePage) {
      // Home page: enhanced glass effect when scrolled, subtle when at top
      return scrolled 
        ? 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/10' 
        : 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-black/5'
    } else {
      // Other pages: always enhanced glass effect
      return 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/10'
    }
  }

  const getTextStyles = () => {
    if (!mounted) {
      // During SSR/initial render, use consistent default styles
      return {
        logo: 'text-gray-900',
        logoAccent: 'text-[#384633]',
        nav: 'text-gray-800 hover:text-[#384633]',
        button: 'bg-[#384633] hover:bg-[#2d3a2a] text-white',
        mobile: 'text-gray-800 hover:text-[#384633]'
      }
    }
    
    // Glass navbar requires darker text for better contrast
    return {
      logo: 'text-gray-900',
      logoAccent: 'text-[#384633]',
      nav: 'text-gray-800 hover:text-[#384633] hover:bg-white/20',
      button: 'bg-[#384633] hover:bg-[#2d3a2a] text-white',
      mobile: 'text-gray-800 hover:text-[#384633]'
    }
  }

  const styles = getTextStyles()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Mentors", href: "/volunteers" },
    { name: "Webinars", href: "/webinars" },
    { name: "WhatsApp Groups", href: "/whatsapp-groups" },
    { name: "Success Stories", href: "/testimonials" },
  ]

  return (
    <div className="fixed top-0 w-full z-50 pointer-events-none">
      {/* Floating Glass Container */}
      <div className="flex justify-center pt-4 px-4">
        <nav className={`
          pointer-events-auto
          transition-all duration-500 ease-out
          rounded-2xl
          ${getNavStyles()}
          ${scrolled || !isHomePage ? 'scale-100' : 'scale-95'}
          max-w-6xl w-full
        `}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative">
                    <Globe className={`h-7 w-7 transition-colors ${styles.logo}`} />
                    <GraduationCap className={`h-3.5 w-3.5 absolute -top-0.5 -right-0.5 transition-colors ${styles.logoAccent}`} />
                  </div>
                  <span className={`font-bold text-lg transition-colors ${styles.logo}`}>
                    ISAC
                  </span>
                </Link>
              </div>
              
              {/* Desktop navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-4 py-2 text-sm font-medium transition-all duration-200
                      rounded-xl
                      ${styles.nav}
                      ${pathname === item.href 
                        ? 'font-semibold bg-white/25 text-[#384633]' 
                        : ''
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${styles.mobile}
                    hover:bg-white/20
                  `}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl rounded-b-2xl">
              <div className="px-4 pt-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      block px-4 py-3 text-base font-medium transition-all duration-200
                      rounded-xl
                      ${pathname === item.href 
                        ? 'font-semibold bg-white/25 text-[#384633]' 
                        : 'text-gray-800 hover:text-[#384633] hover:bg-white/20'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
} 