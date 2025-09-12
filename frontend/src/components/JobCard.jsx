// components/JobCard.jsx
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function JobCard({ title, location, status, type, company, description, requirements }) {
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" /> {location}
                    </p>
                </div>
                {status && <Badge variant="secondary">{status}</Badge>}
            </CardHeader>

            <CardContent>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {type.map((t, idx) => (
                        <Badge key={idx}>{t}</Badge>
                    ))}
                </div>

                <p className="text-sm">
                    <span className="font-bold text-primary">{company}</span>: {description}
                </p>

                {requirements.map((req, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                        {req}
                    </p>
                ))}
            </CardContent>
        </Card>
    )
}
