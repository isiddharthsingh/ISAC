import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface VerificationPendingProps {
  hasStudentEmail: boolean | null
}

export function VerificationPending({ hasStudentEmail }: VerificationPendingProps) {
  return (
    <Card className="border-2 border-amber-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
          Verification in Progress
        </CardTitle>
        <CardDescription>
          We&apos;re reviewing your application
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">
          {hasStudentEmail 
            ? "Please check your email and click the verification link."
            : "Our team is reviewing your admit letter and information."
          }
        </p>
        <p className="text-sm text-gray-500">
          This usually takes 1-24 hours
        </p>
      </CardContent>
    </Card>
  )
} 