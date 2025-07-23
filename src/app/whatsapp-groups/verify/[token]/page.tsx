"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MessageCircle,
  ExternalLink,
  ArrowLeft
} from "lucide-react"

interface VerificationResult {
  success: boolean
  message: string
  data?: {
    university: string
    universityShortName: string
    universityId: string
  }
}

export default function VerifyEmailPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    if (!token) {
      setResult({
        success: false,
        message: "Invalid verification token"
      })
      setLoading(false)
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/whatsapp-groups/verify/confirm/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Verification error:', error)
      setResult({
        success: false,
        message: "Failed to verify email. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinWhatsApp = () => {
    if (result?.data?.universityId) {
      router.push(`/whatsapp-groups?verified=${result.data.universityId}`)
    }
  }

  const handleGoBack = () => {
    router.push('/whatsapp-groups')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
              <h3 className="text-lg font-semibold">Verifying your email...</h3>
              <p className="text-gray-600">Please wait while we confirm your verification.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {result?.success ? (
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Email Verified Successfully!
              </CardTitle>
              <CardDescription>
                Welcome to the {result.data?.university} community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 text-lg mb-2">
                  🎉 Congratulations!
                </h3>
                <p className="text-green-700">
                  Your enrollment at {result.data?.university} has been verified.
                  You can now join the exclusive WhatsApp groups for your university.
                </p>
              </div>

              <Button 
                onClick={handleJoinWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Access {result.data?.universityShortName} WhatsApp Groups
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Connect with fellow students from your university</li>
                  <li>• Share academic resources and get help</li>
                  <li>• Find housing and roommate opportunities</li>
                  <li>• Stay updated with university events and news</li>
                </ul>
              </div>

              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to WhatsApp Groups
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-red-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl text-red-600">
                <XCircle className="w-6 h-6" />
                Verification Failed
              </CardTitle>
              <CardDescription>
                Unable to verify your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <p className="text-red-700 mb-4">
                  {result?.message || "An error occurred during verification."}
                </p>
                
                <div className="text-sm text-red-600">
                  <p>Common reasons for verification failure:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Verification link has expired (24-hour limit)</li>
                    <li>Link has already been used</li>
                    <li>Invalid or corrupted verification token</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleGoBack}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  Need help? Contact{' '}
                  <a href="mailto:support@isac.org" className="text-blue-600 hover:underline">
                    support@isac.org
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 