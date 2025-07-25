"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { VerificationStep, University } from './types'
import { whatsappGroupsApi } from '@/lib/api'
import { StepIndicator } from './components/step-indicator'
import { UniversitySelection } from './components/university-selection'
import { IdentityVerification } from './components/identity-verification'
import { VerificationPending } from './components/verification-pending'
import { DocumentReviewPending } from './components/document-review-pending'
import { DocumentRejected } from './components/document-rejected'
import { VerificationApproved } from './components/verification-approved'
import { WhatsAppGroupsList } from './components/whatsapp-groups-list'

export default function WhatsAppGroupsPage() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('select')
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hasStudentEmail, setHasStudentEmail] = useState<boolean | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [universities, setUniversities] = useState<University[]>([])
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'document' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchUniversities()
    checkDirectAccess()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await whatsappGroupsApi.getUniversities()
      if (response.success) {
        setUniversities(response.data)
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const checkDirectAccess = () => {
    // Check if user was redirected from verification with verified status
    const urlParams = new URLSearchParams(window.location.search)
    const verifiedUniversityId = urlParams.get('verified')
    const isReturnUser = urlParams.get('returnUser')
    
    if (verifiedUniversityId && isReturnUser) {
      // Security: Only allow direct access if user came from our verification process
      // Check if this is a legitimate redirect by looking for a recent timestamp
      const redirectTimestamp = urlParams.get('t')
      const currentTime = Date.now()
      
      // Only allow redirect within 30 seconds of verification completion
      if (redirectTimestamp && (currentTime - parseInt(redirectTimestamp)) < 30000) {
        // Find the university and skip directly to groups
        const findUniversityAndShowGroups = async () => {
          try {
            const response = await whatsappGroupsApi.getUniversities()
            if (response.success) {
              setUniversities(response.data)
              const university = response.data.find((u: University) => u.id === verifiedUniversityId)
              if (university) {
                setSelectedUniversity(university)
                setCurrentStep('groups')
                // Clean up URL parameters after successful redirect
                window.history.replaceState({}, '', '/whatsapp-groups')
              }
            }
          } catch (error) {
            console.error('Error during direct access:', error)
          }
        }
        findUniversityAndShowGroups()
      } else {
        // Invalid or expired redirect - clear URL and start fresh
        window.history.replaceState({}, '', '/whatsapp-groups')
      }
    }
  }


  const handleUniversitySelect = async (universityId: string) => {
    try {
      // Fetch fresh university data from API
      const response = await whatsappGroupsApi.getUniversities()
      if (response.success) {
        const university = response.data.find((u: University) => u.id === universityId)
        setSelectedUniversity(university || null)
        setCurrentStep('verify')
      }
    } catch (error) {
      console.error('Error selecting university:', error)
    }
  }

  const handleVerificationSubmit = (method: 'email' | 'document') => {
    setVerificationMethod(method)
    setCurrentStep('pending')
  }

  const handleRejection = (reason: string) => {
    setRejectionReason(reason)
    setCurrentStep('rejected')
  }

  const handleTryAgain = () => {
    setCurrentStep('verify')
    setRejectionReason('')
    // Reset form state to allow re-upload
    setHasStudentEmail(null)
  }

  const handleGoBackToUniversities = () => {
    setCurrentStep('select')
    setSelectedUniversity(null)
    setEmail('')
    setPhoneNumber('')
    setHasStudentEmail(null)
    setAdditionalInfo('')
    setVerificationMethod(null)
    setRejectionReason('')
  }

  const handleJoinGroups = () => {
    setCurrentStep('groups')
  }

  const handleReset = () => {
    setCurrentStep('select')
    setSelectedUniversity(null)
    setEmail('')
    setPhoneNumber('')
    setHasStudentEmail(null)
    setAdditionalInfo('')
    setVerificationMethod(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
              <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-700 border-green-200 text-xs sm:text-sm">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              University Communities
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Join Your 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> University WhatsApp</span> Community
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with fellow students from your university, share experiences, get help, and build lasting friendships through verified WhatsApp groups.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {universities.length}
              </div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Active Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            {/* Step 1: University Selection */}
            {currentStep === 'select' && (
              <UniversitySelection onUniversitySelect={handleUniversitySelect} />
            )}

            {/* Step 2: Identity Verification */}
            {currentStep === 'verify' && selectedUniversity && (
              <IdentityVerification
                selectedUniversity={selectedUniversity}
                email={email}
                setEmail={setEmail}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                hasStudentEmail={hasStudentEmail}
                setHasStudentEmail={setHasStudentEmail}
                additionalInfo={additionalInfo}
                setAdditionalInfo={setAdditionalInfo}
                onSubmit={handleVerificationSubmit}
                onRejection={handleRejection}
              />
            )}

            {/* Step 3: Pending Verification - Email */}
            {currentStep === 'pending' && selectedUniversity && verificationMethod === 'email' && (
              <VerificationPending 
                hasStudentEmail={hasStudentEmail}
                email={email}
                universityId={selectedUniversity.id}
                onVerificationComplete={() => setCurrentStep('approved')}
              />
            )}

            {/* Step 3: Pending Verification - Document Review */}
            {currentStep === 'pending' && selectedUniversity && verificationMethod === 'document' && (
              <DocumentReviewPending 
                email={email}
                universityId={selectedUniversity.id}
                onVerificationComplete={() => setCurrentStep('approved')}
              />
            )}

            {/* Step 3: Document Rejected */}
            {currentStep === 'rejected' && selectedUniversity && (
              <DocumentRejected 
                rejectionReason={rejectionReason}
                onTryAgain={handleTryAgain}
                onGoBack={handleGoBackToUniversities}
              />
            )}

            {/* Step 4: Approved */}
            {currentStep === 'approved' && selectedUniversity && (
              <VerificationApproved
                selectedUniversity={selectedUniversity}
                onJoinGroups={handleJoinGroups}
              />
            )}

            {/* Step 5: WhatsApp Groups */}
            {currentStep === 'groups' && selectedUniversity && (
              <WhatsAppGroupsList
                selectedUniversity={selectedUniversity}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 