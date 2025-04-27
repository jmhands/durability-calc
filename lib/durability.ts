/**
 * Calculates factorial of a number
 */
function factorial(n: number): number {
  if (n === 0) return 1
  let result = 1
  for (let i = 1; i <= n; i++) {
    result *= i
  }
  return result
}

/**
 * Calculates binomial coefficient (n choose k)
 */
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1

  // Use a more numerically stable algorithm for large numbers
  let result = 1
  for (let i = 1; i <= k; i++) {
    result *= n - (k - i)
    result /= i
  }
  return result
}

/**
 * Calculates binomial probability
 */
function binomialProbability(k: number, n: number, p: number): number {
  return choose(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

/**
 * Calculates probability of failure in any period
 */
function probabilityOfFailureInAnyPeriod(p: number, n: number): number {
  if (p < 0.01) {
    // For tiny numbers, use a more precise calculation
    const nInt = Math.floor(n)
    let result = 0.0
    let sign = 1

    for (let i = 1; i <= nInt; i++) {
      const pExpI = Math.pow(p, i)
      if (pExpI !== 0) {
        result += sign * choose(nInt, i) * pExpI
      }
      sign = -sign
    }

    // Adjust for fractional part
    result = 1.0 - Math.pow(1.0 - p, n - nInt) + result * Math.pow(1.0 - p, n - nInt)
    return result
  } else {
    return 1.0 - Math.pow(1.0 - p, n)
  }
}

/**
 * Counts the number of nines in durability
 */
function countNines(lossRate: number): number {
  if (lossRate === 0) return 15 // Cap at 15 nines for perfect durability

  let nines = 0
  let powerOfTen = 0.1

  while (true) {
    if (powerOfTen < lossRate) {
      return nines
    }
    powerOfTen /= 10.0
    nines += 1
    if (powerOfTen === 0.0 || nines >= 15) {
      return nines
    }
  }
}

/**
 * Formats probability as a human-readable string
 */
function prettyProbability(p: number): string {
  if (Math.abs(p - 1.0) < 0.01) {
    return "always"
  }

  const scaleTable = [
    [1, "ten"],
    [2, "a hundred"],
    [3, "a thousand"],
    [6, "a million"],
    [9, "a billion"],
    [12, "a trillion"],
    [15, "a quadrillion"],
    [18, "a quintillion"],
    [21, "a sextillion"],
    [24, "a septillion"],
    [27, "an octillion"],
  ]

  for (const [power, name] of scaleTable) {
    const count = p * Math.pow(10, power)
    if (count >= 0.9) {
      return `${Math.round(count)} in ${name}`
    }
  }

  return "NEVER"
}

/**
 * Main function to calculate durability
 */
export function calculateDurability(
  totalShards: number,
  minShards: number,
  annualShardFailureRate: number,
  shardReplacementDays: number,
) {
  const numPeriods = 365.0 / shardReplacementDays
  const failureRatePerPeriod = annualShardFailureRate / numPeriods
  const failureProbabilityPerPeriod = 1.0 - Math.exp(-failureRatePerPeriod)

  const results = []
  let periodCumulativeProb = 0.0

  for (let failedShards = totalShards; failedShards >= 0; failedShards--) {
    const periodFailureProb = binomialProbability(failedShards, totalShards, failureProbabilityPerPeriod)

    periodCumulativeProb += periodFailureProb
    const annualLossProb = probabilityOfFailureInAnyPeriod(periodCumulativeProb, numPeriods)

    const nines = countNines(annualLossProb)
    const isThreshold = failedShards === totalShards - minShards + 1

    results.push({
      failureThreshold: failedShards,
      individualProb: periodFailureProb,
      cumulativeProb: periodCumulativeProb,
      cumulativeOdds: prettyProbability(periodCumulativeProb),
      annualLossRate: annualLossProb,
      annualOdds: prettyProbability(annualLossProb),
      durability: 1.0 - annualLossProb,
      nines: nines,
      isThreshold: isThreshold,
    })
  }

  return {
    results,
    config: {
      totalShards,
      minShards,
      annualShardFailureRate,
      shardReplacementDays,
    },
  }
}

