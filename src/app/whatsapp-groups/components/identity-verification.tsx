import { useState, useEffect, useCallback } from "react"
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Shield, 
  Upload,
  AlertCircle,
  Mail,
  FileText,
  XCircle,
  CheckCircle,
  Loader2,
  File,
  X
} from "lucide-react"
import { University } from '../types'

interface IdentityVerificationProps {
  selectedUniversity: University
  email: string
  setEmail: (email: string) => void
  phoneNumber: string
  setPhoneNumber: (phone: string) => void
  hasStudentEmail: boolean | null
  setHasStudentEmail: (hasEmail: boolean | null) => void
  additionalInfo: string
  setAdditionalInfo: (info: string) => void
  onSubmit: (method: 'email' | 'document') => void
}

export function IdentityVerification({
  selectedUniversity,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  hasStudentEmail,
  setHasStudentEmail,
  additionalInfo,
  setAdditionalInfo,
  onSubmit
}: IdentityVerificationProps) {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)



  // Validate email when it changes
  useEffect(() => {
    const validateEmail = async () => {
      if (!email.trim()) {
        setEmailError('')
        setEmailValid(false)
        return
      }

      // Check university domain for student emails
      if (hasStudentEmail && !email.includes(selectedUniversity.email_domain)) {
        setEmailError(`Must be a ${selectedUniversity.email_domain} email address`)
        setEmailValid(false)
        return
      }

      setEmailError('')
      setEmailValid(true)
    }

    const debounceTimer = setTimeout(validateEmail, 300)
    return () => clearTimeout(debounceTimer)
  }, [email, hasStudentEmail, selectedUniversity.email_domain])

  // Validate phone when it changes
  useEffect(() => {
    const validatePhone = async () => {
      if (!phoneNumber.trim()) {
        setPhoneError('')
        setPhoneValid(false)
        return
      }

      // Basic phone format validation
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(phoneNumber)) {
        setPhoneError('Please enter a valid phone number')
        setPhoneValid(false)
        return
      }

      setPhoneError('')
      setPhoneValid(true)
    }

    const debounceTimer = setTimeout(validatePhone, 300)
    return () => clearTimeout(debounceTimer)
  }, [phoneNumber])

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setEmailError('Please upload only PDF, JPG, or PNG files')
        return
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setEmailError('File size must be less than 10MB')
        return
      }
      
      setUploadedFile(file)
      setEmailError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleEmailSubmit = async () => {
    if (!emailValid || !phoneValid || !hasStudentEmail) {
      return
    }

    setIsCheckingEmail(true)
    setIsCheckingPhone(true)

    try {
      const { whatsappGroupsApi } = await import('@/lib/api')
      
      const response = await whatsappGroupsApi.startVerification({
        universityId: selectedUniversity.id,
        email,
        phoneNumber
      })

      if (response.success) {
        if (response.alreadyVerified) {
          // User is already verified - redirect directly to groups
          const timestamp = Date.now()
          window.location.href = `/whatsapp-groups?verified=${response.data.universityId}&returnUser=true&t=${timestamp}`;
        } else {
          // New verification started - proceed to email pending step
          onSubmit('email')
        }
      } else {
        // Handle specific error cases
        if (response.message?.includes('different phone number')) {
          setPhoneError(response.message)
        } else if (response.message?.includes('phone number is already registered')) {
          setPhoneError(response.message)
        } else if (response.message?.includes('Email must be from')) {
          setEmailError(response.message)
        } else {
          setEmailError(response.message || 'Verification failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setEmailError('Failed to send verification email. Please try again.')
    } finally {
      setIsCheckingEmail(false)
      setIsCheckingPhone(false)
    }
  }

  const handleDocumentSubmit = async () => {
    if (!emailValid || !phoneValid || !uploadedFile) {
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const { whatsappGroupsApi } = await import('@/lib/api')
      
      const response = await whatsappGroupsApi.uploadDocument({
        universityId: selectedUniversity.id,
        email,
        phoneNumber,
        document: uploadedFile
      })

      setUploadProgress(100)

      if (response.success) {
        if (response.alreadyVerified) {
          // User is already verified - redirect directly to groups
          const timestamp = Date.now()
          window.location.href = `/whatsapp-groups?verified=${response.data.universityId}&returnUser=true&t=${timestamp}`;
        } else if (response.autoApproved) {
          // Document was auto-approved - redirect directly to groups
          const timestamp = Date.now()
          window.location.href = `/whatsapp-groups?verified=${response.data.universityId}&returnUser=true&t=${timestamp}`;
        } else if (response.manualReview) {
          // Document needs manual review - proceed to document review pending step
          onSubmit('document')
        }
      } else {
        // Handle rejection or errors
        if (response.autoRejected) {
          setEmailError(`Document rejected: ${response.message}`)
        } else {
          setEmailError(response.message || 'Document upload failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Document upload error:', error)
      setEmailError('Failed to upload document. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async () => {
    if (hasStudentEmail) {
      await handleEmailSubmit()
    } else {
      await handleDocumentSubmit()
    }
  }
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <Shield className="w-6 h-6 text-blue-600" />
          Verify Your Identity
        </CardTitle>
        <CardDescription>
          Verify your enrollment at {selectedUniversity.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* University Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="font-semibold text-blue-900">{selectedUniversity.name}</div>
          <div className="text-sm text-blue-700">{selectedUniversity.location}</div>
        </div>

        {/* Verification Method Selection */}
        <div>
          <Label className="text-base font-semibold">Do you have a student email from {selectedUniversity.short_name}?</Label>
          <div className="flex gap-4 mt-2">
            <Button 
              variant={hasStudentEmail === true ? "default" : "outline"}
              onClick={() => setHasStudentEmail(true)}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Yes, I have student email
            </Button>
            <Button 
              variant={hasStudentEmail === false ? "default" : "outline"}
              onClick={() => setHasStudentEmail(false)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              No, but I have admit letter
            </Button>
          </div>
        </div>

        {/* Student Email Verification */}
        {hasStudentEmail === true && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Student Email Address</Label>
              <div className="relative">
                <Input 
                  id="email"
                  type="email"
                  placeholder={`your.name@${selectedUniversity.email_domain}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 pr-10 ${emailError ? 'border-red-500' : emailValid ? 'border-green-500' : ''}`}
                />
                {isCheckingEmail && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
                {!isCheckingEmail && emailValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!isCheckingEmail && emailError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {emailError ? (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Must be a valid {selectedUniversity.email_domain} email address
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">WhatsApp Phone Number *</Label>
              <div className="relative">
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`mt-1 pr-10 ${phoneError ? 'border-red-500' : phoneValid ? 'border-green-500' : ''}`}
                />
                {isCheckingPhone && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
                {!isCheckingPhone && phoneValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!isCheckingPhone && phoneError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {phoneError ? (
                <p className="text-xs text-red-500 mt-1">{phoneError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  This number will be used to verify your WhatsApp group access, use country codes.
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!emailValid || !phoneValid || isCheckingEmail || isCheckingPhone}
              className="w-full"
            >
              {isCheckingEmail || isCheckingPhone ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Send Verification Email
                  <Mail className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Admit Letter Upload */}
        {hasStudentEmail === false && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Personal Email Address</Label>
              <div className="relative">
                <Input 
                  id="email"
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 pr-10 ${emailError ? 'border-red-500' : emailValid ? 'border-green-500' : ''}`}
                />
                {isCheckingEmail && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
                {!isCheckingEmail && emailValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!isCheckingEmail && emailError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">WhatsApp Phone Number *</Label>
              <div className="relative">
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`mt-1 pr-10 ${phoneError ? 'border-red-500' : phoneValid ? 'border-green-500' : ''}`}
                />
                {isCheckingPhone && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
                {!isCheckingPhone && phoneValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!isCheckingPhone && phoneError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {phoneError ? (
                <p className="text-xs text-red-500 mt-1">{phoneError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  This number will be used to verify your WhatsApp group access, use country codes.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="document-upload">Upload Document (I-20 or Admit Letter)</Label>
              <div 
                {...getRootProps()} 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : uploadedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-1 text-center">
                  {uploadedFile ? (
                    <>
                      <File className="mx-auto h-12 w-12 text-green-500" />
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-green-700 font-medium">
                          {uploadedFile.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile()
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-green-600">
                        File ready for upload ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Upload a file</span>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      <p className="text-xs text-blue-600 font-medium">
                        Accepted: I-20, Admission Letters
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {uploading && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading and processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="additional-info">Additional Information (Optional)</Label>
              <Textarea 
                id="additional-info"
                placeholder="Student ID, program details, or any other relevant information..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!emailValid || !phoneValid || !uploadedFile || isCheckingEmail || isCheckingPhone || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Document...
                </>
              ) : isCheckingEmail || isCheckingPhone ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Upload & Verify Document
                  <Upload className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-semibold mb-1">Verification is required to maintain community quality</p>
              <p>We verify all students to ensure authentic university communities and prevent spam.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 