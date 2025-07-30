"use client"

import { useState, useEffect } from "react"

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
  HandHeart
} from "lucide-react"

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" />
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-3 sm:mb-4 bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Our Story
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Empowering Dreams Through
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Global Education</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6">
              ISAC provides exclusive WhatsApp groups by school, educational webinars on visas and housing, mentorship programs, and local guides to help international students navigate their study abroad journey with confidence and support.
            </p>
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
                  We tackle these challenges head-on by providing tangible support, including school-specific WhatsApp groups, webinars on visas and housing, mentorship programs, and local guides. Our goal is to equip you with the resources you need to feel confident and connected.
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
                Built By Students, For Students
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We’ve been in your shoes. We know how tough it is to leave home and start over in a new country. That’s why we built ISAC—to be the support system we wish we had.
                </p>
                <p>
                  We offer practical resources like university-specific WhatsApp groups, webinars on visas and housing, mentorship programs, and local guides. But more than that, we offer a community that understands.
                </p>
                <p>
                  No student should have to navigate this journey alone.
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
                    <p className="text-sm text-gray-600">Students from over 100 countries. 30,000+ strong.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                What We Offer
              </Badge>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                How We Help You Transition
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                After you receive your college acceptance, ISAC helps you transition smoothly with tangible support.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connect with Your School&apos;s Community</h4>
                    <p className="text-sm text-gray-600">We connect you with your school&apos;s WhatsApp groups so you meet classmates before you arrive.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Q&A Webinars and Panels</h4>
                    <p className="text-sm text-gray-600">We host Q&A webinars and panels on housing, visas, academics, and campus life.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <HandHeart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mentor Pairing</h4>
                    <p className="text-sm text-gray-600">We pair you with mentors and student volunteers who&apos;ve been through the same journey.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Guides and Resources</h4>
                    <p className="text-sm text-gray-600">We share guides, tips, and resources to make your first semester abroad less overwhelming.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-green-500 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Award className="w-24 h-24 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-bold">Tangible Support</h3>
                      <p className="text-blue-100 mt-2">Resources to ensure you succeed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of 25,000+ international students. Connect with peers, access educational resources, and achieve your study abroad dreams with ISAC's comprehensive support system.
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
      </section> */}
    </div>
  )
} 