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
  { country: "India", students: 15000, lat: 28.6139, lng: 77.2090, color: "#ff6b6b" }, // New Delhi coordinates, bright red
  { country: "United States", students: 8500, lat: 39.8283, lng: -98.5795, color: "#4ecdc4" },
  { country: "United Kingdom", students: 3200, lat: 55.3781, lng: -3.4360, color: "#45b7d1" },
  { country: "Canada", students: 2800, lat: 56.1304, lng: -106.3468, color: "#96ceb4" },
  { country: "Australia", students: 2400, lat: -25.2744, lng: 133.7751, color: "#feca57" },
  { country: "Germany", students: 1900, lat: 51.1657, lng: 10.4515, color: "#ff9ff3" },
  { country: "France", students: 1600, lat: 46.2276, lng: 2.2137, color: "#54a0ff" },
  { country: "Netherlands", students: 1200, lat: 52.1326, lng: 5.2913, color: "#5f27cd" },
  { country: "Sweden", students: 950, lat: 60.1282, lng: 18.6435, color: "#00d2d3" },
  { country: "Singapore", students: 800, lat: 1.3521, lng: 103.8198, color: "#ff6348" },
  { country: "Switzerland", students: 750, lat: 46.8182, lng: 8.2275, color: "#dda0dd" },
  { country: "Japan", students: 650, lat: 36.2048, lng: 138.2529, color: "#98d8c8" },
  { country: "South Korea", students: 580, lat: 35.9078, lng: 127.7669, color: "#f7b731" }
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
        .globeImageUrl('/assets/globe/earth-day-alt.jpg?v=' + Date.now())
        .bumpImageUrl('/assets/globe/earth-day-bump-alt.png?v=' + Date.now())
        .pointsData(studentLocations)
        .onPointClick((point) => console.log('Clicked point:', point)) // Debug logging
        .pointAltitude(0.15)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointRadius((d: any) => {
          
          return Math.max(1.5, Math.min(3, d.students / 3000));
        }) // Dynamic size based on student count
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointColor((d: any) => d.color)
        .pointsMerge(true)
        .pointsTransitionDuration(1000)
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
          <p className="text-gray-500 text-xs mt-1">
            Active members across our country-specific WhatsApp groups and events.
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