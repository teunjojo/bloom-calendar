import type { ForecastFilter } from '@/types/ForecastFilter'
import type { Forecast } from '@/types/Forecast'

let eventsCache: Forecast[] | null = null

async function loadForecasts(): Promise<Forecast[]> {
  if (!eventsCache) {
    const res = await fetch('/data/forecasts.json')
    eventsCache = await res.json() as Forecast[]
  }
  return eventsCache
}

// Extract keys of Forecast for typed sorting
type EventKey = keyof Forecast

export const getForecasts = async (filters: ForecastFilter = {}): Promise<Forecast[]> => {
  const events = await loadForecasts()

  let result = events.filter((event: Forecast): boolean => {
    // === Simple equality filters ===
    if (filters.eventType && event.eventType !== filters.eventType) {
      return false
    }

    // === currentDate ===
    if (filters.currentDate) {
      const current = new Date(filters.currentDate)
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)

      if (!(start < current)) return false
      if (!(end > current)) return false
    }

    // === afterDate ===
    if (filters.afterDate) {
      const after = new Date(filters.afterDate)
      const start = new Date(event.startDate)

      if (!(start > after)) return false
    }

    return true
  })

  // === Sorting ===
  if (filters.sortBy) {
    const key = filters.sortBy as EventKey
    const direction = filters.sortOrder === 'DESC' ? -1 : 1

    result = [...result].sort((a: Forecast, b: Forecast): number => {
      const av = a[key]
      const bv = b[key]

      // Handle undefined values safely
      if (av == null && bv != null) return -1 * direction
      if (av != null && bv == null) return 1 * direction
      if (av == null && bv == null) return 0

      // If values are dates or date strings
      if (typeof av === 'string' && typeof bv === 'string') {
        // Consider sortable only if valid dates
        const aDate = new Date(av)
        const bDate = new Date(bv)

        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return (aDate.getTime() - bDate.getTime()) * direction
        }
      }

      // Number comparison
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * direction
      }

      // String comparison
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * direction
      }

      // Fallback — as string compare
      return String(av).localeCompare(String(bv)) * direction
    })
  }

  // === Pagination ===
  if (typeof filters.offset === 'number') {
    result = result.slice(filters.offset)
  }

  if (typeof filters.limit === 'number') {
    result = result.slice(0, filters.limit)
  }

  return result
}
