export interface University {
  id: string
  name: string
  shortName: string
  emailDomain: string
  location: string
  studentCount: number
  whatsappLink?: string
}

export type VerificationStep = 'select' | 'verify' | 'pending' | 'approved' | 'groups'

export interface VerificationState {
  currentStep: VerificationStep
  selectedUniversity: University | null
  email: string
  phoneNumber: string
  hasStudentEmail: boolean | null
  admitLetter: File | null
  additionalInfo: string
  verificationCode: string
}

export interface SearchFilterState {
  searchQuery: string
  locationFilter: string
  sortBy: string
} 