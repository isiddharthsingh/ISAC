import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MessageCircle } from "lucide-react"
import { University } from '../types'

interface VerificationApprovedProps {
  selectedUniversity: University
  onJoinGroups: () => void
}

export function VerificationApproved({ selectedUniversity, onJoinGroups }: VerificationApprovedProps) {
  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Verification Approved!
        </CardTitle>
        <CardDescription>
          Welcome to the {selectedUniversity.name} community
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-green-900 text-lg mb-2">
            🎉 Congratulations!
          </h3>
          <p className="text-green-700">
            Your enrollment at {selectedUniversity.name} has been verified.
            You can now join exclusive WhatsApp groups for your university.
          </p>
        </div>

        <Button onClick={onJoinGroups} size="lg" className="w-full">
          Access WhatsApp Groups
          <MessageCircle className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
} 