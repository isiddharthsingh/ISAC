"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Star, Quote, TrendingUp, Users, Award, Globe, GraduationCap, Heart, Sparkles, BookOpen, Trophy, Target } from "lucide-react"

const studentTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 22,
    location: "Toronto, Canada",
    image: "/api/placeholder/150/150",
    category: "Medical School",
    goal: "Acceptance to Johns Hopkins Medical School",
    outcome: "Successfully admitted with scholarship",
    mentor: "Dr. Patricia Williams",
    rating: 5,
    quote: "The guidance I received was transformative. From MCAT preparation to personal statement writing, every step was carefully planned. I couldn't have achieved my dream of attending Johns Hopkins without this incredible support system.",
    duration: "8 months",
    background: "Biology undergraduate from University of Toronto",
    beforeScore: "MCAT: 510",
    afterScore: "MCAT: 518",
    challenges: ["Competitive applicant pool", "Personal statement struggles", "Interview preparation"],
    keyHelp: ["One-on-one MCAT tutoring", "Personal statement workshops", "Mock interview sessions"]
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 24,
    location: "Atlanta, USA",
    image: "/api/placeholder/150/150",
    category: "MBA Program",
    goal: "Admission to Wharton MBA Program",
    outcome: "Admitted with 40% scholarship",
    mentor: "Prof. David Rodriguez",
    rating: 5,
    quote: "The mentoring program helped me identify my unique story and present it compellingly. The GMAT preparation and application strategy were game-changers. Wharton was my dream school, and now it's my reality.",
    duration: "12 months",
    background: "Engineering professional with 3 years experience",
    beforeScore: "GMAT: 680",
    afterScore: "GMAT: 750",
    challenges: ["Career transition story", "Low initial GMAT score", "Leadership experience articulation"],
    keyHelp: ["Career coaching sessions", "GMAT intensive program", "Leadership development guidance"]
  },
  {
    id: 3,
    name: "Priya Patel",
    age: 20,
    location: "Mumbai, India",
    image: "/api/placeholder/150/150",
    category: "Engineering",
    goal: "PhD in Computer Science at MIT",
    outcome: "Full funding PhD position secured",
    mentor: "Dr. Jennifer Liu",
    rating: 5,
    quote: "Coming from India, I wasn't sure how to navigate the US graduate school system. My mentor helped me understand the research culture, craft compelling applications, and connect with potential advisors. MIT here I come!",
    duration: "10 months",
    background: "Computer Science undergraduate, IIT Delhi",
    beforeScore: "GRE: 315",
    afterScore: "GRE: 335",
    challenges: ["International student requirements", "Research experience gap", "Statement of purpose"],
    keyHelp: ["GRE preparation", "Research opportunity connections", "Academic writing workshops"]
  },
  {
    id: 4,
    name: "Emma Thompson",
    age: 21,
    location: "London, UK",
    image: "/api/placeholder/150/150",
    category: "Law School",
    goal: "Admission to Harvard Law School",
    outcome: "Admitted to Harvard and Yale Law",
    mentor: "Prof. Michael Chang",
    rating: 5,
    quote: "The comprehensive support I received was extraordinary. From LSAT strategy to personal statement crafting, every aspect was covered. Having choices between Harvard and Yale Law is beyond what I ever imagined possible.",
    duration: "9 months",
    background: "Philosophy undergraduate, Oxford University",
    beforeScore: "LSAT: 162",
    afterScore: "LSAT: 175",
    challenges: ["LSAT score improvement", "US law school differences", "Financial aid applications"],
    keyHelp: ["LSAT tutoring program", "Law school information sessions", "Financial aid guidance"]
  },
  {
    id: 5,
    name: "Ahmed Al-Rashid",
    age: 23,
    location: "Dubai, UAE",
    image: "/api/placeholder/150/150",
    category: "Business School",
    goal: "Master's in International Business",
    outcome: "INSEAD MBA with Dean's List recognition",
    mentor: "Dr. Lisa Anderson",
    rating: 5,
    quote: "As someone from the Middle East, I needed guidance on global business schools. The mentorship helped me craft applications that highlighted my unique background and career goals. INSEAD was the perfect fit.",
    duration: "7 months",
    background: "Economics graduate, American University of Dubai",
    beforeScore: "GMAT: 650",
    afterScore: "GMAT: 720",
    challenges: ["Cultural adaptation concerns", "International experience articulation", "School selection"],
    keyHelp: ["Cultural mentoring", "Application strategy sessions", "School selection guidance"]
  },
  {
    id: 6,
    name: "Sofia Gonzalez",
    age: 19,
    location: "Mexico City, Mexico",
    image: "/api/placeholder/150/150",
    category: "Undergraduate",
    goal: "Ivy League undergraduate admission",
    outcome: "Princeton University with full scholarship",
    mentor: "Prof. Robert Kim",
    rating: 5,
    quote: "Starting the application process felt overwhelming, but my mentor broke everything down into manageable steps. The essay writing workshops and interview preparation were invaluable. Princeton was my reach school that became reality.",
    duration: "6 months",
    background: "International Baccalaureate student",
    beforeScore: "SAT: 1420",
    afterScore: "SAT: 1560",
    challenges: ["SAT score improvement", "Extracurricular presentation", "Financial aid applications"],
    keyHelp: ["SAT preparation", "Essay writing workshops", "Scholarship application guidance"]
  }
]

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof studentTestimonials[0] | null>(null)

  const categories = ["all", "Medical School", "MBA Program", "Engineering", "Law School", "Business School", "Undergraduate"]

  const filteredTestimonials = selectedCategory === "all" 
    ? studentTestimonials 
    : studentTestimonials.filter(testimonial => testimonial.category === selectedCategory)

  const stats = [
    { 
      icon: Users, 
      number: "25,000+", 
      label: "Students Helped",
      description: "Successful students across all academic disciplines",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    { 
      icon: Trophy, 
      number: "92%", 
      label: "Success Rate",
      description: "Students achieve their target academic goals",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100", 
      borderColor: "border-green-200"
    },
    { 
      icon: GraduationCap, 
      number: "50+", 
      label: "Top Universities",
      description: "Admissions secured at world's best institutions",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    },
    { 
      icon: Award, 
      number: "4.9/5", 
      label: "Student Rating",
      description: "Consistently rated excellent by our students",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
              <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-blue-600/10 to-purple-600/10" />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-700 border-green-200 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Success Stories
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Student 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block sm:inline"> Success Stories</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              Discover how our personalized mentoring and guidance have helped thousands of students achieve their academic dreams and secure admission to top institutions worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
              </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Proven Track Record of Success
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our commitment to student success is reflected in these impressive outcomes across all academic disciplines
            </p>
            </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor}`}>
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-current rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16 opacity-30"></div>
              </div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{stat.description}</p>
            </div>
              </div>
            ))}
            </div>
          
          {/* Additional Context */}
          <div className="text-center">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-4">
              <span className="block sm:inline">🎯 Personalized approach</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🌟 Proven strategies</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">🚀 Life-changing results</span>
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Category Filter */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-green-50 border-y border-gray-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-2xl"></div>
        </div>
            
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Explore Success by Category</h2>
            <p className="text-gray-600 text-sm sm:text-base">Filter success stories by academic field to find inspiration relevant to your goals</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                  {categories.map((category) => (
              <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                }`}
                    >
                      {category === "all" ? "All Categories" : category}
              </button>
                  ))}
              </div>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Showing {filteredTestimonials.length} success stor{filteredTestimonials.length !== 1 ? 'ies' : 'y'} 
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
                            </div>
                          </div>
      </section>

      {/* Enhanced Testimonials Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-16 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
                        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-gray-200 overflow-hidden">
                <CardHeader className="pb-4 relative">
                  {/* Card background pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-500 rounded-full translate-y-6 -translate-x-6 opacity-20"></div>
                      </div>
                  
                  <div className="relative z-10">
                    {/* Quote icon and category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <Quote className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {testimonial.category}
                      </Badge>
                      </div>
                      
                    {/* Student info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16 ring-4 ring-green-100 group-hover:ring-green-200 transition-all duration-300">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-green-500 to-blue-500 text-white">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          <div className="text-gray-600">{testimonial.age} years old</div>
                          <div className="text-gray-500 flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {testimonial.location}
                          </div>
                        </CardDescription>
                      </div>
              </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">5.0</span>
                        </div>
                      </div>
                    </CardHeader>
                
                <CardContent className="space-y-4 relative">
                  {/* Achievement highlight */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">Achievement</span>
                    </div>
                    <p className="text-sm text-green-800 font-medium">{testimonial.outcome}</p>
                      </div>
                      
                  {/* Quote */}
                  <blockquote className="text-sm text-gray-600 leading-relaxed italic line-clamp-4 relative">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Key details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Goal</span>
                          </div>
                      <span className="text-gray-600 text-xs text-right flex-1 ml-2">{testimonial.goal}</span>
                        </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-700">Mentor</span>
                      </div>
                      <span className="text-gray-600 text-xs text-right flex-1 ml-2">{testimonial.mentor}</span>
              </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-700">Duration</span>
                      </div>
                      <span className="text-gray-600 text-xs text-right flex-1 ml-2">{testimonial.duration}</span>
                    </div>
                      </div>
                      
                  {/* Score improvement */}
                  {testimonial.beforeScore && testimonial.afterScore && (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">Before:</span> {testimonial.beforeScore}
                        </div>
                        <div className="text-blue-600 font-semibold flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="font-medium">After:</span> {testimonial.afterScore}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Read more button */}
                  <Button 
                    variant="outline" 
                    className="w-full bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 border-green-200 text-green-700 hover:text-green-800 font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={() => setSelectedTestimonial(testimonial)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Read Full Story
                  </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </div>
      </section>

      {/* Detailed testimonial modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 pt-24" onClick={() => setSelectedTestimonial(null)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 lg:p-6">
              {/* Header */}
              <div className="relative mb-6">
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
                
                <div className="pr-12">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 ring-4 ring-green-100">
                      <AvatarImage src={selectedTestimonial.image} alt={selectedTestimonial.name} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-green-500 to-blue-500 text-white">
                        {selectedTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTestimonial.name}</h2>
                      <p className="text-gray-600">{selectedTestimonial.location}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement banner */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border border-green-200 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-bold text-green-900">Success Story</span>
                </div>
                <p className="text-green-800 font-semibold text-lg">{selectedTestimonial.outcome}</p>
                <p className="text-green-700 text-sm mt-1">Goal: {selectedTestimonial.goal}</p>
              </div>

              {/* Full quote */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Quote className="h-5 w-5 mr-2 text-green-600" />
                  Student&apos;s Experience
                </h3>
                <blockquote className="text-gray-700 leading-relaxed italic text-base bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                  &ldquo;{selectedTestimonial.quote}&rdquo;
                </blockquote>
              </div>

              {/* Detailed info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                    Background & Journey
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Background:</span> {selectedTestimonial.background}</p>
                    <p><span className="font-medium">Mentored by:</span> {selectedTestimonial.mentor}</p>
                    <p><span className="font-medium">Program duration:</span> {selectedTestimonial.duration}</p>
                    <p><span className="font-medium">Category:</span> {selectedTestimonial.category}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    Score Improvement
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Before:</span>
                        <span className="font-medium text-gray-700">{selectedTestimonial.beforeScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">After:</span>
                        <span className="font-semibold text-blue-600">{selectedTestimonial.afterScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges and help */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Challenges</h4>
                  <ul className="space-y-2">
                    {selectedTestimonial.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">How We Helped</h4>
                  <ul className="space-y-2">
                    {selectedTestimonial.keyHelp.map((help, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {help}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 