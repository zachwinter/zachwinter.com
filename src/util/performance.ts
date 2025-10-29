/**
 * Performance monitoring utilities for GPU vs CPU comparisons
 */

interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  mode: 'CPU' | 'GPU'
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxSamples: number = 100
  private enabled: boolean = false

  enable() {
    this.enabled = true
    console.log('[PerformanceMonitor] Enabled')
  }

  disable() {
    this.enabled = false
    console.log('[PerformanceMonitor] Disabled')
  }

  async measure<T>(
    name: string,
    mode: 'CPU' | 'GPU',
    fn: () => T | Promise<T>
  ): Promise<T> {
    if (!this.enabled) {
      return await fn()
    }

    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start

    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      mode
    })

    // Keep only recent samples
    if (this.metrics.length > this.maxSamples) {
      this.metrics.shift()
    }

    return result
  }

  getStats(name?: string, mode?: 'CPU' | 'GPU') {
    let samples = this.metrics

    if (name) {
      samples = samples.filter((m) => m.name === name)
    }

    if (mode) {
      samples = samples.filter((m) => m.mode === mode)
    }

    if (samples.length === 0) {
      return null
    }

    const durations = samples.map((m) => m.duration)
    const sum = durations.reduce((a, b) => a + b, 0)
    const avg = sum / durations.length
    const min = Math.min(...durations)
    const max = Math.max(...durations)
    const median = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)]

    return {
      count: samples.length,
      avg: avg.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      median: median.toFixed(2)
    }
  }

  compare(name: string) {
    const cpuStats = this.getStats(name, 'CPU')
    const gpuStats = this.getStats(name, 'GPU')

    if (!cpuStats || !gpuStats) {
      return null
    }

    const speedup = (parseFloat(cpuStats.avg) / parseFloat(gpuStats.avg)).toFixed(2)

    return {
      cpu: cpuStats,
      gpu: gpuStats,
      speedup: `${speedup}x faster`,
      winner: parseFloat(cpuStats.avg) > parseFloat(gpuStats.avg) ? 'GPU' : 'CPU'
    }
  }

  report() {
    if (!this.enabled || this.metrics.length === 0) {
      console.log('[PerformanceMonitor] No data collected')
      return
    }

    console.group('[PerformanceMonitor] Report')

    // Group by name
    const names = [...new Set(this.metrics.map((m) => m.name))]

    for (const name of names) {
      const comparison = this.compare(name)
      if (comparison) {
        console.group(name)
        console.log('CPU:', comparison.cpu)
        console.log('GPU:', comparison.gpu)
        console.log('Winner:', comparison.winner, comparison.speedup)
        console.groupEnd()
      } else {
        console.log(name, this.getStats(name))
      }
    }

    console.groupEnd()
  }

  clear() {
    this.metrics = []
    console.log('[PerformanceMonitor] Cleared')
  }
}

export const perfMonitor = new PerformanceMonitor()

// Expose globally for debugging
if (typeof window !== 'undefined') {
  ;(window as any).perfMonitor = perfMonitor
}
