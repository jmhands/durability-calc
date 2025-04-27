"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { calculateDurability } from "@/lib/durability"
import { DurabilityResults } from "@/components/durability-results"
import { ConfigurationInfo } from "@/components/configuration-info"
import { AlertTriangle } from "lucide-react"

export default function DurabilityCalculator() {
  // Storage configuration options
  const [storageType, setStorageType] = useState("erasure")
  const [dataShards, setDataShards] = useState(10)
  const [parityShards, setParityShards] = useState(4)
  const [annualFailureRate, setAnnualFailureRate] = useState(0.0044) // 0.44% default
  const [rebuildTimeHours, setRebuildTimeHours] = useState(24) // 24 hours default
  const [results, setResults] = useState(null)

  // Calculate MTBF in hours from AFR
  const calculateMTBF = (afr) => {
    // MTBF = (1 / AFR) * hours in a year
    return Math.round((1 / afr) * 8760)
  }

  // Calculate durability when parameters change
  useEffect(() => {
    const rebuildTimeDays = rebuildTimeHours / 24
    let totalShards = 0
    let minShards = 0

    // Configure shards based on storage type
    if (storageType === "raid1") {
      totalShards = 2
      minShards = 1
    } else if (storageType === "raid5") {
      totalShards = dataShards + 1
      minShards = dataShards
    } else if (storageType === "raid6") {
      totalShards = dataShards + 2
      minShards = dataShards
    } else if (storageType === "raid10") {
      totalShards = dataShards * 2
      minShards = dataShards
    } else if (storageType === "erasure") {
      totalShards = dataShards + parityShards
      minShards = dataShards
    }

    const durabilityData = calculateDurability(totalShards, minShards, annualFailureRate, rebuildTimeDays)

    setResults(durabilityData)
  }, [storageType, dataShards, parityShards, annualFailureRate, rebuildTimeHours])

  // Handle storage type change
  const handleStorageTypeChange = (value) => {
    setStorageType(value)

    // Set sensible defaults for each storage type
    if (value === "raid1") {
      setDataShards(1)
      setParityShards(1)
    } else if (value === "raid5") {
      setDataShards(4)
      setParityShards(1)
    } else if (value === "raid6") {
      setDataShards(4)
      setParityShards(2)
    } else if (value === "raid10") {
      setDataShards(4)
      setParityShards(4)
    } else if (value === "erasure") {
      setDataShards(10)
      setParityShards(4)
    }
  }

  // Calculate MTBF
  const mtbfHours = calculateMTBF(annualFailureRate)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-3">
            Cloud Storage Durability Calculator
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Calculate the durability of your storage system based on configuration and failure rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="text-2xl">Storage Configuration</CardTitle>
              <CardDescription className="text-indigo-100">
                Configure your storage parameters to calculate durability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label htmlFor="storage-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Storage Type
                </Label>
                <Select value={storageType} onValueChange={handleStorageTypeChange}>
                  <SelectTrigger
                    id="storage-type"
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                  >
                    <SelectValue placeholder="Select storage type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                    <SelectItem value="raid1" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      RAID 1 (Mirroring)
                    </SelectItem>
                    <SelectItem value="raid5" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      RAID 5 (Single Parity)
                    </SelectItem>
                    <SelectItem value="raid6" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      RAID 6 (Double Parity)
                    </SelectItem>
                    <SelectItem value="raid10" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      RAID 10 (Striped Mirrors)
                    </SelectItem>
                    <SelectItem value="erasure" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Erasure Coding
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {storageType === "erasure" && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="data-shards" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Data Shards:{" "}
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{dataShards}</span>
                    </Label>
                    <Select
                      value={dataShards.toString()}
                      onValueChange={(value) => setDataShards(Number.parseInt(value))}
                    >
                      <SelectTrigger
                        id="data-shards"
                        className="w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      >
                        <SelectValue placeholder="Select data shards" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                          <SelectItem
                            key={num}
                            value={num.toString()}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="parity-shards" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Parity Shards:{" "}
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{parityShards}</span>
                    </Label>
                    <Select
                      value={parityShards.toString()}
                      onValueChange={(value) => setParityShards(Number.parseInt(value))}
                    >
                      <SelectTrigger
                        id="parity-shards"
                        className="w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                      >
                        <SelectValue placeholder="Select parity shards" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <SelectItem
                            key={num}
                            value={num.toString()}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {["raid5", "raid6"].includes(storageType) && (
                <div className="space-y-3">
                  <Label htmlFor="data-shards" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data Shards:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{dataShards}</span>
                  </Label>
                  <Select
                    value={dataShards.toString()}
                    onValueChange={(value) => setDataShards(Number.parseInt(value))}
                  >
                    <SelectTrigger
                      id="data-shards"
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                    >
                      <SelectValue placeholder="Select data shards" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {storageType === "raid10" && (
                <div className="space-y-3">
                  <Label htmlFor="data-shards" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Number of Mirrors:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{dataShards}</span>
                  </Label>
                  <Select
                    value={dataShards.toString()}
                    onValueChange={(value) => setDataShards(Number.parseInt(value))}
                  >
                    <SelectTrigger
                      id="data-shards"
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                    >
                      <SelectValue placeholder="Select number of mirrors" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="afr-slider" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Annual Failure Rate (AFR)
                    </Label>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      MTBF: {mtbfHours.toLocaleString()} hours
                    </div>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {(annualFailureRate * 100).toFixed(2)}%
                  </span>
                </div>
                <Slider
                  id="afr-slider"
                  min={0.001}
                  max={0.2}
                  step={0.001}
                  value={[annualFailureRate]}
                  onValueChange={(value) => setAnnualFailureRate(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>0.1%</span>
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                  <span>20%</span>
                </div>

                {annualFailureRate > 0.05 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg mt-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                        High Failure Rate Warning
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        An AFR of {(annualFailureRate * 100).toFixed(2)}% is higher than typical enterprise drives (0.5%
                        to 5%). This may lead to unrealistic durability estimates.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rebuild-time" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Rebuild Time
                  </Label>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {rebuildTimeHours} hours
                  </span>
                </div>
                <Slider
                  id="rebuild-time"
                  min={1}
                  max={168}
                  step={1}
                  value={[rebuildTimeHours]}
                  onValueChange={(value) => setRebuildTimeHours(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>1h</span>
                  <span>24h</span>
                  <span>48h</span>
                  <span>96h</span>
                  <span>168h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <ConfigurationInfo
              storageType={storageType}
              dataShards={dataShards}
              parityShards={parityShards}
              annualFailureRate={annualFailureRate}
              rebuildTimeHours={rebuildTimeHours}
              mtbfHours={mtbfHours}
            />

            {results && <DurabilityResults results={results} />}
          </div>
        </div>
      </div>
    </div>
  )
}

