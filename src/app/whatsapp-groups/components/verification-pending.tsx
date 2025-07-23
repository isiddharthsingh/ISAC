import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, RefreshCw } from "lucide-react"
import { whatsappGroupsApi } from '@/lib/api'

interface VerificationPendingProps {
  hasStudentEmail: boolean | null
  email: string
  universityId: string
  onVerificationComplete: () => void
}

export function VerificationPending({ hasStudentEmail, email, universityId, onVerificationComplete }: VerificationPendingProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendMessage('')
    
    try {
      const response = await whatsappGroupsApi.resendVerification({
        email,
        universityId
      })
      
      if (response.success) {
        setResendMessage('Verification email sent successfully!')
      } else {
        setResendMessage(response.message || 'Failed to resend email')
      }
    } catch (error) {
      console.error('Error resending email:', error)
      setResendMessage('Failed to resend email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const checkVerificationStatus = async () => {
    setIsCheckingStatus(true)
    
    try {
      const response = await whatsappGroupsApi.getVerificationStatus({
        email,
        universityId
      })
      
      if (response.success && response.data.status === 'verified') {
        onVerificationComplete()
      } else {
        setResendMessage('Verification still pending. Please check your email.')
      }
    } catch (error) {
      console.error('Error checking status:', error)
      setResendMessage('Failed to check verification status.')
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <Card className="border-2 border-amber-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
          Verification Email Sent
        </CardTitle>
        <CardDescription>
          Check your email to complete verification
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="bg-amber-50 p-6 rounded-lg">
          <Mail className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h3 className="font-semibold text-amber-900 text-lg mb-2">
            📧 Check Your Email
          </h3>
          <p className="text-amber-700 mb-4">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-amber-600">
            Click the link in the email to verify your account and access WhatsApp groups.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={checkVerificationStatus}
            variant="outline"
            className="w-full"
            disabled={isCheckingStatus}
          >
            {isCheckingStatus ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Verification Status
              </>
            )}
          </Button>

          <Button 
            onClick={handleResendEmail}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        {resendMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            resendMessage.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {resendMessage}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Next Steps:</h4>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>1. Check your email inbox (including spam folder)</li>
            <li>2. Click the verification link in the email</li>
            <li>3. Return here to access your university's WhatsApp groups</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          Verification link expires in 24 hours
        </p>
      </CardContent>
    </Card>
  )
} 