"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhoneInput } from "@/components/ui/phone-input"
import { Heart, Users, Award, Search, SlidersHorizontal, X, Globe, Loader2, Home, Handshake, Building2, Briefcase } from "lucide-react"

// Import API functions
import { 
  getMentors, 
  getFilterOptions, 
  submitMentorApplication,
  type Mentor,
  type MentorApplicationData,
  type FilterOptionsResponse 
} from "@/lib/api"

// Convert API Mentor type to component-compatible format
function formatMentorForComponent(mentor: Mentor) {
  return {
    id: mentor.id,
    name: mentor.full_name,
    specialty: mentor.specialty,
    university: mentor.university,
    degree: mentor.degree,
    location: mentor.location,
    languages: mentor.languages,
    bio: mentor.bio,
    image: mentor.profile_image_url,
    social: mentor.social_links
  }
}

export default function VolunteersPage() {
  // API data state
  const [mentors, setMentors] = useState<ReturnType<typeof formatMentorForComponent>[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse['data'] | null>(null)
  const [, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submittingApplication, setSubmittingApplication] = useState(false)

  // Filter state
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedUniversity, setSelectedUniversity] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // UI state
  const [showMentorApplicationForm, setShowMentorApplicationForm] = useState(false)
  const [expandedBios, setExpandedBios] = useState<{[key: number]: boolean}>({})
  
  // Carousel state for continuous scrolling
  const [scrollOffset, setScrollOffset] = useState(0)
  
  // Carousel items combining stats and value propositions
  const carouselItems = [
    // Stats Cards
    {
      id: 'peer-mentors',
      icon: Users,
      number: `50+`,
      title: 'Peer Mentors',
      description: 'Students who have been through the same journey and can help you navigate easily',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'free-community',
      icon: Heart,
      number: '100%',
      title: 'Free Community',
      description: 'All WhatsApp groups and mentorship are completely free for students',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'universities',
      icon: Globe,
      number: `${filterOptions?.universities?.length || 50}+`,
      title: 'Universities',
      description: 'Top universities worldwide represented in our mentor network',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    // Value Proposition Cards
    {
      id: 'pre-arrival',
      icon: Home,
      title: 'Pre-Arrival Guidance',
      description: 'Housing tips, what to pack, visa processes, and how to prepare for your new country before you even arrive.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'social-integration',
      icon: Handshake,
      title: 'Social & Cultural Integration',
      description: 'Making friends, understanding local culture, adjusting to a new city, and building your social network.',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'campus-life',
      icon: Building2,
      title: 'Campus Life Advice',
      description: 'Choosing classes, using campus resources, joining clubs, and navigating university systems like a pro.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      id: 'career-planning',
      icon: Briefcase,
      title: 'Career & Academic Planning',
      description: 'Early internship planning, networking tips, building your resume, and setting yourself up for success.',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    }
  ]
  
  // Continuous auto-scroll carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollOffset((prev) => prev + 0.5) // Smooth continuous movement
    }, 20) // Update every 20ms for smooth animation
    
    return () => clearInterval(interval)
  }, [])

  // Application form state
  const [mentorApplicationForm, setMentorApplicationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentUniversity: "",
    degree: "",
    graduationYear: "",
    specialization: "",
    experienceYears: "",
    languages: "",
    motivation: "",
    availability: "",
    linkedinUrl: "",
    sampleAdvice: ""
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [mentorsResponse, filterOptionsResponse] = await Promise.all([
          getMentors({ limit: 50 }), // Get all mentors
          getFilterOptions()
        ])

        if (mentorsResponse.success) {
          const formattedMentors = mentorsResponse.data.mentors.map(formatMentorForComponent)
          setMentors(formattedMentors)
        }

        if (filterOptionsResponse.success) {
          setFilterOptions(filterOptionsResponse.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Toggle bio expansion
  const toggleBio = (mentorId: number) => {
    setExpandedBios(prev => ({
      ...prev,
      [mentorId]: !prev[mentorId]
    }))
  }

  // Get filter options from API data or fallback to hardcoded
  const specialties = filterOptions?.specialties ? ["all", ...filterOptions.specialties] : ["all", "Current Student", "Recent Graduate", "Peer Mentor"]
  
  // Extract unique options from current mentors data
  const allLanguages = useMemo(() => {
    if (filterOptions?.languages) {
      return ["all", ...filterOptions.languages]
    }
    const languages = new Set<string>()
    mentors.forEach(mentor => {
      mentor.languages.forEach((lang: string) => languages.add(lang))
    })
    return ["all", ...Array.from(languages).sort()]
  }, [mentors, filterOptions])

  const allLocations = useMemo(() => {
    if (filterOptions?.locations) {
      return ["all", ...filterOptions.locations]
    }
    const locations = new Set(mentors.map(v => v.location))
    return ["all", ...Array.from(locations).sort()]
  }, [mentors, filterOptions])

  const allUniversities = useMemo(() => {
    if (filterOptions?.universities) {
      return ["all", ...filterOptions.universities]
    }
    const universities = new Set(mentors.map(v => v.university))
    return ["all", ...Array.from(universities).sort()]
  }, [mentors, filterOptions])

  // Enhanced filtering and sorting logic
  const filteredAndSortedMentors = useMemo(() => {
    const filtered = mentors.filter(mentor => {
      // Search by name, specialty, bio, or university
      const matchesSearch = searchQuery === "" || 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.university.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by specialty
      const matchesSpecialty = selectedSpecialty === "all" || mentor.specialty === selectedSpecialty

      // Filter by language
      const matchesLanguage = selectedLanguage === "all" || mentor.languages.includes(selectedLanguage)

      // Filter by location
      const matchesLocation = selectedLocation === "all" || mentor.location === selectedLocation

      // Filter by university
      const matchesUniversity = selectedUniversity === "all" || mentor.university === selectedUniversity

      return matchesSearch && matchesSpecialty && matchesLanguage && matchesLocation && matchesUniversity
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "specialty":
          return a.specialty.localeCompare(b.specialty)
        case "university":
          return a.university.localeCompare(b.university)
        default:
          return 0
      }
    })

    return filtered
  }, [mentors, searchQuery, selectedSpecialty, selectedLanguage, selectedLocation, selectedUniversity, sortBy])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedSpecialty("all")
    setSelectedLanguage("all")
    setSelectedLocation("all")
    setSelectedUniversity("all")
    setSortBy("name")
  }

  const hasActiveFilters = searchQuery !== "" || selectedSpecialty !== "all" || 
    selectedLanguage !== "all" || selectedLocation !== "all" || selectedUniversity !== "all" || sortBy !== "name"

  const handleMentorApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmittingApplication(true)
      
      const applicationData: MentorApplicationData = {
        fullName: mentorApplicationForm.fullName,
        email: mentorApplicationForm.email,
        phone: mentorApplicationForm.phone,
        currentUniversity: mentorApplicationForm.currentUniversity,
        degree: mentorApplicationForm.degree,
        graduationYear: mentorApplicationForm.graduationYear,
        specialization: mentorApplicationForm.specialization,
        experienceYears: mentorApplicationForm.experienceYears,
        languages: mentorApplicationForm.languages,
        linkedinUrl: mentorApplicationForm.linkedinUrl,
        motivation: mentorApplicationForm.motivation,
        availability: mentorApplicationForm.availability,
        sampleAdvice: mentorApplicationForm.sampleAdvice
      }

      const response = await submitMentorApplication(applicationData)
      
      if (response.success) {
        alert(`Thank you ${mentorApplicationForm.fullName}! Your mentor application has been submitted successfully. Our team will review your application and contact you within 3-5 business days.`)
        
        // Reset form and close modal
        setMentorApplicationForm({
          fullName: "",
          email: "",
          phone: "",
          currentUniversity: "",
          degree: "",
          graduationYear: "",
          specialization: "",
          experienceYears: "",
          languages: "",
          motivation: "",
          availability: "",
          linkedinUrl: "",
          sampleAdvice: ""
        })
        setShowMentorApplicationForm(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      alert(`Error: ${errorMessage}. Please try again.`)
    } finally {
      setSubmittingApplication(false)
    }
  }

  

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Mentors</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-100 to-orange-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Peer Support
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Meet Your 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Peer Mentors & Guides</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              Current students and recent graduates who help you settle in socially, culturally, and academically before you even arrive. Get practical guidance on housing, visas, and building community in your new home.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => {
                  const mentorsSection = document.querySelector('[data-section="mentors-grid"]')
                  mentorsSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Find Your Mentor
                <Users className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={() => {
                  const becomeSection = document.querySelector('[data-section="become-mentor"]')
                  becomeSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Become a Mentor
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Carousel - Stats & Value Proposition */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-green-200 to-orange-200 rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <Badge className="mb-4 sm:mb-6 bg-purple-100 text-purple-700 border-purple-200 text-xs sm:text-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Our Community & What Mentors Do
            </Badge>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Global Community
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Connect with peer mentors from top universities worldwide who provide hands-on support for your international student journey.
            </p>
          </div>
          
          {/* Continuous Scrolling Carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex"
              style={{
                transform: `translateX(-${(scrollOffset * 2) % (carouselItems.length * 280)}px)`,
                width: `${carouselItems.length * 3 * 280}px` // Triple the items for seamless looping
              }}
            >
              {/* Render items 3 times for seamless infinite scroll */}
              {Array.from({ length: 3 }, (_, repeatIndex) => 
                carouselItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div 
                      key={`${item.id}-${repeatIndex}-${index}`}
                      className="flex-shrink-0 px-2"
                      style={{ width: '280px' }} // Fixed smaller width
                    >
                      <div className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden bg-gradient-to-br ${item.bgGradient} border ${item.borderColor} h-48`}>
                        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-full -translate-y-8 translate-x-8 opacity-30`}></div>
                        </div>
                        <div className="relative z-10 text-center h-full flex flex-col justify-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 mx-auto transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${item.gradient}`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          {item.number && (
                            <div className="text-xl font-bold text-gray-900 mb-1">{item.number}</div>
                          )}
                          <div className={`${item.number ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>{item.title}</div>
                          <p className="text-xs text-gray-600 leading-relaxed px-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ).flat()}
            </div>
          </div>
          
          
          
          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              <span className="font-semibold">Ready to get started?</span> Find mentors who&apos;ve navigated the exact same journey at your university.
            </p>
            <Button 
              onClick={() => {
                const mentorsSection = document.querySelector('[data-section="mentors-grid"]')
                mentorsSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Mentors
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filters */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-blue-50 border-y border-gray-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-br from-green-200 to-orange-200 rounded-full opacity-10 blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search mentors by name, identity, university, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
          </div>

          {/* Filter Toggle and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-600">
                  {filteredAndSortedMentors.length} mentor{filteredAndSortedMentors.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm font-medium">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/90 backdrop-blur-sm border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="specialty">Identity</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {/* Identity Filter */}
                <div>
                  <Label htmlFor="specialty" className="text-sm font-medium mb-2 block">Identity</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="All Identities" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty === "all" ? "All Identities" : specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Filter */}
                <div>
                  <Label htmlFor="language" className="text-sm font-medium mb-2 block">Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLanguages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language === "all" ? "All Languages" : language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* University Filter */}
                <div>
                  <Label htmlFor="university" className="text-sm font-medium mb-2 block">University</Label>
                  <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="All Universities" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUniversities.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university === "all" ? "All Universities" : university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: &ldquo;{searchQuery}&rdquo;
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                      </Badge>
                    )}
                    {selectedSpecialty !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedSpecialty}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSpecialty("all")} />
                      </Badge>
                    )}
                    {selectedLanguage !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedLanguage}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLanguage("all")} />
                      </Badge>
                    )}
                    {selectedLocation !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedLocation}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation("all")} />
                      </Badge>
                    )}
                    {selectedUniversity !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedUniversity}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedUniversity("all")} />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Mentors Grid */}
      <section data-section="mentors-grid" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-16 w-64 h-64 bg-gradient-to-br from-green-200 to-orange-200 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {filteredAndSortedMentors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No mentors found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Try adjusting your search criteria or filters to find the perfect mentor for your needs.</p>
              <Button onClick={clearAllFilters} variant="outline" className="bg-white border-gray-300 hover:bg-gray-50">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredAndSortedMentors.map((mentor) => (
                <Card key={mentor.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-gray-200 overflow-hidden">
                  <CardHeader className="pb-4 relative">
                    {/* Card background pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-500 rounded-full translate-y-6 -translate-x-6 opacity-20"></div>
                    </div>
                    
                    <div className="flex items-start space-x-4 relative z-10">
                      <Avatar className="h-16 w-16 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                        <AvatarImage src={mentor.image} alt={mentor.name} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{mentor.name}</CardTitle>
                        <CardDescription className="text-sm">
                          <Badge 
                            variant="secondary" 
                            className={`mb-2 ${
                              mentor.specialty === 'International Student' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : mentor.specialty === 'Alumni' 
                                  ? 'bg-purple-100 text-purple-700 border-purple-200'
                                  : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {mentor.specialty}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">{mentor.university}</div>
                            <div className="text-xs">{mentor.degree}</div>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 relative">
                    <div>
                      <p className={`text-sm text-gray-600 leading-relaxed ${expandedBios[mentor.id] ? '' : 'line-clamp-3'}`}>
                        {mentor.bio}
                      </p>
                      {mentor.bio.length > 150 && (
                        <button
                          onClick={() => toggleBio(mentor.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 transition-colors duration-200"
                        >
                          {expandedBios[mentor.id] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Languages: {mentor.languages.join(", ")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">{mentor.location}</span>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-700">Connect on Social Media:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-pink-600 text-xs">📷</span>
                          </div>
                          <a 
                            href={`https://instagram.com/${mentor.social.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline transition-colors duration-200"
                            style={{ color: '#84289e' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#6a1f7a'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#84289e'}
                          >
                            {mentor.social.instagram}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-xs">💼</span>
                          </div>
                          <a 
                            href={mentor.social.linkedin.startsWith('http') ? mentor.social.linkedin : `https://${mentor.social.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline transition-colors duration-200 text-xs break-all"
                            style={{ color: '#1e5287' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#144066'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#1e5287'}
                          >
                            {mentor.social.linkedin}
                          </a>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                      onClick={() => window.open('/whatsapp-groups', '_self')}
                    >
                      💬 Find on WhatsApp Groups
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Become a Mentor Section */}
          <div data-section="become-mentor" className="mt-16 text-center">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Become a Mentor
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Share your experience as a current student or recent graduate to help incoming international students navigate their journey. 
                    Join our community of peer mentors making a real difference through authentic, relatable guidance.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Share Your Experience</h4>
                    <p className="text-sm text-gray-600">Help with housing, visas, cultural adaptation, and settling into university life</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Make an Impact</h4>
                    <p className="text-sm text-gray-600">Be part of life-changing moments by helping fellow students feel at home</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Global Community</h4>
                    <p className="text-sm text-gray-600">Connect with fellow students and graduates from around the world</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowMentorApplicationForm(true)}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Apply to Become a Mentor
                  <Users className="ml-2 h-5 w-5" />
                </Button>

                {showMentorApplicationForm && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 pt-20" onClick={() => setShowMentorApplicationForm(false)}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 lg:p-6">
                        {/* Header */}
                        <div className="relative mb-6">
                          <button
                            onClick={() => setShowMentorApplicationForm(false)}
                            className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </button>
                          
                          <div className="pr-12">
                            <h2 className="text-2xl font-bold text-gray-900">Peer Mentor Application</h2>
                            <p className="text-gray-600 mt-1">
                              Join our community of student guides and help incoming international students navigate their journey with confidence.
                            </p>
                          </div>
                        </div>
                    
                    <form onSubmit={handleMentorApplication} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={mentorApplicationForm.fullName}
                              onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, fullName: e.target.value})}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={mentorApplicationForm.email}
                              onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, email: e.target.value})}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                          <PhoneInput
                            id="phone"
                            value={mentorApplicationForm.phone}
                            onChange={(value) => setMentorApplicationForm({...mentorApplicationForm, phone: value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>

                      {/* Educational Background */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Educational Background</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currentUniversity" className="text-sm font-medium text-gray-700">Current/Most Recent University *</Label>
                            <Input
                              id="currentUniversity"
                              value={mentorApplicationForm.currentUniversity}
                              onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, currentUniversity: e.target.value})}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Harvard University"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="degree" className="text-sm font-medium text-gray-700">Degree/Field of Study *</Label>
                            <Input
                              id="degree"
                              value={mentorApplicationForm.degree}
                              onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, degree: e.target.value})}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Computer Science, MBA, etc."
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="graduationYear" className="text-sm font-medium text-gray-700">Graduation Year *</Label>
                          <Input
                            id="graduationYear"
                            value={mentorApplicationForm.graduationYear}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, graduationYear: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="2023"
                            required
                          />
                        </div>
                      </div>

                      {/* Mentoring Details */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Mentoring Information</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">Area of Expertise *</Label>
                            <Select 
                              value={mentorApplicationForm.specialization} 
                              onValueChange={(value) => setMentorApplicationForm({...mentorApplicationForm, specialization: value})}
                            >
                              <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select your expertise" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Graduate School Applications">Graduate School Applications</SelectItem>
                                <SelectItem value="Medical School Prep">Medical School Prep</SelectItem>
                                <SelectItem value="Engineering Programs">Engineering Programs</SelectItem>
                                <SelectItem value="Business School">Business School</SelectItem>
                                <SelectItem value="Law School Prep">Law School Prep</SelectItem>
                                <SelectItem value="International Students">International Students</SelectItem>
                                <SelectItem value="Undergraduate Applications">Undergraduate Applications</SelectItem>
                                <SelectItem value="Test Preparation">Test Preparation (IELTS/TOEFL/SAT)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="experienceYears" className="text-sm font-medium text-gray-700">Years of Experience *</Label>
                            <Input
                              id="experienceYears"
                              value={mentorApplicationForm.experienceYears}
                              onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, experienceYears: e.target.value})}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="5"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="languages" className="text-sm font-medium text-gray-700">Languages Spoken *</Label>
                          <Input
                            id="languages"
                            value={mentorApplicationForm.languages}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, languages: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="English, Spanish, French"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">LinkedIn Profile (Optional)</Label>
                          <Input
                            id="linkedinUrl"
                            value={mentorApplicationForm.linkedinUrl}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, linkedinUrl: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="https://linkedin.com/in/yourname"
                          />
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Application Questions</h4>
                        
                        <div>
                          <Label htmlFor="motivation" className="text-sm font-medium text-gray-700">Why do you want to become a mentor? *</Label>
                          <Textarea
                            id="motivation"
                            value={mentorApplicationForm.motivation}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, motivation: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Share your motivation for mentoring students..."
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="availability" className="text-sm font-medium text-gray-700">General Availability *</Label>
                          <Textarea
                            id="availability"
                            value={mentorApplicationForm.availability}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, availability: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="e.g., Weekday evenings, Weekend afternoons, Flexible schedule..."
                            rows={2}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="sampleAdvice" className="text-sm font-medium text-gray-700">Sample Mentoring Scenario *</Label>
                          <Textarea
                            id="sampleAdvice"
                            value={mentorApplicationForm.sampleAdvice}
                            onChange={(e) => setMentorApplicationForm({...mentorApplicationForm, sampleAdvice: e.target.value})}
                            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="A student asks: 'I'm unsure about which universities to apply to for my Computer Science degree. How would you help them?'"
                            rows={4}
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Our team will review your application within 3-5 business days</li>
                          <li>• If approved, you&apos;ll receive mentor onboarding materials</li>
                          <li>• Complete a brief training session</li>
                          <li>• Start helping students achieve their dreams!</li>
                        </ul>
                      </div>

                        <Button 
                          type="submit" 
                          disabled={submittingApplication}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          {submittingApplication ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting Application...
                            </>
                          ) : (
                            'Submit Mentor Application'
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 