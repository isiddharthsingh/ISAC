"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Dialog components removed - using custom overlay instead
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PhoneInput } from "@/components/ui/phone-input"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Play, Globe, BookOpen, ChevronRight, Video, Star, GraduationCap, Target, Zap } from "lucide-react"

// Import API functions
import { 
  getWebinars, 
  registerForWebinar,
  type DatabaseWebinar,
  type WebinarRegistrationData
} from "@/lib/api"

// Webinar type definition
interface WebinarPresenter {
  name: string
  title: string
  experience?: string
  image: string
}

interface Webinar {
  id: number
  title: string
  description: string
  presenter: WebinarPresenter
  date?: string
  time?: string
  startTime?: string
  duration: string
  maxAttendees?: number
  category: string
  level: string
  language: string
  topics: string[]
  targetAudience: string
  poster?: string
}

export default function WebinarsPage() {
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentEducation: "",
    interests: "",
    experience: "student"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Webinar data state
  const [webinarsLoading, setWebinarsLoading] = useState(true)
  const [webinarsError, setWebinarsError] = useState<string | null>(null)
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([])
  const [liveWebinars, setLiveWebinars] = useState<Webinar[]>([])
  const [pastWebinars, setPastWebinars] = useState<Webinar[]>([])

  // Transform database webinar to frontend format
  const transformWebinar = (dbWebinar: DatabaseWebinar): Webinar => {
    // Format time from 24-hour to 12-hour format with EST
    const formatTime = (timeStr: string) => {
      if (!timeStr) return 'TBD'
      const [hours, minutes] = timeStr.split(':')
      const hour24 = parseInt(hours)
      const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24
      const ampm = hour24 >= 12 ? 'PM' : 'AM'
      return `${hour12}:${minutes} ${ampm} EST`
    }

    return {
      id: dbWebinar.id,
      title: dbWebinar.title,
      description: dbWebinar.description,
      presenter: {
        name: dbWebinar.presenter_name,
        title: dbWebinar.presenter_title,
        image: dbWebinar.presenter_image || "/api/placeholder/80/80"
      },
      date: dbWebinar.event_date,
      time: formatTime(dbWebinar.event_time),
      duration: dbWebinar.duration,
      maxAttendees: dbWebinar.max_attendees,
      category: dbWebinar.category,
      level: dbWebinar.level,
      language: dbWebinar.language,
      topics: Array.isArray(dbWebinar.topics) ? dbWebinar.topics : [],
      targetAudience: dbWebinar.target_audience,
      poster: dbWebinar.poster_image
    }
  }

  // Fetch webinars from API
  const fetchWebinars = useCallback(async () => {
    try {
      setWebinarsLoading(true)
      setWebinarsError(null)

      // Fetch all webinars with a high limit to get all at once
      const result = await getWebinars({ limit: 100 })
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch webinars')
      }

      const webinars = result.data.webinars.map(transformWebinar)
      
      // Group webinars by status
      const upcoming = webinars.filter((w: Webinar) => 
        result.data.webinars.find((dw: DatabaseWebinar) => dw.id === w.id)?.status === 'upcoming'
      )
      const live = webinars.filter((w: Webinar) => 
        result.data.webinars.find((dw: DatabaseWebinar) => dw.id === w.id)?.status === 'live'
      )
      const past = webinars.filter((w: Webinar) => 
        result.data.webinars.find((dw: DatabaseWebinar) => dw.id === w.id)?.status === 'completed'
      )

      setUpcomingWebinars(upcoming)
      setLiveWebinars(live)
      setPastWebinars(past)

    } catch (err) {
      console.error('Error fetching webinars:', err)
      setWebinarsError(err instanceof Error ? err.message : 'Failed to load webinars')
    } finally {
      setWebinarsLoading(false)
    }
  }, [])

  // Fetch webinars on component mount
  useEffect(() => {
    fetchWebinars()
  }, [fetchWebinars])

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate .edu email on frontend as well
      if (!registrationForm.email.toLowerCase().endsWith('.edu')) {
        throw new Error('Only .edu email addresses are accepted. Please use your educational institution email.')
      }

      // Basic form validation
      if (!registrationForm.name.trim() || !registrationForm.email.trim() || !registrationForm.phone.trim()) {
        throw new Error('Please fill in all required fields')
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(registrationForm.email)) {
        throw new Error('Please enter a valid email address')
      }

      if (!selectedWebinar?.id) {
        throw new Error('No webinar selected for registration')
      }

      const registrationData: WebinarRegistrationData = {
        webinarId: selectedWebinar.id,
        name: registrationForm.name,
        email: registrationForm.email,
        phone: registrationForm.phone,
        currentEducation: registrationForm.currentEducation,
        interests: registrationForm.interests,
        experience: registrationForm.experience
      }

      const data = await registerForWebinar(registrationData)

      if (!data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.')
      }

      // Show success state
      setRegistrationSuccess(true)
      
      // Auto-close after 4 seconds
      setTimeout(() => {
        setSelectedWebinar(null)
        setShowRegistrationForm(false)
        setRegistrationSuccess(false)
        setRegistrationForm({
          name: "",
          email: "",
          phone: "",
          currentEducation: "",
          interests: "",
          experience: "student"
        })
      }, 4000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowRegistrationForm = (webinar: Webinar, isPast: boolean = false) => {
    setSelectedWebinar(webinar)
    if (isPast) {
      // For past webinars, just show watch recording alert for now
      alert(`Access recording for "${webinar.title}" - Feature coming soon!`)
    } else {
      setShowRegistrationForm(true)
      setError(null) // Clear any previous errors
      setRegistrationSuccess(false) // Reset success state
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setRegistrationForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  const renderWebinarCard = (webinar: Webinar, isLive = false, isPast = false) => (
    <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-gray-200 overflow-hidden">
      {/* Poster Section */}
      {webinar.poster && (
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={webinar.poster} 
            alt={`${webinar.title} Poster`}
            className="w-full h-50 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              // Fallback if image doesn't load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <CardHeader className="pb-4 relative">
        {/* Card background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#384633] rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-[#384633] rounded-full translate-y-6 -translate-x-6 opacity-20"></div>
        </div>
        
        <div className="relative z-10">
          {/* Status badges */}
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="secondary" 
              className={`
                ${isLive 
                  ? "bg-red-100 text-red-700 border-red-200 animate-pulse" 
                  : isPast 
                    ? "bg-gray-100 text-gray-700 border-gray-200"
                    : "bg-[#384633]/10 text-[#384633] border-[#384633]/20"
                }
              `}
            >
              {isLive ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
                  Live Now
                </>
              ) : isPast ? (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Recorded
                </>
              ) : (
                <>
                  <Calendar className="w-3 h-3 mr-1" />
                  Upcoming
                </>
              )}
            </Badge>
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
              {webinar.category}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#384633] transition-colors duration-300 line-clamp-2 mb-3">
            {webinar.title}
          </CardTitle>
          
          <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {webinar.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        {/* Presenter info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
          <Avatar className="h-12 w-12 ring-2 ring-[#384633]/20">
            <AvatarImage src={webinar.presenter.image} alt={webinar.presenter.name} />
            <AvatarFallback className="text-sm bg-gradient-to-br from-[#384633] to-[#2d3a2a] text-white">
              {webinar.presenter.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm">{webinar.presenter.name}</div>
            <div className="text-xs text-gray-600">{webinar.presenter.title}</div>
          </div>
        </div>

        {/* Session details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#384633]/10 rounded-lg flex items-center justify-center">
                {isLive ? <Video className="h-4 w-4 text-red-600" /> : <Calendar className="h-4 w-4 text-[#384633]" />}
              </div>
              <span className="font-medium text-gray-700">
                {isLive ? "Live Now" : isPast ? `Recorded ${webinar.date}` : webinar.date ? new Date(webinar.date).toLocaleDateString() : 'TBD'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#384633]/10 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-[#384633]" />
              </div>
              <span className="font-medium text-gray-700">
                {isLive ? webinar.startTime : isPast ? webinar.duration : webinar.time}
              </span>
            </div>
          </div>
          

          {!isPast && (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#384633]/10 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-[#384633]" />
                </div>
                <span className="font-medium text-gray-700">
                  {webinar.duration}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Topics preview */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            Key Topics:
          </div>
          <div className="flex flex-wrap gap-1">
            {webinar.topics.slice(0, 3).map((topic: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                {topic}
              </Badge>
            ))}
            {webinar.topics.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{webinar.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Additional info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            {webinar.language}
          </span>
          <span className="flex items-center">
            <GraduationCap className="h-3 w-3 mr-1" />
            {webinar.level}
          </span>
        </div>

        <Button 
          className={`w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
            isLive 
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" 
              : isPast 
                ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                : "bg-gradient-to-r from-[#384633] to-[#2d3a2a] hover:from-[#2d3a2a] hover:to-[#384633]"
          } text-white`}
          onClick={() => handleShowRegistrationForm(webinar, isPast)}
          disabled={false}
        >
          {isLive ? (
            <>Join Live Session</>
          ) : isPast ? (
            <>Watch Recording</>
          ) : (
            <>Register Free</>
          )}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#384633]/10 via-white to-[#2d3a2a]/10">
      {/* Hero Section */}
              <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#384633]/15 via-[#2d3a2a]/10 to-[#384633]/15" />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#384633]/25 to-[#2d3a2a]/15 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#2d3a2a]/20 to-[#384633]/10 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-[#384633]/10 text-[#384633] border-[#384633]/20 text-xs sm:text-sm">
              <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Live Learning
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Educational 
              <span className="text-[#384633] block sm:inline"> Webinars & Workshops</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              Join live and recorded educational sessions with expert educators, admissions consultants, and successful alumni to accelerate your academic journey.
            </p>
          </div>
        </div>
      </section>

      

      {/* Enhanced Webinars with Tabs */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#384633]/10 via-white to-[#2d3a2a]/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-gradient-to-br from-[#384633]/25 to-[#2d3a2a]/15 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-16 w-64 h-64 bg-gradient-to-br from-[#2d3a2a]/20 to-[#384633]/10 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Upcoming Webinars
              </TabsTrigger>
              <TabsTrigger value="live" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white">
                Live Now
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white">
                Past Webinars
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-8">
              {webinarsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-2xl h-96"></div>
                    </div>
                  ))}
                </div>
              ) : webinarsError ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">Failed to Load Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">{webinarsError}</p>
                  <Button onClick={fetchWebinars} className="bg-purple-600 hover:bg-purple-700">
                    Try Again
                  </Button>
                </div>
              ) : upcomingWebinars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {upcomingWebinars.map((webinar) => renderWebinarCard(webinar, false, false))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Upcoming Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">No webinars are currently scheduled. Check back soon for new sessions!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="live" className="mt-8">
              {webinarsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-2xl h-96"></div>
                    </div>
                  ))}
                </div>
              ) : webinarsError ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">Failed to Load Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">{webinarsError}</p>
                  <Button onClick={fetchWebinars} className="bg-purple-600 hover:bg-purple-700">
                    Try Again
                  </Button>
                </div>
              ) : liveWebinars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {liveWebinars.map((webinar) => renderWebinarCard(webinar, true, false))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Live Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">No webinars are currently live. Check our upcoming sessions or browse past recordings.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-8">
              {webinarsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-2xl h-96"></div>
                    </div>
                  ))}
                </div>
              ) : webinarsError ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">Failed to Load Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">{webinarsError}</p>
                  <Button onClick={fetchWebinars} className="bg-purple-600 hover:bg-purple-700">
                    Try Again
                  </Button>
                </div>
              ) : pastWebinars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {pastWebinars.map((webinar) => renderWebinarCard(webinar, false, true))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Past Webinars</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">No recorded webinars available yet. Check back after attending some live sessions!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Hear from the Best
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Access world-class educational content and expert guidance through our comprehensive webinar series
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* Enhanced stat cards */}
            <div className="group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-purple-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-purple-500 to-purple-600">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">25,000+</div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">Students Attended</div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Students from over 50 countries have joined our webinars</p>
              </div>
            </div>

            <div className="group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-blue-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-blue-500 to-blue-600">
                  <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">150+</div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">Expert Sessions</div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Comprehensive coverage of all educational topics and stages</p>
              </div>
            </div>

            <div className="group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-green-500 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-green-500 to-green-600">
                  <Star className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">Average Rating</div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Consistently high-rated sessions by our student community</p>
              </div>
            </div>
          </div>
          
          {/* Additional Context */}
          <div className="text-center">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-4">
              <span className="block sm:inline">📚 Expert-led sessions</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🎯 Practical strategies</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🎥 Interactive learning</span>
            </p>
          </div>
        </div>
      </section>

      {/* Custom Registration Form Overlay */}
      {showRegistrationForm && selectedWebinar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 pt-24" onClick={() => !isLoading && setShowRegistrationForm(false)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 lg:p-6">
              {/* Success State */}
              {registrationSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful! 🎉</h2>
                  <p className="text-gray-600 mb-4">
                    You&apos;re all set for &ldquo;{selectedWebinar.title}&rdquo;
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                    <p><strong>What&apos;s next?</strong></p>
                    <ul className="mt-2 space-y-1 text-left">
                      <li>• Check your email for confirmation details</li>
                      <li>• Add the webinar to your calendar</li>
                      <li>• We&apos;ll send you a reminder 24 hours before</li>
                      <li>• Join link will be sent 30 minutes before start time</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="relative mb-6">
                    <button
                      onClick={() => !isLoading && setShowRegistrationForm(false)}
                      disabled={isLoading}
                      className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="sr-only">Close</span>
                    </button>
                    
                    <div className="pr-12">
                      <h2 className="text-2xl font-bold text-gray-900">Register for &ldquo;{selectedWebinar.title}&rdquo;</h2>
                      <p className="text-gray-600 mt-1">
                        Fill out the form below to register for this free webinar. <span className="text-purple-600 font-medium">Only .edu emails accepted.</span>
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

              <form onSubmit={handleRegistration} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registrationForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@university.edu"
                        value={registrationForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                      id="phone"
                      placeholder="Enter phone number"
                      value={registrationForm.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Educational Background Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Educational Background</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="education" className="text-sm font-semibold text-gray-700">
                      Educational Status <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="education"
                      placeholder="e.g., High School Senior, University Student..."
                      value={registrationForm.currentEducation}
                      onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-sm font-semibold text-gray-700">
                      Learning Goals & Questions <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="What do you hope to learn from this webinar? Any specific questions?"
                      value={registrationForm.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 transition-colors min-h-[100px]"
                      rows={4}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Session Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Session Details</h3>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200 space-y-3">
                    <div className="flex items-center text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">
                        📅 {selectedWebinar.date ? new Date(selectedWebinar.date).toLocaleDateString() : 'TBD'} at {selectedWebinar.time || 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">⏱️ Duration: {selectedWebinar.duration}</span>
                    </div>
                    <div className="flex items-center text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">👨‍🏫 Presenter: {selectedWebinar.presenter.name}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </div>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </form>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 