import * as topojson from 'topojson-client'
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom'
import { scaleLinear } from 'd3-scale'
import { GeoProjection, geoAlbersUsa, geoPath, geoDistance } from 'd3-geo'
import { select, type Selection } from 'd3-selection'
import Sprite from './Sprite'
import { interpolateNumber, interpolateZoom } from 'd3-interpolate'
import { ease } from '../util/easing'
import { loadBinaryStats, type BinaryStats } from '../util/binary-loader'
import { buildSpritesOptimized } from '../util/sprite-renderer'
import { calculateCoordinatesOptimized, buildProjectionSync } from '../util/coordinate-calculator'
type CanvasName = 'map' | 'datums' | 'cursor'
type Canvases = Record<CanvasName, HTMLCanvasElement>
type SpriteName = 'map' | 'datum'
type ColorValueHex = `#${string}`
type ScaleName = 'viewport' | 'size' | 'feature' | 'capita'
type Scales = Record<ScaleName, any>

export type Location = {
  fips: string
  city: string
  state: string
  lat: number
  lon: number
  values?: any[]
  population: number
  stateFips: string
}

interface MapConfig {
  canvases: Canvases
  onMouseMove?: Function
  hideToolTip?: Function
  onZoom?: Function
}

interface MapState {
  transform: typeof zoomIdentity
  mouse: [number, number]
  cursorDatum: Location | null
  datasetIndex: number
  perCapita: boolean
  day: number
}

const BACKGROUND_COLOR = '#0F0611'

const BASE_DURATION = 750
const POINT_SIZE = 125
const TARGET_DATUM_SIZE = 125
type ZoomView = [number, number, number]

interface FocusOptions {
  duration?: number
  desiredSize?: number
}

type AniFrame = { start: number; tick: Function | null; interpolators?: any[] }

export default class CovidMap {
  public sprites: Record<SpriteName, Sprite>
  public ctx: Record<CanvasName, CanvasRenderingContext2D>
  public projection: GeoProjection | null
  public scales: Scales
  public state: MapState
  public locations: Location[]
  public totalLocations: number
  public zoom
  public coords: ([number, number] | null)[]
  public transformedCoords: ([number, number] | null)[]
  public raf: number
  public onMouseMove: Function
  public hideToolTip: Function
  public onZoom: Function
  public fipsData: any
  public usa: any
  public last: number[] = []
  public next: number[] = []
  public interpolators: any[] = []
  public tweening: boolean = false
  private canvasSelection: Selection<Element, unknown, null, undefined> | null = null
  private animations: Record<string, AniFrame> = {
    zoom: { start: 0, tick: null },
    tween: { start: 0, tick: null }
  }

  // Data properties
  public loaded: boolean = false
  public locationData: any
  public statsData: BinaryStats | null = null
  public populationData: any
  public stateData: any
  public dayData: any
  public today: Float32Array | null = null
  public yesterday: Float32Array | null = null
  public delta: Float32Array | null = null
  public states: Map<string, Float32Array> = new Map()
  public STATE_FIPS: any
  public DATE_MAP: any
  public dates: any
  public date: any
  public selectedCounties: any[] = []

  // Pre-allocated buffers for performance
  private dataBuffer: Float32Array | null = null
  private stateBuffer: Map<string, Float32Array> = new Map()

  constructor({ canvases, onMouseMove, hideToolTip, onZoom }: MapConfig) {
    this.locations = []
    this.totalLocations = 0
    this.onMouseMove = onMouseMove || (() => {})
    this.hideToolTip = hideToolTip || (() => {})
    this.onZoom = onZoom || (() => {})
    this.raf = 0
    this.state = {
      transform: zoomIdentity,
      mouse: [0, 0],
      cursorDatum: null,
      datasetIndex: 2,
      perCapita: true,
      day: 0
    }
    this.ctx = (Object.keys(canvases) as CanvasName[]).reduce((acc, key: CanvasName) => {
      const ctx: CanvasRenderingContext2D | null = canvases[key].getContext('2d')

      if (ctx) {
        const dpr = window.devicePixelRatio

        ctx.resetTransform()
        ctx.scale(dpr, dpr)

        acc[key] = ctx
      }

      return acc
    }, {} as Record<CanvasName, CanvasRenderingContext2D>)
    this.scales = this.buildScales()
    this.zoom = this.initZoom()
    this.coords = []
    this.transformedCoords = []

    this.initMouse()
    this.paint = this.paint.bind(this)

    const tick = (now: DOMHighResTimeStamp) => {
      if (this.animations.zoom.tick) {
        this.animations.zoom.tick(now)
      }

      if (this.animations.tween.tick) {
        this.animations.tween.tick(now)
      }

      this.raf = requestAnimationFrame(tick)
    }

    this.raf = requestAnimationFrame(tick)
  }

  async fetchData() {
    const [collection, days, map, population, states, stats, usaData] = await Promise.all([
      fetch('/data.collection.json').then((res) => res.json()),
      fetch('/data.days.json').then((res) => res.json()),
      fetch('/data.map.json').then((res) => res.json()),
      fetch('/data.population.json').then((res) => res.json()),
      fetch('/data.states.json').then((res) => res.json()),
      loadBinaryStats('/data.stats.bin'),
      fetch('/data.usa.json').then((res) => res.json())
    ])

    this.fipsData = map
    this.populationData = population
    this.stateData = states
    this.locationData = collection
    this.dayData = days
    this.statsData = stats
    this.usa = usaData
    this.loaded = true
    this.STATE_FIPS = Object.keys(states)
    this.dates = this.dayData?.map((d: string) => new Date(d))
    this.DATE_MAP = this.dates.reduce((acc: any, date: any, i: number) => {
      acc[date.valueOf()] = i
      return acc
    }, {})

    this.locations = collection
    this.totalLocations = this.locations.length

    // Initialize with first date
    this.setDateByIndex(0)

    // Rebuild everything with loaded data
    // Calculate coordinates and build sprites in parallel (both use workers!)
    // Note: Projection is built lazily on first mouse interaction to avoid blocking
    const [coords, sprites] = await Promise.all([
      calculateCoordinatesOptimized(this.size[0], this.size[1], this.usa, this.locations),
      this.buildSprites()
    ])

    this.coords = coords
    this.sprites = sprites
    this.transformedCoords = this.transformDatumCoordinates()
    this.resetZoom()
    this.paint()
  }

  tick() {
    if (!this.locationData || !this.statsData) return

    const numLocations = this.locationData.length
    const stride = 3 // [cases, deaths, active]
    const bufferSize = numLocations * stride

    // Initialize buffers once
    if (!this.dataBuffer) {
      this.dataBuffer = new Float32Array(bufferSize * 3) // today, yesterday, delta
      this.today = this.dataBuffer.subarray(0, bufferSize)
      this.yesterday = this.dataBuffer.subarray(bufferSize, bufferSize * 2)
      this.delta = this.dataBuffer.subarray(bufferSize * 2, bufferSize * 3)

      // Pre-allocate state buffers
      for (const state of this.STATE_FIPS || []) {
        this.stateBuffer.set(state, new Float32Array(6)) // 3 for values, 3 for deltas
      }
    }

    // Clear state accumulator
    for (const buffer of this.stateBuffer.values()) {
      buffer.fill(0)
    }

    // Single pass through all locations
    const day = this.state.day
    const prevDay = Math.max(0, day - 1)
    const binaryData = this.statsData.data
    const numDays = this.statsData.header.numDays

    for (let i = 0; i < numLocations; i++) {
      const location = this.locationData[i]
      const dataIndex = this.fipsData?.[location?.fips]
      const offset = i * stride

      if (dataIndex !== undefined) {
        // Calculate binary data offsets
        // Binary format: [location][day][field]
        const todayOffset = (dataIndex * numDays * stride) + (day * stride)
        const yesterdayOffset = (dataIndex * numDays * stride) + (prevDay * stride)

        // Read today's values
        const todayData = [
          binaryData[todayOffset],
          binaryData[todayOffset + 1],
          binaryData[todayOffset + 2]
        ]

        // Read yesterday's values
        const yesterdayData = day === 0 ? [0, 0, 0] : [
          binaryData[yesterdayOffset],
          binaryData[yesterdayOffset + 1],
          binaryData[yesterdayOffset + 2]
        ]

        // Write today's values
        this.today![offset] = todayData[0]
        this.today![offset + 1] = todayData[1]
        this.today![offset + 2] = todayData[2]

        // Write yesterday's values
        this.yesterday![offset] = yesterdayData[0]
        this.yesterday![offset + 1] = yesterdayData[1]
        this.yesterday![offset + 2] = yesterdayData[2]

        // Calculate and write deltas
        this.delta![offset] = todayData[0] - yesterdayData[0]
        this.delta![offset + 1] = todayData[1] - yesterdayData[1]
        this.delta![offset + 2] = todayData[2] - yesterdayData[2]

        // Accumulate state totals in same pass
        const stateFips = location.stateFips
        if (stateFips && this.stateBuffer.has(stateFips)) {
          const stateData = this.stateBuffer.get(stateFips)!
          stateData[0] += todayData[0]
          stateData[1] += todayData[1]
          stateData[2] += todayData[2]
          stateData[3] += this.delta![offset]
          stateData[4] += this.delta![offset + 1]
          stateData[5] += this.delta![offset + 2]
        }
      }
    }

    // Copy state buffers to public map
    this.states.clear()
    for (const [state, buffer] of this.stateBuffer) {
      this.states.set(state, new Float32Array(buffer))
    }
  }

  getHistoricalCountyValuesByFips(fips: any): any[] {
    if (!this.statsData || !this.fipsData) return []

    const dataIndex = this.fipsData[fips]
    if (dataIndex === undefined) return []

    const binaryData = this.statsData.data
    const numDays = this.statsData.header.numDays
    const stride = this.statsData.header.stride
    const result = []

    // Extract all days for this location
    for (let day = 0; day < numDays; day++) {
      const offset = (dataIndex * numDays * stride) + (day * stride)
      result.push([
        binaryData[offset],
        binaryData[offset + 1],
        binaryData[offset + 2]
      ])
    }

    return result
  }

  getCountyValuesByFips(fips: any): [number, number, number] {
    const index = this.fipsData?.[fips]
    if (!this.today || index === undefined) return [0, 0, 0]
    const offset = index * 3
    return [this.today[offset], this.today[offset + 1], this.today[offset + 2]]
  }

  getCountyDeltasByFips(fips: any): [number, number, number] {
    const index = this.fipsData?.[fips]
    if (!this.delta || index === undefined) return [0, 0, 0]
    const offset = index * 3
    return [this.delta[offset], this.delta[offset + 1], this.delta[offset + 2]]
  }

  getStateValuesByFips(fips: any): [number, number, number] | null {
    const buffer = this.states.get(fips)
    if (!buffer) return null
    return [buffer[0], buffer[1], buffer[2]]
  }

  getStateDeltasByFips(fips: any): [number, number, number] | null {
    const buffer = this.states.get(fips)
    if (!buffer) return null
    return [buffer[3], buffer[4], buffer[5]]
  }

  getStatePopulationByFips(fips: string) {
    return this.populationData?.states?.[fips] || null
  }

  getStateDataByFips(fips: string) {
    return {
      values: [this.getStateValuesByFips(fips), this.getStateDeltasByFips(fips)],
      population: this.getStatePopulationByFips(fips)
    }
  }

  setDateByIndex(i: number) {
    if (this.state.day === i) {
      console.log('[CovidMap] Already on day', i, '- skipping update')
      return
    }
    console.log('[CovidMap] setDateByIndex:', i)
    this.state.day = i
    this.date = this.dates?.[this.state.day]
    this.tick()
    this.update()
  }

  setDateByDateObject(d: Date) {
    const targetDay = this.DATE_MAP?.[d.valueOf()]
    if (this.state.day === targetDay) {
      console.log('[CovidMap] Already on date', d, '- skipping update')
      return
    }
    console.log('[CovidMap] setDateByDateObject:', d, 'day:', targetDay)
    this.state.day = targetDay
    this.date = this.dates?.[this.state.day]
    this.tick()
    this.update()
  }

  chooseExample(example: string) {
    if (example) {
      const day = example.slice(2, 4)
      const month = example.slice(0, 2)
      const year = example.slice(-4)
      const date = new Date(`${month}/${day}/${year}`)
      if (date) this.setDateByDateObject(date)
    }
  }

  selectExample(index: number) {
    // Map indices to example dates (Nov 2020, Aug 2021, Dec 2021)
    const examples = ['11012020', '08012021', '12012021']
    const example = examples[index]
    if (example) {
      this.chooseExample(example)
    }
  }

  getCountyByFips(fips: string): Location {
    return this.locationData?.[this.fipsData?.[fips]]
  }

  selectCountyByFips(fips: string) {
    const county = this.getCountyByFips(fips)
    const index: number = this.selectedCounties.indexOf(county)
    if (index === -1) {
      this.selectedCounties.push(county)
    } else {
      this.selectedCounties = this.selectedCounties.filter((v: Location) => county.fips !== v.fips)
    }
  }

  get size() {
    const dpr = window.devicePixelRatio
    return [this.ctx.map.canvas.width / dpr, this.ctx.map.canvas.height / dpr, dpr]
  }

  get day() {
    return this.state.day
  }

  set day(value: number) {
    this.setDateByIndex(value)
  }

  buildProjection(): GeoProjection | null {
    const [width, height] = this.size
    this.state.transform = zoomIdentity

    if (!this.usa || !this.loaded) return null

    return buildProjectionSync(width, height, this.usa)
  }

  transformDatumCoordinates(): ([number, number] | null)[] {
    let i = 0

    const coordinates = []

    for (; i < this.totalLocations; i++) {
      if (this.coords[i] === null) {
        coordinates.push(null)
      } else {
        const coords = this.state.transform.apply(this.coords[i] as [number, number])
        coordinates.push(coords)
      }
    }

    return coordinates
  }

  buildScales(): Scales {
    const viewport = scaleLinear([0, 1920], [0.5, 1])
    const scale = viewport(this.size[0])

    const size = scaleLinear([1, 100, 1000, 10000], [1 * scale, 2 * scale, 15 * scale, 50 * scale])
    const capita = scaleLinear([0, 0.1, 0.25, 1], [1 * scale, 2 * scale, 3 * scale, 20 * scale])
    const feature = scaleLinear([0, 1920], [0, 5])

    return {
      viewport,
      size,
      feature,
      capita
    }
  }

  async buildSprites(): Promise<Record<SpriteName, Sprite>> {
    const [width, height] = this.size
    const { usa } = this

    this.sprites?.map?.destroy()
    this.sprites?.datum?.destroy()

    if (!this.loaded || !usa) {
      return {
        map: new Sprite({ width: 1, height: 1, paint: () => {} }),
        datum: new Sprite({ width: POINT_SIZE, height: POINT_SIZE, paint: () => {} })
      }
    }

    // Use optimized sprite rendering (worker when available, fallback to main thread)
    // Note: projection can be null here if called in parallel - worker rebuilds it anyway
    return buildSpritesOptimized(width, height, usa, this.projection)
  }

  initZoom(): ZoomBehavior<Element, unknown> {
    const [width, height] = this.size
    const canvas = select('canvas.cursor')
    this.canvasSelection = canvas

    this.zoom?.transform?.(canvas as any, zoomIdentity)
    this.zoom?.on?.('zoom', null)

    canvas.on('zoom', null)

    const _zoom = zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height]
      ])

    _zoom.on('zoom', ({ transform, sourceEvent }) => {
      const [width, height] = this.size
      this.state.transform = transform
      this.transformedCoords = this.transformDatumCoordinates()

      this.ctx.cursor.clearRect(0, 0, width, height)

      // Always repaint the map
      this.paintMap()

      // If tweening, let the tween loop handle datums
      // Otherwise paint immediately
      if (!this.tweening) {
        this.paintDatums()
      }

      // Emit zoom state
      this.onZoom({
        x: transform.x,
        y: transform.y,
        k: transform.k
      })
    })

    _zoom.filter(function (e) {
      // if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
      //   return e.touches.length > 1
      // }
      // return true
      return false
    })

    _zoom.touchable()

    canvas.call(_zoom as any)

    return _zoom
  }

  resetZoom(): void {
    const [width, height] = this.size
    this.zoom.scaleExtent([1, 8])
    this.zoom.translateExtent([
      [0, 0],
      [width, height]
    ])
    const canvas = select('canvas.cursor') as any
    this.zoom.transform(canvas, zoomIdentity)
  }

  private getRadiusForScale(scale: number): number {
    const [width, height] = this.size
    const dimension = Math.min(width, height)
    return dimension / Math.max(scale, Number.EPSILON)
  }

  private getViewFromTransform(transform: ZoomTransform = this.state.transform): ZoomView {
    const [width, height] = this.size
    const center = transform.invert([width / 2, height / 2]) as [number, number]
    const radius = this.getRadiusForScale(transform.k)
    return [center[0], center[1], radius]
  }

  private getTransformFromView([cx, cy, radius]: ZoomView): ZoomTransform {
    const [width, height] = this.size
    const clampRadius = Math.max(radius, 1e-3)
    const dimension = Math.min(width, height)
    const k = dimension / clampRadius
    return zoomIdentity
      .translate(width / 2, height / 2)
      .scale(k)
      .translate(-cx, -cy)
  }

  private animateToView(targetView: ZoomView, durationOverride?: number) {
    const canvas = this.canvasSelection
    if (!canvas || !this.zoom) return

    const interpolator = interpolateZoom(this.getViewFromTransform(), targetView)
    const recommendedDuration =
      typeof interpolator.duration === 'number' ? interpolator.duration : BASE_DURATION
    const duration = Math.max(0, durationOverride ?? recommendedDuration)

    const applyView = (view: ZoomView) => {
      const transform = this.getTransformFromView(view)
      this.state.transform = transform
      canvas.call(this.zoom.transform as any, transform)

      // Emit zoom state during animation
      this.onZoom({
        x: transform.x,
        y: transform.y,
        k: transform.k
      })
    }

    if (duration === 0) {
      applyView(targetView)
      return
    }

    this.animations.zoom.start = performance.now()
    this.animations.zoom.tick = (now: DOMHighResTimeStamp) => {
      const elapsed = now - this.animations.zoom.start
      const t = ease(Math.min(1, elapsed / BASE_DURATION))
      const nextView = interpolator(t)
      applyView(nextView)
      if (t < 1) return
      this.animations.zoom = { start: 0, tick: null }
    }
  }

  private getDatumBaseSize(index: number): number {
    const location = this.locations[index]
    if (!location) return 0
    const values = this.getCountyValuesByFips(location.fips)
    if (!values) return 0
    const rawValue = values[this.state.datasetIndex]
    if (rawValue === undefined || rawValue === null) return 0

    let size: number

    if (this.state.perCapita && location.population > 0) {
      const perCapitaValue = (rawValue / location.population) * 100
      size = this.scales.capita(perCapitaValue)
    } else {
      size = this.scales.size(rawValue)
    }

    const minSize = 0
    size = Math.max(minSize, size)
    size = Math.min(size, 80)

    return size
  }

  private clampScale(scale: number): number {
    const extent = this.zoom?.scaleExtent ? this.zoom.scaleExtent() : [1, 8]
    return Math.max(extent[0], Math.min(extent[1], scale))
  }

  private deriveScaleForDatum(index: number, desiredSize = TARGET_DATUM_SIZE): number {
    const baseSize = this.getDatumBaseSize(index)
    if (!Number.isFinite(baseSize) || baseSize <= 0) {
      return this.clampScale(this.state.transform.k)
    }

    const scale = desiredSize / baseSize
    return this.clampScale(scale)
  }

  public focusDatumByFIPS(fips: string, options?: FocusOptions) {
    const datum = this.locations.find((v) => v.fips === fips)
    if (!datum) return
    const index = this.locations.indexOf(datum)
    this.focusDatumByIndex(index, options)
  }

  public focusDatumByIndex(index: number, options?: FocusOptions) {
    if (index < 0 || index >= this.totalLocations) return
    const coords = this.coords[index]
    if (!coords) return

    const desiredSize = options?.desiredSize ?? TARGET_DATUM_SIZE
    const scale = this.deriveScaleForDatum(index, desiredSize)
    const radius = this.getRadiusForScale(scale)
    const view: ZoomView = [coords[0], coords[1], radius]

    this.animateToView(view, options?.duration)
  }

  public focusLargestDatum(options?: FocusOptions) {
    const max = Math.max(...(this.last || []))
    const i = (this.last || []).indexOf(max)
    if (i === -1) return
    this.focusDatumByIndex(i, options)
  }

  initMouse() {
    if ('ontouchstart' in window) return this.initMouseMove('touchmove')
    return this.initMouseMove('mousemove')
  }

  initMouseMove(event: string) {
    select('canvas.cursor').on(event, (e: MouseEvent) => {
      e.preventDefault()
      e.stopImmediatePropagation()

      this.state.mouse = [e.pageX, e.pageY]

      // Lazy build projection on first mouse interaction (avoids blocking init)
      if (!this.projection && this.loaded) {
        this.projection = this.buildProjection()
      }

      const coords = this.projection?.invert?.(this.state.transform.invert(this.state.mouse))

      if (!coords) return

      let i = 0
      let match = null
      let closest = null

      for (; i < this.totalLocations; i++) {
        const location = this.locations?.[i]

        if (location.lat && location.lon) {
          const distance = geoDistance(coords, [this.locations?.[i]?.lon, this.locations?.[i]?.lat])

          if (typeof distance === 'number' && (closest === null || distance < closest)) {
            closest = distance
            match = this.locations?.[i]
          }
        }
      }

      this.state.cursorDatum = match

      this.paintCursor()

      this.onMouseMove({
        coords: this.state.mouse,
        datum:
          match === null
            ? null
            : {
                ...match,
                values: this.getCountyValuesByFips(match.fips)
              }
      })
    })
  }

  async resize() {
    const dpr = this.size[2]
    this.ctx.map.resetTransform()
    this.ctx.map.scale(dpr, dpr)
    this.ctx.datums.resetTransform()
    this.ctx.datums.scale(dpr, dpr)
    this.ctx.cursor.resetTransform()
    this.ctx.cursor.scale(dpr, dpr)
    this.scales = this.buildScales()

    // Calculate coordinates and build sprites in parallel (both use workers!)
    // Note: Projection will be rebuilt lazily on next mouse interaction
    this.projection = null  // Invalidate old projection
    const [coords, sprites] = await Promise.all([
      calculateCoordinatesOptimized(this.size[0], this.size[1], this.usa, this.locations),
      this.buildSprites()
    ])

    this.coords = coords
    this.sprites = sprites
    this.resetZoom()
    this.paint()
  }

  paintMap() {
    const [width, height] = this.size
    const { map } = this.ctx
    const { x, y, k } = this.state.transform
    map.fillStyle = BACKGROUND_COLOR
    map.clearRect(0, 0, width, height)
    map.save()
    map.translate(x, y)
    map.scale(k, k)
    this.sprites?.map?.applyTo?.(map, width / 2, height / 2, width, height)
    map.restore()
  }

  calculateDatumSizes() {
    // Store last state BEFORE calculating new values
    // This is critical for interpolation!
    if (!this.last || this.last.length === 0) {
      this.last = new Array(this.totalLocations).fill(0)
    } else if (this.tweening && this.interpolators && this.animations.tween.start > 0) {
      // If we're mid-tween, capture the current interpolated values
      // This prevents "snapping" when interrupting an animation
      const elapsed = performance.now() - this.animations.tween.start
      const t = ease(Math.min(elapsed / BASE_DURATION, 1))
      this.last = this.interpolators.map((interp) => interp(t))
      // Cancel the current tween so we can start a new one
      this.tweening = false
      this.animations.tween = { start: 0, tick: null }
    } else {
      this.last = [...this.next]
    }

    const next: number[] = new Array(this.totalLocations).fill(0)
    for (let i = 0; i < this.totalLocations; i++) {
      const size = this.getDatumBaseSize(i)
      if (!Number.isFinite(size)) {
        next[i] = 0
      } else {
        next[i] = Math.max(size, 0)
      }
    }
    this.next = next
    this.transformedCoords = this.transformDatumCoordinates()
  }

  paintDatums() {
    const [width, height] = this.size
    const calls = [() => this.ctx.datums.clearRect(0, 0, width, height)]
    for (let i = 0; i < this.totalLocations; i++) {
      if (this.transformedCoords[i]?.[0]) {
        calls.push(() =>
          this.sprites.datum.applyTo(
            this.ctx.datums,
            this.transformedCoords[i]![0],
            this.transformedCoords[i]![1],
            this.next[i],
            this.next[i]
          )
        )
      }
    }
    calls.forEach((call) => call())
  }

  buildInterpolators() {
    console.log('Map.ts:buildInterpolators()')
    this.interpolators = []
    for (let j = 0; j < this.totalLocations; j++) {
      const from = this.last[j]
      const to = this.next[j]
      this.interpolators.push(interpolateNumber(from, to))
    }
  }

  tweenDatums() {
    if (this.tweening) return
    console.log('Map.ts:tweenDatums()')
    const start = performance.now()
    this.buildInterpolators()
    this.tweening = true
    this.animations.tween = {
      start,
      tick: (now: DOMHighResTimeStamp) => {
        const elapsed = now - start
        const t = ease(Math.min(elapsed / BASE_DURATION, 1))

        const [width, height] = this.size
        const calls = [() => this.ctx.datums.clearRect(0, 0, width, height)]

        for (let j = 0; j < this.totalLocations; j++) {
          const size = this.interpolators?.[j](t)
          const numericSize = Number.isFinite(size) ? size : 0
          if (!this.transformedCoords[j] || numericSize <= 0) continue
          calls.push(() => {
            this.sprites.datum.applyTo(
              this.ctx.datums,
              this.transformedCoords[j]![0],
              this.transformedCoords[j]![1],
              numericSize,
              numericSize
            )
          })
        }
        calls.forEach((c) => c())
        if (t < 1) return
        this.tweening = false
        this.animations.tween = { start: 0, tick: null }
        console.log('tween end')
      }
    }
  }

  paintCursor() {
    const [width, height] = this.size
    if (this.state.cursorDatum === null) return
    const i = (this.fipsData as any)?.[this.state?.cursorDatum?.fips]
    const coords = this.transformedCoords[i] as any
    if (!coords) return
    const value = this.getCountyValuesByFips(this.state?.cursorDatum?.fips)
    if (!value) return
    const radius = this.next[i] / 2 / 1.5
    this.ctx.cursor.clearRect(0, 0, width, height)
    this.ctx.cursor.lineWidth = 1
    this.ctx.cursor.strokeStyle = 'white'
    this.ctx.cursor.beginPath()
    this.ctx.cursor.arc(coords[0], coords[1], radius, 0, TWO_PI)
    this.ctx.cursor.closePath()
    this.ctx.cursor.stroke()
  }

  update() {
    this.calculateDatumSizes()
    this.paint()
  }

  paint() {
    this.paintMap()
    this.tweenDatums()
  }

  frame() {
    this.paintMap()
    this.paintDatums()
  }

  destroy() {
    console.log('destroy()')
    cancelAnimationFrame(this.raf)
  }
}
