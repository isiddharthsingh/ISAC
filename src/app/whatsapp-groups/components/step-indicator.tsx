import { 
  MessageCircle, 
  GraduationCap, 
  Shield, 
  CheckCircle,
  Clock
} from "lucide-react"
import { VerificationStep } from '../types'

interface StepIndicatorProps {
  currentStep: VerificationStep
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 'select', label: 'Select University', icon: GraduationCap },
    { id: 'verify', label: 'Verify Identity', icon: Shield },
    { id: 'pending', label: 'Under Review', icon: Clock },
    { id: 'approved', label: 'Approved', icon: CheckCircle },
    { id: 'groups', label: 'Join Groups', icon: MessageCircle }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex
        const isCurrent = step.id === currentStep
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex flex-col items-center ${index > 0 ? 'ml-4' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? isCurrent 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200' 
                    : 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 text-center max-w-16 ${
                isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 mt-5 transition-all duration-300 ${
                index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
} 