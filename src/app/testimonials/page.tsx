"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Users, Award, Globe, GraduationCap, Heart, Plus, Send, BookOpen, School, Edit3 } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  age: number
  university: string
  program: string
  location: string
  review: string
  image?: string
}

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 22,
    university: "Johns Hopkins University",
    program: "Medical School",
    location: "Toronto, Canada",
    review: "The guidance I received was transformative. From preparation to application writing, every step was carefully planned. I couldn't have achieved my dream without this incredible support system.",
    image: "/api/placeholder/150/150"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 24,
    university: "Wharton Business School",
    program: "MBA Program",
    location: "Atlanta, USA",
    review: "The mentoring program helped me identify my unique story and present it compellingly. The application strategy was a game-changer for my admission to Wharton.",
    image: "/api/placeholder/150/150"
  },
  {
    id: 3,
    name: "Priya Patel",
    age: 20,
    university: "MIT",
    program: "PhD in Computer Science",
    location: "Mumbai, India",
    review: "Coming from India, I wasn't sure how to navigate the US graduate school system. My mentor helped me understand the research culture and craft compelling applications.",
    image: "/api/placeholder/150/150"
  },
  {
    id: 4,
    name: "Emma Thompson",
    age: 21,
    university: "Harvard Law School",
    program: "Law School",
    location: "London, UK",
    review: "The comprehensive support I received was extraordinary. From strategy to personal statement crafting, every aspect was covered. Having choices between Harvard and Yale Law is beyond what I imagined possible.",
    image: "/api/placeholder/150/150"
  },
  {
    id: 5,
    name: "Ahmed Al-Rashid",
    age: 23,
    university: "INSEAD",
    program: "MBA",
    location: "Dubai, UAE",
    review: "As someone from the Middle East, I needed guidance on global business schools. The mentorship helped me craft applications that highlighted my unique background and career goals.",
    image: "/api/placeholder/150/150"
  },
  {
    id: 6,
    name: "Sofia Gonzalez",
    age: 19,
    university: "Princeton University",
    program: "Undergraduate",
    location: "Mexico City, Mexico",
    review: "Starting the application process felt overwhelming, but my mentor broke everything down into manageable steps. The essay writing workshops and interview preparation were invaluable.",
    image: "/api/placeholder/150/150"
  }
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    university: "",
    program: "",
    location: "",
    review: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.age || !formData.university || !formData.program || !formData.location || !formData.review) {
      alert("Please fill in all fields")
      return
    }

    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: formData.name,
      age: parseInt(formData.age),
      university: formData.university,
      program: formData.program,
      location: formData.location,
      review: formData.review
    }

    setTestimonials([newTestimonial, ...testimonials])
    setFormData({
      name: "",
      age: "",
      university: "",
      program: "",
      location: "",
      review: ""
    })
    setShowForm(false)
  }

  const stats = [
    { 
      icon: Users, 
      number: "25,000+", 
      label: "Students Helped",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    { 
      icon: Award, 
      number: "92%", 
      label: "Success Rate",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100", 
      borderColor: "border-green-200"
    },
    { 
      icon: GraduationCap, 
      number: "50+", 
      label: "Top Universities",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-blue-600/10 to-purple-600/10" />
        
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

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
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
              Our commitment to student success is reflected in these impressive outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor}`}>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600">Real experiences from students who achieved their dreams</p>
          </div>
          
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {testimonials.map((testimonial) => (
               <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-gray-200 overflow-hidden">
                 <CardHeader className="pb-3">
                   <div className="flex items-center space-x-3">
                     <Avatar className="h-14 w-14 ring-2 ring-green-100">
                       <AvatarImage src={testimonial.image} alt={testimonial.name} />
                       <AvatarFallback className="text-base bg-gradient-to-br from-green-500 to-blue-500 text-white font-semibold">
                         {testimonial.name.split(' ').map(n => n[0]).join('')}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                       <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                         {testimonial.name}
                       </CardTitle>
                       <p className="text-sm text-gray-600">{testimonial.age} years old</p>
                       <div className="text-sm text-gray-500 flex items-center mt-0.5">
                         <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                         <span className="truncate">{testimonial.location}</span>
                       </div>
                     </div>
                   </div>
                 </CardHeader>
                 
                 <CardContent className="space-y-3 pt-0">
                   <div className="space-y-3">
                     <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
                       <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <School className="h-4 w-4 text-green-600" />
                       </div>
                       <div className="min-w-0 flex-1">
                         <p className="text-xs font-medium text-green-700 uppercase tracking-wide">University</p>
                         <p className="text-sm font-semibold text-gray-800 leading-tight">{testimonial.university}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <BookOpen className="h-4 w-4 text-blue-600" />
                       </div>
                       <div className="min-w-0 flex-1">
                         <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Program</p>
                         <p className="text-sm font-semibold text-gray-800 leading-tight">{testimonial.program}</p>
                       </div>
                     </div>
                   </div>
                   
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        &ldquo;{testimonial.review}&rdquo;
                      </p>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-30 flex items-center justify-center group"
        aria-label="Share Your Success Story"
      >
        <Edit3 className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Share Your Success Story
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>

      {/* Review Form Modal */}
       {showForm && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 pt-24" onClick={() => setShowForm(false)}>
           <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
             <div className="p-4 lg:p-6">
               {/* Header */}
               <div className="relative mb-6">
                 <button
                   onClick={() => setShowForm(false)}
                   className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                 >
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                   <span className="sr-only">Close</span>
                 </button>
                 
                 <div className="pr-12">
                   <h2 className="text-2xl font-bold text-gray-900">Share Your Success Story</h2>
                   <p className="text-gray-600 mt-1">
                     Tell us about your academic journey and inspire other students!
                   </p>
                 </div>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                       Full Name <span className="text-red-500">*</span>
                     </Label>
                     <Input
                       id="name"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       placeholder="Your full name"
                       required
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
                       Age <span className="text-red-500">*</span>
                     </Label>
                     <Input
                       id="age"
                       type="number"
                       value={formData.age}
                       onChange={(e) => setFormData({...formData, age: e.target.value})}
                       placeholder="Your age"
                       required
                       className="mt-1"
                     />
                   </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="university" className="text-sm font-semibold text-gray-700">
                       University <span className="text-red-500">*</span>
                     </Label>
                     <Input
                       id="university"
                       value={formData.university}
                       onChange={(e) => setFormData({...formData, university: e.target.value})}
                       placeholder="University name"
                       required
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="program" className="text-sm font-semibold text-gray-700">
                       Program <span className="text-red-500">*</span>
                     </Label>
                     <Input
                       id="program"
                       value={formData.program}
                       onChange={(e) => setFormData({...formData, program: e.target.value})}
                       placeholder="Program/Course"
                       required
                       className="mt-1"
                     />
                   </div>
                 </div>
                 
                 <div>
                   <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                     Location <span className="text-red-500">*</span>
                   </Label>
                   <Input
                     id="location"
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                     placeholder="City, Country"
                     required
                     className="mt-1"
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="review" className="text-sm font-semibold text-gray-700">
                     Your Review <span className="text-red-500">*</span>
                   </Label>
                   <Textarea
                     id="review"
                     value={formData.review}
                     onChange={(e) => setFormData({...formData, review: e.target.value})}
                     placeholder="Share your experience with ISAC... Tell us how we helped you achieve your academic goals."
                     rows={4}
                     required
                     className="mt-1"
                   />
                 </div>
                 
                 <div className="flex gap-3">
                   <Button 
                     type="button"
                     variant="outline"
                     onClick={() => setShowForm(false)}
                     className="flex-1"
                   >
                     Cancel
                   </Button>
                   <Button 
                     type="submit" 
                     className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:shadow-lg"
                   >
                     <Send className="h-4 w-4 mr-2" />
                     Submit Review
                   </Button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}
    </div>
  )
} 