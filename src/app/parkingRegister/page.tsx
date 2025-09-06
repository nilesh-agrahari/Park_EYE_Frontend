"use client"

import { useEffect, useState } from "react"

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vehicles/")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Vehicle Records</h1>
      
      <ul>
        
        {vehicles.map((v: any) => (
          <li key={v.id}>
            {v.regs_no} — {v.in_date_time} —  — {v.in_parking ? "Inside" : v.out_date_time} — {v.slot_position}
          </li>
        ))}
      </ul>
    </div>
  )
}
