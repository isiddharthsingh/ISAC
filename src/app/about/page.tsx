"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Globe, 
  GraduationCap,
  Heart,
  Award,
  BookOpen,
  Target,
  Lightbulb,
  HandHeart,
  MessageCircle
} from "lucide-react"

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" />
  }

  const stats = [
    {
      icon: Users,
      count: "25K+",
      label: "Students Served",
      description: "From over 85 countries worldwide",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      bgPattern: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
    },
    {
      icon: Globe,
      count: "100+",
      label: "Countries",
      description: "Global reach across six continents",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      bgPattern: "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
    },
    {
      icon: GraduationCap,
      count: "500+",
      label: "Expert Mentors",
      description: "Certified professionals and alumni",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      bgPattern: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
    },
    {
      icon: Award,
      count: "94%",
      label: "Success Rate",
      description: "Students achieving their goals",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      bgPattern: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
              <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Our Story
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Empowering Dreams Through
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Global Education</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Join Our Community
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group relative p-6 lg:p-8 rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden ${stat.bgPattern}`}
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
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  
                  {/* Count */}
                  <div className="mb-2 lg:mb-3">
                    <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight">
                      {stat.count}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                  
                  {/* Description */}
                  <div className="block sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{stat.description}</p>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 sm:mb-6 bg-purple-100 text-purple-700 border-purple-200 text-xs sm:text-sm">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Our Story
              </Badge>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Creating a Home Away from Home for International Students
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Starting fresh in a new country can be exciting—but also lonely and overwhelming. We’ve been there. That’s why we created a space where international students can find support, share experiences, and build community.
                </p>
                <p>
                From mental health struggles to career uncertainty, we understand the gaps and we’re here to fill them. Through peer-led events, resource guides, and mentorship, we’re helping thousands of students feel less alone and more equipped.
                </p>
                <p>
                We believe no student should face these challenges in silence. Together, we’re building a stronger, more connected community - one student at a time.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Peer Connections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Mental Health First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <HandHeart className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Real-World Help</span>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <GraduationCap className="w-24 h-24 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-bold">Built on Shared Experience</h3>
                      <p className="text-blue-100 mt-2">Real help from people who’ve lived it</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Card className="p-8 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Target className="w-24 h-24 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-bold">Our Mission</h3>
                      <p className="text-orange-100 mt-2">Helping international students thrive in the U.S.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Badge className="mb-4 sm:mb-6 bg-orange-100 text-orange-700 border-orange-200 text-xs sm:text-sm">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Our Purpose
              </Badge>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Making support systems more accessible for international students
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Moving to a new country is hard. We’ve been through the same struggles—feeling lost, alone, and unsure. 
                </p>
                <p>
                  We started this to fix that. We offer seminars, support groups, guidebooks, and events that connect students to each other and to the help they need.
                </p>
                <p>
                  We believe no student should go through this alone.
                </p>
              </div>
              
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community First</h4>
                    <p className="text-sm text-gray-600">Building supportive networks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Reach</h4>
                    <p className="text-sm text-gray-600">Students from over 100 countries. 25,000+ strong.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Join thousands of students who are already achieving their dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white/30 text-sm sm:text-base px-6 sm:px-8">
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 