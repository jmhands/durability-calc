import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Shield, ShieldCheck, Layers, HardDrive } from "lucide-react"

interface ConfigurationInfoProps {
  storageType: string
  dataShards: number
  parityShards: number
  annualFailureRate: number
  rebuildTimeHours: number
  mtbfHours: number
}

export function ConfigurationInfo({
  storageType,
  dataShards,
  parityShards,
  annualFailureRate,
  rebuildTimeHours,
  mtbfHours,
}: ConfigurationInfoProps) {
  // Get configuration details based on storage type
  const getConfigDetails = () => {
    switch (storageType) {
      case "raid1":
        return {
          title: "RAID 1 (Mirroring)",
          description: "Data is mirrored across two drives. Can survive one drive failure.",
          totalShards: 2,
          minShards: 1,
          maxFailures: 1,
          icon: <Copy className="h-6 w-6" />,
        }
      case "raid5":
        return {
          title: "RAID 5 (Single Parity)",
          description: "Distributes parity across all drives. Can survive one drive failure.",
          totalShards: dataShards + 1,
          minShards: dataShards,
          maxFailures: 1,
          icon: <Shield className="h-6 w-6" />,
        }
      case "raid6":
        return {
          title: "RAID 6 (Double Parity)",
          description: "Uses two parity blocks. Can survive two drive failures.",
          totalShards: dataShards + 2,
          minShards: dataShards,
          maxFailures: 2,
          icon: <ShieldCheck className="h-6 w-6" />,
        }
      case "raid10":
        return {
          title: "RAID 10 (Striped Mirrors)",
          description:
            "Combines mirroring and striping. Can survive multiple drive failures if they occur in different mirrors.",
          totalShards: dataShards * 2,
          minShards: dataShards,
          maxFailures: dataShards,
          icon: <HardDrive className="h-6 w-6" />,
        }
      case "erasure":
        return {
          title: "Erasure Coding",
          description: "Data is split into data and parity shards. Can survive parity shard failures.",
          totalShards: dataShards + parityShards,
          minShards: dataShards,
          maxFailures: parityShards,
          icon: <Layers className="h-6 w-6" />,
        }
      default:
        return {
          title: "Unknown Configuration",
          description: "",
          totalShards: 0,
          minShards: 0,
          maxFailures: 0,
          icon: <HardDrive className="h-6 w-6" />,
        }
    }
  }

  const config = getConfigDetails()

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">{config.icon}</div>
          <div>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription className="text-blue-100 mt-1">{config.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Shards</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{config.totalShards}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Min Shards Needed</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{config.minShards}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Max Failures Tolerated</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{config.maxFailures}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Rebuild Time</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{rebuildTimeHours}h</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 dark:text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">Drive Reliability</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-500">Annual Failure Rate</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                {(annualFailureRate * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-500">Mean Time Between Failures</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                {mtbfHours.toLocaleString()} hours
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

