import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, ExternalLink, Loader2, Calendar, GraduationCap, Home, Globe, CheckCircle } from "lucide-react"
import { University, WhatsAppGroup } from '../types'
import { whatsappGroupsApi } from '@/lib/api'

interface WhatsAppGroupsListProps {
  selectedUniversity: University
  onReset: () => void
}

export function WhatsAppGroupsList({ selectedUniversity, onReset }: WhatsAppGroupsListProps) {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReturnUser, setIsReturnUser] = useState(false)

  useEffect(() => {
    fetchGroups()
    checkReturnUser()
  }, [selectedUniversity.id])

  const checkReturnUser = () => {
    const urlParams = new URLSearchParams(window.location.search)
    setIsReturnUser(urlParams.get('returnUser') === 'true')
  }

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await whatsappGroupsApi.getUniversityGroups(selectedUniversity.id)
      if (response.success) {
        setGroups(response.data)
      } else {
        setError('Failed to load WhatsApp groups')
      }
    } catch (err) {
      console.error('Error fetching groups:', err)
      setError('Failed to load WhatsApp groups')
    } finally {
      setLoading(false)
    }
  }

  const getGroupIcon = (groupType: string) => {
    switch (groupType) {
      case 'main': return <MessageCircle className="w-4 h-4" />
      case 'academic': return <GraduationCap className="w-4 h-4" />
      case 'housing': return <Home className="w-4 h-4" />
      case 'international': return <Globe className="w-4 h-4" />
      case 'intake': return <Calendar className="w-4 h-4" />
      default: return <MessageCircle className="w-4 h-4" />
    }
  }

  const getGroupTypeColor = (groupType: string) => {
    switch (groupType) {
      case 'main': return 'bg-green-50 border-green-200 text-green-700'
      case 'academic': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'housing': return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'international': return 'bg-orange-50 border-orange-200 text-orange-700'
      case 'intake': return 'bg-indigo-50 border-indigo-200 text-indigo-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }
  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <MessageCircle className="w-6 h-6 text-green-600" />
          {isReturnUser ? 'Welcome Back!' : 'Join Your University Groups'}
        </CardTitle>
        <CardDescription>
          {isReturnUser ? 
            `Welcome back to the ${selectedUniversity.name} WhatsApp community` :
            `Welcome to the ${selectedUniversity.name} WhatsApp community`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Groups */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Groups</h3>
          
          {isReturnUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Email Already Verified</h4>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your email has been verified previously. You can now access all {selectedUniversity.short_name} WhatsApp groups below.
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading WhatsApp groups...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load groups</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={fetchGroups} size="sm">
                Try Again
              </Button>
            </div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} className={`border rounded-lg p-4 ${getGroupTypeColor(group.group_type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getGroupIcon(group.group_type)}
                      <h4 className="font-semibold">
                        {group.group_name}
                      </h4>
                      {group.intake_year && (
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                          {group.intake_semester} {group.intake_year}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{group.member_count} members</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className={group.group_type === 'main' ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    variant={group.group_type === 'main' ? "default" : "outline"}
                    onClick={() => window.open(group.whatsapp_link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups available</h3>
              <p className="text-gray-600">
                WhatsApp groups for {selectedUniversity.name} are coming soon.
              </p>
            </div>
          )}
        </div>

        {/* Community Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Community Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be respectful and supportive to fellow students</li>
            <li>• No spam, self-promotion, or irrelevant content</li>
            <li>• Help others and share valuable resources</li>
            <li>• Respect privacy and confidentiality</li>
            <li>• Report any inappropriate behavior to admins</li>
          </ul>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReset}
        >
          Join Another University
        </Button>
      </CardContent>
    </Card>
  )
} 