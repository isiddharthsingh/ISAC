"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  GraduationCap, 
  Globe,
  Mail,
  ArrowRight,
  Search,
  Filter,
  X,
  SortAsc,
  Loader2,
  XCircle
} from "lucide-react"

import { whatsappGroupsApi } from '@/lib/api'
import { University } from '../types'

interface UniversitySelectionProps {
  onUniversitySelect: (universityId: string) => void
}

export function UniversitySelection({ onUniversitySelect }: UniversitySelectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const response = await whatsappGroupsApi.getUniversities()
      if (response.success) {
        setUniversities(response.data)
      } else {
        setError('Failed to load universities')
      }
    } catch (err) {
      console.error('Error fetching universities:', err)
      setError('Failed to load universities')
    } finally {
      setLoading(false)
    }
  }

  // Get unique locations for filter dropdown
  const getUniqueLocations = () => {
    const locations = universities.map(uni => uni.location.split(', ')[1]).filter(Boolean)
    return [...new Set(locations)].sort()
  }

  // Filter and sort universities
  const getFilteredUniversities = () => {
    let filtered = universities

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(uni => uni.location.includes(locationFilter))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filtered
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('all')
    setSortBy('name')
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          Select Your University
        </CardTitle>
        <CardDescription>
          Choose your university to join the verified student community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter Section */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search universities by name, abbreviation, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Location Filter */}
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter by State
              </Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                <SortAsc className="w-4 h-4 inline mr-2" />
                Sort by
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">University Name</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters & Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {getFilteredUniversities().length} of {universities.length} universities
            </div>
            
            {(searchQuery || locationFilter !== 'all' || sortBy !== 'name') && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {(searchQuery || locationFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  State: {locationFilter}
                  <button
                    onClick={() => setLocationFilter('all')}
                    className="ml-2 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Universities List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading universities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load universities</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={fetchUniversities} size="sm">
                Try Again
              </Button>
            </div>
          ) : getFilteredUniversities().length > 0 ? (
            getFilteredUniversities().map((university) => (
              <div 
                key={university.id}
                onClick={() => onUniversitySelect(university.id)}
                className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                      {university.name}
                      <span className="ml-2 text-sm text-blue-600 font-medium">
                        ({university.short_name})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {university.location}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No universities found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find your university.
              </p>
              <Button variant="outline" onClick={clearFilters} size="sm">
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Add University Request */}
        <div className="border-t pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Don&apos;t see your university? We&apos;re constantly adding new institutions.
            </p>
            <a href="mailto:hello@isac-usa.org?subject=University%20Onboarding%20Request&body=Hello%20ISAC%20Team%2C%0A%0AI%20would%20like%20to%20request%20the%20addition%20of%20my%20university%20to%20your%20platform.%0A%0AUniversity%20Name%3A%20%5BPlease%20fill%20in%5D%0A%0AThank%20you%2C">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Request to add my university
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 