import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.formData()
    
    // Create new FormData to forward to backend
    const backendFormData = new FormData()
    
    // Copy all form fields to backend FormData
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value)
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/whatsapp-groups/verify/upload`, {
      method: 'POST',
      body: backendFormData
    })

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 