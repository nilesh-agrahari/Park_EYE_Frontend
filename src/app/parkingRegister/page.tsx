"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Car, Clock, MapPin, Calendar, Users, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VehicleRecord {
  id: number
  regs_no: string
  in_date_time: string
  out_date_time: string | null
  in_parking: boolean
  slot_position: string | null
  suspected: boolean
}

export default function ParkingRecordsPage() {
  const [records, setRecords] = useState<VehicleRecord[]>([])
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [stats, setStats] = useState({
    total: 0,
    inside: 0,
    suspected: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem("parking_id")
    if (!userId) {
      toast
      router.push("/parkingLogin")
      return
    }
    fetchRecords()
  }, [selectedDate, router])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://parkeye.onrender.com/api/vehicles/?date=${selectedDate}&parking_id=${localStorage.getItem("parking_id")} `)
      // const response = await fetch(`http://127.0.0.1:8000/api/vehicles/`)

      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }

      const data: VehicleRecord[] = await response.json()
      setRecords(data)

      // Calculate stats from the data array
      const total = data.length
      const inside = data.filter((record) => record.in_parking).length
      const suspected = data.filter((record) => record.suspected).length

      setStats({
        total,
        inside,
        suspected,
      })
    } catch (error) {
      console.error("Error fetching records:", error)
      toast
    } finally {
      setLoading(false)
    }
  }

  const handleLogOut=() => () => {
    localStorage.removeItem("parking_id")
    router.push("/parkingLogin")
  }


  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (record: VehicleRecord) => {
    if (record.suspected) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          SUSPECTED
        </Badge>
      )
    }

    if (record.in_parking) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          SAFE
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
        <XCircle className="w-3 h-3 mr-1" />
        EXITED
      </Badge>
    )
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Park-EYE : Record Manager</h1>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <Button onClick={handleLogOut()} className="bg-red-500 hover:bg-red-700">Logout</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Currently Inside</p>
                  <p className="text-2xl font-bold text-green-600">{stats.inside}</p>
                </div>
                <Car className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspected Vehicles</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspected}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records List */}
        {records.length === 0 ? (
          <Card>
            <CardContent className="p-0">
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card
                key={record.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  record.suspected ? "border-red-300 bg-red-50 shadow-red-100" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CardContent className="py-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${record.suspected ? "bg-red-100" : "bg-blue-100"}`}>
                          <Car className={`w-5 h-5 ${record.suspected ? "text-red-600" : "text-blue-600"}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{record.regs_no}</h3>
                          
                        </div>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Entry: {formatDateTime(record.in_date_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {record.out_date_time ? (
                            <span>Exit: {formatDateTime(record.out_date_time)}</span>
                          ) : (
                            <span className="text-green-600 font-medium">Inside</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {record.slot_position && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Slot: {record.slot_position}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">{getStatusBadge(record)}</div>
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
