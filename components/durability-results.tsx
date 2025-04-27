"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Check } from "lucide-react"

export function DurabilityResults({ results }) {
  // Find the threshold result (where data loss would occur)
  const thresholdResult = results.results.find((r) => r.isThreshold)
  const [copied, setCopied] = useState(false)

  // Function to determine durability color based on nines
  const getDurabilityColor = (nines) => {
    if (nines >= 10) return "text-emerald-600 dark:text-emerald-400"
    if (nines >= 6) return "text-green-600 dark:text-green-400"
    if (nines >= 3) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  // Format durability to match the number of nines
  const formatDurabilityDisplay = (durability, nines) => {
    if (!durability || !nines) return "N/A"

    // For X nines, the durability should be 0.999...X times
    // This ensures we don't show 1.000000 when it should be 0.999999
    const formattedDurability =
      durability >= 0.999999 && durability < 1 ? "0." + "9".repeat(nines) : durability.toFixed(nines)

    return formattedDurability
  }

  // Copy full durability to clipboard
  const copyDurability = () => {
    if (!thresholdResult) return

    const fullDurability = thresholdResult.durability.toString()
    navigator.clipboard.writeText(fullDurability)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <CardTitle className="text-2xl">Durability Results</CardTitle>
        <CardDescription className="text-emerald-100">
          Calculated durability metrics for your storage configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              Annual Durability
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={copyDurability}
                      className="inline-flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy durability</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{copied ? "Copied!" : "Click to copy full durability value"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="flex items-center gap-2">
              <div className={`text-4xl font-bold ${getDurabilityColor(thresholdResult?.nines)}`}>
                {thresholdResult ? `${thresholdResult.nines} nines` : "N/A"}
              </div>
            </div>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium">
              {thresholdResult ? formatDurabilityDisplay(thresholdResult.durability, thresholdResult.nines) : "N/A"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Data Loss Probability</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white">
              {thresholdResult ? thresholdResult.annualOdds : "N/A"}
            </div>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium">
              {thresholdResult ? `${thresholdResult.annualLossRate.toExponential(3)} per year` : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

