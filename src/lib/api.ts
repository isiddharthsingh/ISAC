// API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Types for API responses
export interface Mentor {
  id: number;
  full_name: string;
  specialty: string;
  university: string;
  degree: string;
  location: string;
  languages: string[];
  bio: string;
  profile_image_url: string;
  social_links: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  rating: string;
  total_reviews: number;
  experience_years: number | null;
  created_at: string;
}

export interface MentorsResponse {
  success: boolean;
  data: {
    mentors: Mentor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface FilterOptionsResponse {
  success: boolean;
  data: {
    specialties: string[];
    languages: string[];
    locations: string[];
    universities: string[];
  };
}

export interface MentorApplicationData {
  fullName: string;
  email: string;
  phone: string;
  currentUniversity: string;
  degree: string;
  graduationYear: string;
  specialization: string;
  experienceYears: string;
  languages: string;
  linkedinUrl?: string;
  motivation: string;
  availability: string;
  sampleAdvice: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationId: number;
    submittedAt: string;
  };
}

// API Functions

// Get all mentors with optional filters
export async function getMentors(params: {
  specialty?: string;
  language?: string;
  location?: string;
  university?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
} = {}): Promise<MentorsResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const endpoint = `/mentors${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<MentorsResponse>(endpoint);
}

// Get mentor by ID
export async function getMentorById(id: number): Promise<{ success: boolean; data: Mentor }> {
  return apiRequest<{ success: boolean; data: Mentor }>(`/mentors/${id}`);
}

// Get filter options for dropdowns
export async function getFilterOptions(): Promise<FilterOptionsResponse> {
  return apiRequest<FilterOptionsResponse>('/mentors/filter-options');
}

// Submit mentor application
export async function submitMentorApplication(applicationData: MentorApplicationData): Promise<ApplicationResponse> {
  return apiRequest<ApplicationResponse>('/mentors/apply', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

// Get mentor statistics
export async function getMentorStats(): Promise<{
  success: boolean;
  data: {
    overview: {
      total_mentors: string;
      total_specialties: string;
      total_universities: string;
      total_locations: string;
      average_rating: string;
    };
    specialtyBreakdown: Array<{
      specialty: string;
      count: string;
    }>;
  };
}> {
  return apiRequest('/mentors/stats');
}

// Health check
export async function healthCheck(): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
  environment: string;
}> {
  return apiRequest('/health', { 
    headers: {},
    cache: 'no-store' 
  });
} 

// WhatsApp Groups API
export const whatsappGroupsApi = {
  // Get all universities
  getUniversities: async () => {
    const response = await fetch('/api/whatsapp-groups/universities')
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    return response.json()
  },

  // Get WhatsApp groups for a specific university
  getUniversityGroups: async (universityId: string) => {
    const response = await fetch(`/api/whatsapp-groups/universities/${universityId}/groups`)
    if (!response.ok) {
      throw new Error('Failed to fetch university groups')
    }
    return response.json()
  },

  // Start verification process
  startVerification: async (data: {
    universityId: string
    email: string
    phoneNumber: string
  }) => {
    const response = await fetch('/api/whatsapp-groups/verify/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Get verification status
  getVerificationStatus: async (data: {
    email: string
    universityId: string
  }) => {
    const response = await fetch('/api/whatsapp-groups/verify/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Resend verification email
  resendVerification: async (data: {
    email: string
    universityId: string
  }) => {
    const response = await fetch('/api/whatsapp-groups/verify/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Check if email exists (for validation)
  checkEmailExists: async (email: string): Promise<boolean> => {
    // This will be handled by the startVerification endpoint
    // Return false for now since the backend handles the actual check
    return false
  },

  // Check if phone exists (for validation)  
  checkPhoneExists: async (phone: string): Promise<boolean> => {
    // This will be handled by the startVerification endpoint
    // Return false for now since the backend handles the actual check
    return false
  }
} 