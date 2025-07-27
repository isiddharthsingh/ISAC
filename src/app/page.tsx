"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { 
  Users, 
  ArrowRight, 
  GraduationCap,
  MessageCircle,
  Video,
  Award,
  Heart,
  Globe,
  CheckCircle,
  UserCheck,
  X
} from "lucide-react"
import { InteractiveGlobe } from "@/components/interactive-globe"

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const countRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(start + (end - start) * easeOutCubic))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isVisible, end, duration, start])

  return { count, countRef }
}

// Stat card component with enhanced design
const StatCard = ({ 
  icon: Icon, 
  count, 
  suffix = "", 
  label, 
  description, 
  color,
  bgPattern 
}: {
  icon: React.ComponentType<{ className?: string }>
  count: number
  suffix?: string
  label: string
  description: string
  color: string
  bgPattern: string
}) => {
  const { count: animatedCount, countRef } = useCountUp(count)
  
  return (
    <div 
      ref={countRef}
      className={`group relative p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden ${bgPattern}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
        <div className="absolute top-0 left-0 w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full -translate-x-12 -translate-y-12 lg:-translate-x-16 lg:-translate-y-16 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full translate-x-8 translate-y-8 lg:translate-x-12 lg:translate-y-12 opacity-15"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 ${color}`}>
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
        </div>
        
        {/* Count */}
        <div className="mb-2 lg:mb-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight">
            {animatedCount.toLocaleString()}{suffix}
          </span>
        </div>
        
        {/* Label */}
        <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">{label}</div>
        
        {/* Description - shown on hover on desktop, always visible on mobile */}
        <div className="block sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if user has visited WhatsApp groups (permanent dismissal)
    const hasVisitedWhatsApp = localStorage.getItem('isac_whatsapp_visited')
    
    if (!hasVisitedWhatsApp) {
      // Check if user dismissed and when
      const lastDismissed = localStorage.getItem('isac_whatsapp_dismissed')
      const now = new Date().getTime()
      const threeDays = 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
      
      // Show popup if never dismissed OR it's been 3+ days since dismissal
      if (!lastDismissed || (now - parseInt(lastDismissed)) > threeDays) {
        // Show popup after a short delay for better UX
        const timer = setTimeout(() => {
          setShowWhatsAppPopup(true)
        }, 3000) // 3 second delay
        
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleWhatsAppVisit = () => {
    // Mark as visited (never show again)
    localStorage.setItem('isac_whatsapp_visited', 'true')
    // Clear any dismissal record since they visited
    localStorage.removeItem('isac_whatsapp_dismissed')
    
    setShowWhatsAppPopup(false)
    // Redirect to WhatsApp groups page
    window.open('/whatsapp-groups', '_self')
  }

  const handleWhatsAppClose = () => {
    // Record dismissal timestamp (will show again in 3 days)
    const now = new Date().getTime()
    localStorage.setItem('isac_whatsapp_dismissed', now.toString())
    setShowWhatsAppPopup(false)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" />
  }

  const stats = [
    {
      icon: Users,
      count: 25000,
      suffix: "+",
      label: "Students Helped",
      description: "Students from 85+ countries have received mentorship and guidance through our platform",
      color: "bg-gradient-to-br from-[#384633] to-[#2d3a2a]",
      bgPattern: "bg-gradient-to-br from-[#384633]/10 to-[#384633]/5 border border-[#384633]/20"
    },
    {
      icon: Globe,
      count: 100,
      suffix: "+",
      label: "Countries",
      description: "Our global community spans across six continents, connecting students worldwide",
      color: "bg-gradient-to-br from-[#384633] to-[#2d3a2a]",
      bgPattern: "bg-gradient-to-br from-[#384633]/10 to-[#384633]/5 border border-[#384633]/20"
    },
    {
      icon: CheckCircle,
      count: 92,
      suffix: "%",
      label: "Success Rate",
      description: "Of our students successfully gain admission to their target universities",
      color: "bg-gradient-to-br from-[#384633] to-[#2d3a2a]",
      bgPattern: "bg-gradient-to-br from-[#384633]/10 to-[#384633]/5 border border-[#384633]/20"
    },
    {
      icon: UserCheck,
      count: 300,
      suffix: "+",
      label: "Expert Mentors",
      description: "Certified professionals and alumni from top universities worldwide",
      color: "bg-gradient-to-br from-[#384633] to-[#2d3a2a]",
      bgPattern: "bg-gradient-to-br from-[#384633]/10 to-[#384633]/5 border border-[#384633]/20"
    }
  ]

  return (
          <div className="min-h-screen bg-gradient-to-br from-[#384633]/10 via-white to-[#2d3a2a]/10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#384633]/15 via-[#2d3a2a]/10 to-[#384633]/15" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <Badge className="mb-4 sm:mb-6 bg-[#384633]/10 text-[#384633] border-[#384633]/20 text-xs sm:text-sm">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Global Education Platform
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                <span className="text-[#384633]">International Student Advocacy Committee</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join our vibrant community of students and mentors, access exclusive WhatsApp groups, attend inspiring webinars, and connect with thousands of students pursuing their international education goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/whatsapp-groups">
                  <Button size="lg" className="bg-[#384633] hover:bg-[#2d3a2a] text-sm sm:text-base px-6 sm:px-8">
                    Join Community
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link href="/volunteers">
                  <Button size="lg" variant="outline" className="border-gray-300 text-sm sm:text-base px-6 sm:px-8">
                    Explore Mentors
                    <Users className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - Interactive Globe */}
            <div className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">
                {/* Mobile: smaller, constrained globe */}
                <div className="block lg:hidden">
                  <div className="w-72 h-72 sm:w-80 sm:h-80 mx-auto relative overflow-hidden">
                    <div className="scale-65 sm:scale-80 origin-center w-full h-full flex items-center justify-center">
                      <InteractiveGlobe />
                    </div>
                  </div>
                </div>
                
                {/* Desktop: full-size globe */}
                <div className="hidden lg:block">
                  <InteractiveGlobe />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-28 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#384633]/25 to-[#2d3a2a]/15 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#2d3a2a]/20 to-[#384633]/10 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Join thousands of successful students who have achieved their international education dreams with our platform
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          
          {/* Additional Context */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-4">
              <span className="block sm:inline">✨ Updated in real-time</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🌍 Growing daily</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🎯 Success guaranteed</span>
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-28 bg-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#384633]/25 to-[#2d3a2a]/15 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-1/4 -right-16 sm:-right-32 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#2d3a2a]/20 to-[#384633]/10 rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <Badge className="mb-4 sm:mb-6 bg-[#384633]/10 text-[#384633] border-[#384633]/20 text-xs sm:text-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Comprehensive Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Everything You Need for Your Journey
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our comprehensive platform provides all the tools and support you need to achieve your international education goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Expert Mentorship */}
            <div className="group relative bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-blue-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-blue-300 rounded-full translate-y-8 -translate-x-8 lg:translate-y-12 lg:-translate-x-12 opacity-20"></div>
              </div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 bg-gradient-to-br from-[#384633] to-[#2d3a2a] transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Expert Mentorship</h3>
                <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed text-sm sm:text-base">
                  Connect with experienced professionals who&apos;ve been through the same journey
                </p>
                
                {/* Features List */}
                <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    1-on-1 guidance sessions
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    University selection advice
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Application strategy
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Career planning support
                  </li>
                </ul>
                
                {/* CTA Button */}
                <Link href="/volunteers">
                  <Button className="w-full bg-[#384633] hover:bg-[#2d3a2a] group-hover:bg-[#2d3a2a] transition-colors duration-300 text-sm sm:text-base">
                    Find Mentors
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#384633]/0 via-[#384633]/5 to-[#384633]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Live Webinars */}
            <div className="group relative bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-purple-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-purple-300 rounded-full translate-y-8 -translate-x-8 lg:translate-y-12 lg:-translate-x-12 opacity-20"></div>
              </div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 bg-gradient-to-br from-[#384633] to-[#2d3a2a] transition-transform duration-300 group-hover:scale-110">
                  <Video className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Live Webinars</h3>
                <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed text-sm sm:text-base">
                  Join interactive sessions on test prep, applications, and more
                </p>
                
                {/* Features List */}
                <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    IELTS/TOEFL preparation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    University application guides
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Scholarship opportunities
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Visa process walkthrough
                  </li>
                </ul>
                
                {/* CTA Button */}
                <Link href="/webinars">
                  <Button className="w-full bg-[#384633] hover:bg-[#2d3a2a] group-hover:bg-[#2d3a2a] transition-colors duration-300 text-sm sm:text-base">
                    View Webinars
                    <Video className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#384633]/0 via-[#384633]/5 to-[#384633]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Success Stories */}
            <div className="group relative bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200 overflow-hidden md:col-span-2 lg:col-span-1">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-green-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-green-300 rounded-full translate-y-8 -translate-x-8 lg:translate-y-12 lg:-translate-x-12 opacity-20"></div>
              </div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 bg-gradient-to-br from-[#384633] to-[#2d3a2a] transition-transform duration-300 group-hover:scale-110">
                  <Award className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Success Stories</h3>
                <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed text-sm sm:text-base">
                  Get inspired by real student journeys and achievements
                </p>
                
                {/* Features List */}
                <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Student testimonials
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    University admissions
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Scholarship successes
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-[#384633] rounded-full mr-3 flex-shrink-0"></div>
                    Career achievements
                  </li>
                </ul>
                
                {/* CTA Button */}
                <Link href="/testimonials">
                  <Button className="w-full bg-[#384633] hover:bg-[#2d3a2a] group-hover:bg-[#2d3a2a] transition-colors duration-300 text-sm sm:text-base">
                    Read Stories
                    <Heart className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#384633]/0 via-[#384633]/5 to-[#384633]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Additional trust indicators */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-4">
              <span className="block sm:inline">🎓 Trusted by top universities</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🌟 Rated 4.9/5</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🚀 Growing community</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#384633] via-[#2d3a2a] to-[#384633]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Connect with 25,000+ students and mentors in our WhatsApp groups. Get guidance, support, and achieve your international education dreams together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/whatsapp-groups">
              <Button size="lg" className="bg-white text-[#384633] hover:bg-gray-100 text-sm sm:text-base px-6 sm:px-8">
                Join WhatsApp Groups
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/volunteers">
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 text-sm sm:text-base px-6 sm:px-8">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Mentors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Groups Popup */}
      <Dialog open={showWhatsAppPopup} onOpenChange={setShowWhatsAppPopup}>
        <DialogContent className="sm:max-w-md border-0 bg-white rounded-2xl shadow-2xl overflow-hidden p-0" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Join WhatsApp Groups</DialogTitle>
            <DialogDescription>Connect with students in our WhatsApp groups</DialogDescription>
          </DialogHeader>
          
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-blue-600 px-6 pt-6 pb-4">
            <button
              onClick={handleWhatsAppClose}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </button>
            
            <div className="text-center text-white">
              <div className="mx-auto w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">Join Our Community!</h2>
              <p className="text-green-100 text-xs leading-relaxed">
                We&apos;ve helped 12,000+ students achieve their dreams.
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Connect with mentors, get exclusive tips, and join thousands of successful students in our WhatsApp groups.
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center space-x-10 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-green-700">12,000+</div>
                      <div className="text-green-600">Students Helped</div>
                    </div>
                    <div className="w-px h-8 bg-green-300"></div>
                    <div className="text-center">
                      <div className="font-bold text-green-700">50+</div>
                      <div className="text-green-600">Universities</div>
                    </div>
                    
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleWhatsAppVisit}
                  className="w-full h-10 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                >
                  💬 Join WhatsApp Groups
                </Button>
                <button
                  type="button"
                  onClick={handleWhatsAppClose}
                  className="w-full h-8 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                >
                  Maybe later
                </button>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <span className="mr-1">🔒</span>
                Free to join • No spam guaranteed
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
