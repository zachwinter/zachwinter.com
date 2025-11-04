/**
 * Binary data loader for COVID stats
 *
 * Loads pre-converted binary files instead of JSON for massive performance gains:
 * - 78% smaller file size (46MB → 10MB gzipped)
 * - Zero JSON parsing overhead
 * - Direct ArrayBuffer → Uint32Array (zero-copy)
 */

export interface BinaryStatsHeader {
  magic: number        // 0x434F5644 ('COVD')
  version: number      // 1
  numLocations: number
  numDays: number
  stride: number       // 3 (cases, deaths, active)
  dataType: number     // 0 = Uint16, 1 = Uint32
}

export interface BinaryStats {
  header: BinaryStatsHeader
  data: Uint32Array | Uint16Array
}

/**
 * Load binary stats data
 */
export async function loadBinaryStats(url: string = '/data.stats.bin'): Promise<BinaryStats> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.statusText}`)
  }

  const buffer = await response.arrayBuffer()

  // Parse header (24 bytes)
  const headerView = new Uint32Array(buffer, 0, 6)
  const header: BinaryStatsHeader = {
    magic: headerView[0],
    version: headerView[1],
    numLocations: headerView[2],
    numDays: headerView[3],
    stride: headerView[4],
    dataType: headerView[5]
  }

  // Validate magic number
  if (header.magic !== 0x434F5644) {
    throw new Error('Invalid binary stats file: bad magic number')
  }

  // Validate version
  if (header.version !== 1) {
    throw new Error(`Unsupported binary stats version: ${header.version}`)
  }

  // Create typed array view of data
  const HEADER_SIZE = 24
  const data = header.dataType === 1
    ? new Uint32Array(buffer, HEADER_SIZE)
    : new Uint16Array(buffer, HEADER_SIZE)

  return { header, data }
}

/**
 * Get value for a specific location, day, and field
 *
 * @param data Binary stats data
 * @param locationIndex Location index (0 to numLocations-1)
 * @param dayIndex Day index (0 to numDays-1)
 * @param fieldIndex Field index (0=cases, 1=deaths, 2=active)
 */
export function getStatsValue(
  data: BinaryStats,
  locationIndex: number,
  dayIndex: number,
  fieldIndex: number
): number {
  const { header } = data
  const offset = (locationIndex * header.numDays * header.stride) + (dayIndex * header.stride) + fieldIndex
  return data.data[offset]
}

/**
 * Get all values for a specific location and day
 * Returns [cases, deaths, active]
 */
export function getStatsDay(
  data: BinaryStats,
  locationIndex: number,
  dayIndex: number
): [number, number, number] {
  const { header } = data
  const offset = (locationIndex * header.numDays * header.stride) + (dayIndex * header.stride)
  return [
    data.data[offset],
    data.data[offset + 1],
    data.data[offset + 2]
  ]
}

/**
 * Get all days for a specific location
 * Returns array of [cases, deaths, active] for each day
 */
export function getStatsLocation(
  data: BinaryStats,
  locationIndex: number
): [number, number, number][] {
  const { header } = data
  const result: [number, number, number][] = []

  for (let day = 0; day < header.numDays; day++) {
    result.push(getStatsDay(data, locationIndex, day))
  }

  return result
}
