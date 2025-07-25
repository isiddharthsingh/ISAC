import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileCheck, RefreshCw, AlertCircle } from "lucide-react"
import { whatsappGroupsApi } from '@/lib/api'

interface DocumentReviewPendingProps {
  email: string
  universityId: string
  onVerificationComplete: () => void
}

export function DocumentReviewPending({ email, universityId, onVerificationComplete }: DocumentReviewPendingProps) {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const checkVerificationStatus = async () => {
    setIsCheckingStatus(true)
    setStatusMessage('')
    
    try {
      const response = await whatsappGroupsApi.getVerificationStatus({
        email,
        universityId
      })
      
      if (response.success) {
        if (response.data.status === 'verified') {
          onVerificationComplete()
        } else if (response.data.status === 'rejected') {
          setStatusMessage('Your document was rejected. Please try uploading a different document.')
        } else {
          setStatusMessage('Your document is still under review. We&apos;ll notify you once it&apos;s processed.')
        }
      } else {
        setStatusMessage('Failed to check verification status. Please try again.')
      }
    } catch (error) {
      console.error('Error checking status:', error)
      setStatusMessage('Failed to check verification status. Please try again.')
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
          Document Under Review
        </CardTitle>
        <CardDescription>
          Our team is reviewing your uploaded document
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <FileCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-blue-900 text-lg mb-2">
            📄 Document Submitted Successfully
          </h3>
          <p className="text-blue-700 mb-4">
            Your document has been uploaded and is being reviewed by our verification team.
          </p>
          <p className="text-sm text-blue-600">
            You will be notified within 24-48 hours once the review is complete.
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
                Checking Status...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Review Status
              </>
            )}
          </Button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            statusMessage.includes('rejected') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : statusMessage.includes('still under review')
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {statusMessage}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <h4 className="font-semibold mb-2">📋 Review Process:</h4>
              <ul className="space-y-1 text-left">
                <li>• Our team manually verifies all uploaded documents</li>
                <li>• We check for authenticity and university affiliation</li>
                <li>• You&apos;ll receive an email notification once complete</li>
                <li>• If approved, you&apos;ll gain immediate access to WhatsApp groups</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Review typically takes 24-48 hours during business days
        </p>
      </CardContent>
    </Card>
  )
} 