// components/JobCard.jsx
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Zap } from "lucide-react" //location pin and 'company logo' icons

export function JobCard({ title, location, status, type, salary, work_location, company, description, requirements }) {
    return (
        <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
                {/* job header with job title and progress tag */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <span className="bg-gray-200 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        {status}
                    </span>
                </div>

                {/* location with pin icon */}
                <div className="flex items-center mb-3">
                <span className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                    {location}
                </span>
                </div>

                {/* three flairs including the schedule type, salary, and work location */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="bg-gray-200 text-pink-600 px-3 py-1 rounded-full text-sm">
                        {type}
                    </span>
                    <span className="bg-gray-200 text-pink-600 px-3 py-1 rounded-full text-sm">
                        {salary}
                    </span>
                    <span className="bg-gray-200 text-pink-600 px-3 py-1 rounded-full text-sm">
                        {work_location}
                    </span>
                </div>

                {/* company description with logo */}
                <div className="flex items-start mb-4">
                    <Zap className="w-5 h-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                        <span className="font-bold text-purple-600">{company}:</span> {description}
                    </p>
                </div>

                {/* job requirements section */}
                <div className="space-y-1">
                    {requirements.map((req, idx) => (
                        <p key={idx} className="text-sm text-blue-800">
                            {req}
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
