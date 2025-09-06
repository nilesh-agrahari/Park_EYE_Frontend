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
  vehicleNumber: string
  crimeLocation: string
  foundLocation: string
  crimeAttempted: string
  complainantUser: string
  reportedAt: string
  status: "pending" | "investigating" | "resolved"
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

  useEffect(() => {
    const userId = localStorage.getItem("police_id")
    if (!userId) {
      router.push("/policeLogin")
      return
    }

    fetchVehicleData()
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
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50">
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

        {data?.suspected_vehicles?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles reported</h3>
              <p className="text-gray-600">No suspected vehicles have been reported yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.suspected_vehicles?.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-blue-900">{vehicle.vehicleNumber}</CardTitle>
                    <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Crime Attempted</p>
                        <p className="text-sm text-gray-600">{vehicle.crimeAttempted}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Crime Location</p>
                        <p className="text-sm text-gray-600">{vehicle.crimeLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Found Location</p>
                        <p className="text-sm text-gray-600">{vehicle.foundLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reported By</p>
                        <p className="text-sm text-gray-600">{vehicle.complainantUser}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Reported on{" "}
                      {new Date(vehicle.reportedAt).toLocaleDateString("en-IN", {
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
