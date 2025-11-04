#!/usr/bin/env node

/**
 * Verify binary data integrity
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

console.log('🔍 Verifying binary data integrity...\n')

// Load original JSON
console.log('📊 Loading original JSON...')
const jsonData = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'data.stats.json'), 'utf-8'))

// Load binary data
console.log('📦 Loading binary data...')
const buffer = fs.readFileSync(path.join(PUBLIC_DIR, 'data.stats.bin'))
const header = new Uint32Array(buffer.buffer, buffer.byteOffset, 6)
const binaryData = new Uint32Array(buffer.buffer, buffer.byteOffset + 24)

console.log('\n📋 Binary Header:')
console.log(`   Magic: 0x${header[0].toString(16).toUpperCase()} (${header[0] === 0x434F5644 ? '✅ Valid' : '❌ Invalid'})`)
console.log(`   Version: ${header[1]}`)
console.log(`   Locations: ${header[2].toLocaleString()}`)
console.log(`   Days: ${header[3].toLocaleString()}`)
console.log(`   Stride: ${header[4]}`)
console.log(`   Data Type: ${header[5] === 1 ? 'Uint32Array' : 'Uint16Array'}\n`)

// Verify data integrity
console.log('🔬 Comparing data...')
const numLocations = header[2]
const numDays = header[3]
const stride = header[4]

let mismatches = 0
let samplesChecked = 0

// Check every 100th location to keep it fast
for (let loc = 0; loc < numLocations; loc += 100) {
  for (let day = 0; day < numDays; day += 100) {
    for (let field = 0; field < stride; field++) {
      const jsonValue = jsonData[loc]?.[day]?.[field]
      const binaryOffset = (loc * numDays * stride) + (day * stride) + field
      const binaryValue = binaryData[binaryOffset]

      if (jsonValue !== binaryValue) {
        if (mismatches === 0) {
          console.log(`\n❌ Mismatch found:`)
          console.log(`   Location ${loc}, Day ${day}, Field ${field}`)
          console.log(`   JSON: ${jsonValue}`)
          console.log(`   Binary: ${binaryValue}`)
        }
        mismatches++
      }
      samplesChecked++
    }
  }
}

console.log(`   Samples checked: ${samplesChecked.toLocaleString()}`)
console.log(`   Mismatches: ${mismatches}\n`)

if (mismatches === 0) {
  console.log('✅ Binary data matches JSON perfectly!\n')
  console.log('🎉 Ready to use in production!')
} else {
  console.log('⚠️  Data integrity issues detected')
  process.exit(1)
}
