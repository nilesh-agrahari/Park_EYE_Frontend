"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Car, AlertTriangle, User, RefreshCw } from "lucide-react"

interface SuspectedVehicle {
  id: string
  regs_no: string
  spotted_location: string
  found_location: string
  crime_attempted: string
  user: string
  date_time: string
  is_founded: false | true
}

interface ApiResponse {
  police: {
    id: number
    username: string
    locations: string[]
  }
  suspected_vehicles: SuspectedVehicle[]
}

export default function VehiclesPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const playSound = () => {
    const audio = new Audio("") // put alert.mp3 in your public/ folder
    audio.play()
  }


  useEffect(() => {
    const userId = localStorage.getItem("police_id")
    if (!userId) {
      router.push("/policeLogin")
      return
    }

    fetchVehicleData()

    // // auto refresh every 5 seconds
    // const interval = setInterval(() => {fetchVehicleData()}, 5000)

    // // cleanup interval when leaving the page
    // return () => clearInterval(interval)

  }, [router])

  const fetchVehicleData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://127.0.0.1:8000/api/police-dashboard/${localStorage.getItem("police_id")}/`)

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle data")
      }

      const result: ApiResponse = await response.json()
      playSound()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (is_founded: boolean) => {
    switch (is_founded) {
      case false:
        return "bg-yellow-100 text-red-800 border-yellow-200"
      case true:
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-4xl mx-auto space-y-6">
//           <Skeleton className="h-8 w-64" />
//           <div className="grid gap-4">
//             {[1, 2, 3].map((i) => (
//               <Card key={i}>
//                 <CardHeader>
//                   <Skeleton className="h-6 w-32" />
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-3/4" />
//                   <Skeleton className="h-4 w-1/2" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchVehicleData} className="mt-4 bg-transparent" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Reports Dashboard</h1>
          {data?.police && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{data.police.username}</p>
              <p className="text-xs mt-1">Monitoring {data.police.locations.length} locations</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        

        {data?.suspected_vehicles?.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  {/* Radar Container */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900">
                    {/* Concentric Circles */}
                    <svg className="w-full h-full" viewBox="0 0 192 192">
                      <defs>
                        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
                        </radialGradient>
                      </defs>

                      {/* Radar Circles */}
                      {[30, 50, 70, 90].map((radius, index) => (
                        <circle
                          key={radius}
                          cx="96"
                          cy="96"
                          r={radius}
                          fill="none"
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="1"
                          opacity={0.6 - index * 0.1}
                          className="animate-pulse"
                          style={{
                            animationDelay: `${index * 0.2}s`,
                            animationDuration: "2s",
                          }}
                        />
                      ))}

                      {/* Center Dot */}
                      <circle cx="96" cy="96" r="3" fill="rgb(234, 179, 8)" className="animate-pulse" />

                      {/* Rotating Sweep Line */}
                      <g className="animate-spin" style={{ transformOrigin: "96px 96px", animationDuration: "3s" }}>
                        <line
                          x1="96"
                          y1="96"
                          x2="96"
                          y2="6"
                          stroke="url(#radarGradient)"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <line x1="96" y1="96" x2="96" y2="6" stroke="rgb(34, 197, 94)" strokeWidth="1" opacity="1" />
                      </g>

                      {/* Random Detection Dots */}
                      <circle cx="130" cy="70" r="2" fill="rgb(239, 68, 68)" opacity="0.8" className="animate-ping" />
                      <circle
                        cx="60"
                        cy="120"
                        r="2"
                        fill="rgb(239, 68, 68)"
                        opacity="0.6"
                        className="animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <circle
                        cx="140"
                        cy="140"
                        r="2"
                        fill="rgb(239, 68, 68)"
                        opacity="0.7"
                        className="animate-ping"
                        style={{ animationDelay: "1s" }}
                      />
                      <circle
                        cx="50"
                        cy="60"
                        r="2"
                        fill="rgb(239, 68, 68)"
                        opacity="0.5"
                        className="animate-ping"
                        style={{ animationDelay: "1.5s" }}
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-green-400 mb-2">Scanning for Vehicles...</h3>
                <p className="text-slate-400">No suspected vehicles detected in the area.</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Radar Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (

            
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Suspected Vehicles</h2>
                <p className="text-sm text-gray-600">{data?.suspected_vehicles?.length || 0} reports found</p>
            </div>
            <Button onClick={fetchVehicleData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
            </Button>
            </div>

            {data?.suspected_vehicles?.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-blue-900">{vehicle.regs_no}</CardTitle>
                    <Badge className={getStatusColor(vehicle.is_founded)}>status</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-8">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Crime Attempted</p>
                        <p className="text-sm text-gray-600">{vehicle.crime_attempted}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Crime Location</p>
                        <p className="text-sm text-gray-600">{vehicle.spotted_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Found Location</p>
                        <p className="text-sm text-gray-600">{vehicle.found_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reported By</p>
                        <p className="text-sm text-gray-600">{vehicle.user}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Reported on{" "}
                      {new Date(vehicle.date_time).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
