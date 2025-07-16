"use client"

import { useRef, useEffect, useState } from 'react'

interface StudentLocation {
  country: string
  students: number
  lat: number
  lng: number
  color: string
}

const studentLocations: StudentLocation[] = [
  { country: "United States", students: 8500, lat: 39.8283, lng: -98.5795, color: "#3b82f6" },
  { country: "United Kingdom", students: 3200, lat: 55.3781, lng: -3.4360, color: "#ef4444" },
  { country: "Canada", students: 2800, lat: 56.1304, lng: -106.3468, color: "#10b981" },
  { country: "Australia", students: 2400, lat: -25.2744, lng: 133.7751, color: "#f59e0b" },
  { country: "Germany", students: 1900, lat: 51.1657, lng: 10.4515, color: "#8b5cf6" },
  { country: "France", students: 1600, lat: 46.2276, lng: 2.2137, color: "#ec4899" },
  { country: "Netherlands", students: 1200, lat: 52.1326, lng: 5.2913, color: "#06b6d4" },
  { country: "Sweden", students: 950, lat: 60.1282, lng: 18.6435, color: "#84cc16" },
  { country: "Singapore", students: 800, lat: 1.3521, lng: 103.8198, color: "#f97316" },
  { country: "Switzerland", students: 750, lat: 46.8182, lng: 8.2275, color: "#6366f1" },
  { country: "Japan", students: 650, lat: 36.2048, lng: 138.2529, color: "#14b8a6" },
  { country: "South Korea", students: 580, lat: 35.9078, lng: 127.7669, color: "#f43f5e" }
]

export function InteractiveGlobe() {
  const globeEl = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !globeEl.current) return

    const loadGlobe = async () => {
      const Globe = (await import('globe.gl')).default
      
      if (!globeEl.current) return

      const myGlobe = new Globe(globeEl.current)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('/assets/globe/earth-night.jpg')
        .bumpImageUrl('/assets/globe/earth-topology.png')
        .pointsData(studentLocations)
        .pointAltitude(0.1)
        .pointRadius(1.2)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointColor((d: any) => d.color)
        .pointsMerge(true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointLabel((d: any) => `
          <div style="background: rgba(0,0,0,0.9); padding: 10px 12px; border-radius: 8px; color: white; font-size: 13px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <strong style="color: ${d.color}; font-size: 14px;">${d.country}</strong><br/>
            <span style="color: #e5e7eb;">${d.students.toLocaleString()} students</span>
          </div>
        `)
        .enablePointerInteraction(true)
        .width(600)
        .height(600)

      // Auto-rotate
      myGlobe.controls().autoRotate = true
      myGlobe.controls().autoRotateSpeed = 0.5
      myGlobe.controls().enableZoom = false
    }

    loadGlobe()

    // Cleanup
    const currentElement = globeEl.current
    return () => {
      if (currentElement) {
        currentElement.innerHTML = ''
      }
    }
  }, [isMounted])

  // Don't render anything on server-side
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Globe Container */}
      <div className="globe-container relative">
        <div 
          ref={globeEl} 
          className="globe-element"
          style={{ 
            width: '600px', 
            height: '530px',
            margin: '0 auto'
          }}
        />
      </div>
      
      {/* Compact Legend - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-4 mb-3">
        <div className="text-center mb-3">
          <h4 className="text-gray-900 font-semibold text-base">Global Student Community</h4>
          <p className="text-gray-600 text-xs">
            {studentLocations.reduce((sum, loc) => sum + loc.students, 0).toLocaleString()} students • {studentLocations.length} countries
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {studentLocations.map((location) => (
            <div key={location.country} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0" 
                style={{ backgroundColor: location.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-gray-900 font-medium text-xs ">{location.country}</div>
                <div className="text-gray-500 text-xs">{location.students.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        
        
      </div>
    </div>
  )
} 