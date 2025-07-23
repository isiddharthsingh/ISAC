import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001'

export async function GET(
  request: NextRequest,
  { params }: { params: { universityId: string } }
) {
  try {
    const universityId = params.universityId
    
    const response = await fetch(`${BACKEND_URL}/api/whatsapp-groups/universities/${universityId}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    console.error('Error fetching university groups:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch university groups' },
      { status: 500 }
    )
  }
} 