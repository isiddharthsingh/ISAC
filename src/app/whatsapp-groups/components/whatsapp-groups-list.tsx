import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, ExternalLink } from "lucide-react"
import { University } from '../types'

interface WhatsAppGroupsListProps {
  selectedUniversity: University
  onReset: () => void
}

export function WhatsAppGroupsList({ selectedUniversity, onReset }: WhatsAppGroupsListProps) {
  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <MessageCircle className="w-6 h-6 text-green-600" />
          Join Your University Groups
        </CardTitle>
        <CardDescription>
          Welcome to the {selectedUniversity.name} WhatsApp community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Groups */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Groups</h3>
          
          {/* Main University Group */}
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900">
                  {selectedUniversity.shortName} Main Community
                </h4>
                <p className="text-sm text-green-700">
                  General discussions, announcements, and networking
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">{selectedUniversity.studentCount} members</span>
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>
          </div>

          {/* Academic Groups */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedUniversity.shortName} Academic Help
                </h4>
                <p className="text-sm text-gray-600">
                  Study groups, assignment help, and academic discussions
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">87 members</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>
          </div>

          {/* International Students */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedUniversity.shortName} International Students
                </h4>
                <p className="text-sm text-gray-600">
                  Support for international students, visa help, cultural exchange
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">156 members</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>
          </div>

          {/* Housing */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedUniversity.shortName} Housing & Roommates
                </h4>
                <p className="text-sm text-gray-600">
                  Find roommates, housing options, and local recommendations
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">201 members</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>
          </div>
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