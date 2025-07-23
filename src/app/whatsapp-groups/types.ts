export interface University {
  id: string
  name: string
  short_name: string
  email_domain: string
  location: string
  groups?: WhatsAppGroup[]
}

export interface WhatsAppGroup {
  id: number
  university_id: string
  group_name: string
  group_type: 'main' | 'academic' | 'housing' | 'intake' | 'international'
  whatsapp_link: string
  intake_year?: string
  intake_semester?: string
  description: string
  is_active: boolean
  member_count: number
}

export type VerificationStep = 'select' | 'verify' | 'pending' | 'approved' | 'groups'