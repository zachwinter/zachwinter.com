#!/usr/bin/env node

/**
 * Convert COVID JSON data to binary format for faster loading
 *
 * Converts:
 * - data.stats.json (46MB) → data.stats.bin (~14MB gzipped)
 * - Eliminates JSON parsing overhead
 * - Direct ArrayBuffer → Uint32Array (zero-copy)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { gzipSync } from 'zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

console.log('🔄 Converting COVID data to binary format...\n')

// ============================================================================
// 1. Convert stats data (the big one)
// ============================================================================

console.log('📊 Loading data.stats.json...')
const stats = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'data.stats.json'), 'utf-8'))

const numLocations = stats.length
const numDays = stats[0].length
const stride = 3 // [cases, deaths, active]

console.log(`   Locations: ${numLocations.toLocaleString()}`)
console.log(`   Days: ${numDays.toLocaleString()}`)
console.log(`   Values per day: ${stride}`)
console.log(`   Total values: ${(numLocations * numDays * stride).toLocaleString()}\n`)

// Check max value to determine if we can use smaller types
let maxValue = 0
for (let i = 0; i < numLocations; i++) {
  for (let j = 0; j < numDays; j++) {
    for (let k = 0; k < stride; k++) {
      maxValue = Math.max(maxValue, stats[i][j][k])
    }
  }
}

console.log(`   Max value: ${maxValue.toLocaleString()}`)

// Choose array type based on max value
// COVID data is integers, so use Uint types
const useUint32 = maxValue > 65535
const ArrayType = useUint32 ? Uint32Array : Uint16Array
const bytesPerValue = useUint32 ? 4 : 2

console.log(`   Using: ${ArrayType.name} (${bytesPerValue} bytes per value)\n`)

// Create binary buffer with header
// Header format:
//   [0-3]   Magic number: 0x434F5644 ('COVD')
//   [4-7]   Version: 1
//   [8-11]  Num locations (uint32)
//   [12-15] Num days (uint32)
//   [16-19] Stride (uint32)
//   [20-23] Data type (0 = Uint16, 1 = Uint32)
//   [24+]   Data

const HEADER_SIZE = 24
const dataSize = numLocations * numDays * stride * bytesPerValue
const buffer = new ArrayBuffer(HEADER_SIZE + dataSize)
const header = new Uint32Array(buffer, 0, 6)
const data = new ArrayType(buffer, HEADER_SIZE)

// Write header
header[0] = 0x434F5644 // 'COVD'
header[1] = 1           // version
header[2] = numLocations
header[3] = numDays
header[4] = stride
header[5] = useUint32 ? 1 : 0

// Write data (flatten 3D array to 1D)
let offset = 0
for (let i = 0; i < numLocations; i++) {
  for (let j = 0; j < numDays; j++) {
    for (let k = 0; k < stride; k++) {
      data[offset++] = stats[i][j][k]
    }
  }
}

console.log('💾 Writing data.stats.bin...')
const statsPath = path.join(PUBLIC_DIR, 'data.stats.bin')
fs.writeFileSync(statsPath, Buffer.from(buffer))

const statsSize = fs.statSync(statsPath).size
console.log(`   Uncompressed: ${(statsSize / 1024 / 1024).toFixed(2)} MB`)

// Write gzipped version
const gzipped = gzipSync(Buffer.from(buffer), { level: 9 })
const gzipPath = path.join(PUBLIC_DIR, 'data.stats.bin.gz')
fs.writeFileSync(gzipPath, gzipped)

const gzipSize = fs.statSync(gzipPath).size
console.log(`   Gzipped: ${(gzipSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Compression ratio: ${(gzipSize / statsSize * 100).toFixed(1)}%\n`)

// ============================================================================
// 2. Keep collection as JSON (it's small and needs string data)
// ============================================================================

console.log('📍 data.collection.json - keeping as JSON (contains strings)')
const collectionSize = fs.statSync(path.join(PUBLIC_DIR, 'data.collection.json')).size
console.log(`   Size: ${(collectionSize / 1024).toFixed(1)} KB\n`)

// ============================================================================
// Summary
// ============================================================================

const originalSize = fs.statSync(path.join(PUBLIC_DIR, 'data.stats.json')).size
const savings = originalSize - gzipSize
const savingsPercent = (savings / originalSize * 100).toFixed(1)

console.log('✅ Conversion complete!\n')
console.log('📈 Results:')
console.log(`   Original JSON: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Binary (gzipped): ${(gzipSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   Savings: ${(savings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`)
console.log(`   Plus: Zero JSON parsing overhead!\n`)

console.log('🎯 Next steps:')
console.log('   1. Update CovidMap.ts to load data.stats.bin')
console.log('   2. Configure Vite to serve .bin files')
console.log('   3. Test with dev server\n')
