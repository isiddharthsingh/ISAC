// useState removed as it's not used in this component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Upload, Mail, AlertTriangle, ArrowLeft } from 'lucide-react'

interface DocumentRejectedProps {
  rejectionReason: string
  onTryAgain: () => void
  onGoBack: () => void
}

export function DocumentRejected({ rejectionReason, onTryAgain, onGoBack }: DocumentRejectedProps) {
  return (
    <Card className="border-2 border-red-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl text-red-600">
          <XCircle className="w-6 h-6" />
          Document Rejected
        </CardTitle>
        <CardDescription>
          Your uploaded document could not be verified
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 p-6 rounded-lg">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="font-semibold text-red-900 text-lg mb-2 text-center">
            ❌ Document Not Accepted
          </h3>
          <div className="bg-white p-4 rounded border border-red-200 mb-4">
            <p className="text-red-700 font-medium text-center">
              {rejectionReason}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <Upload className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <h4 className="font-semibold mb-2">📄 What to do next:</h4>
              <ul className="space-y-2 text-left">
                <li>• <strong>Upload a different document:</strong> Try uploading your admission letter, I-20, or other official enrollment document</li>
                <li>• <strong>Check document quality:</strong> Make sure the document is clear, readable, and shows your university name</li>
                <li>• <strong>Accepted formats:</strong> PDF, JPG, or PNG files only</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <h4 className="font-semibold mb-2">🤔 Think this was a mistake?</h4>
              <p>
                                  If you believe your document was incorrectly rejected, please contact our support team at{' '}
                <a href="mailto:support@isac.org" className="text-blue-600 hover:underline font-medium">
                  support@isac.org
                </a>{' '}
                with your document attached. We&apos;ll review it manually within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onTryAgain}
            className="w-full"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Try Uploading Different Document
          </Button>
          
          <Button 
            onClick={onGoBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back to University Selection
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need immediate help?{' '}
            <a href="mailto:support@isac.org" className="text-blue-600 hover:underline">
              <Mail className="w-4 h-4 inline mr-1" />
              Contact Support
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 