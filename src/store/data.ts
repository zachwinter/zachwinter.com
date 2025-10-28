import { clone } from '../util/clone'
import { sample } from '../util/arrays'
import { clear } from 'console'

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

export type Dataset = 'ACTIVE_CASES' | 'CUMULATIVE_CASES' | 'DEATHS'
const examples = ['11052020', '04212021', '08172021', '12252021', '09012022']

export const useData = defineStore('data', () => {
  let loaded = false
  let fipsData: any
  let locationData: any
  let statsData: any
  let populationData: any
  let usa: any
  let stateData: any
  let dayData: any
  let day: any
  const dataset = 2
  const perCapita = true
  let STATE_FIPS: any = []
  let DATE_MAP: any = []
  let dates: any = []
  let date: any

  let yesterday: any
  let today: any
  let delta: any
  let states: any
  const selectedCounties: any = []

  function setYesterday() {
    if (Math.max(day, 0) === 0) {
      yesterday = Object.freeze(locationData?.map(() => [0, 0, 0]))
    } else {
      yesterday = Object.freeze(
        locationData?.map(
          (location: Location) =>
            (statsData as any)?.[(fipsData as any)?.[location?.fips]]?.[day - 1]
        )
      )
    }
  }

  function setToday() {
    today = Object.freeze(
      locationData?.map(
        (location: Location) => (statsData as any)?.[(fipsData as any)?.[location?.fips]]?.[day]
      )
    )
  }

  function setDelta() {
    if (!yesterday) {
      delta = Object.freeze([0, 0, 0])
    } else {
      delta = Object.freeze(
        today.map(
          (
            [cases, deaths, active]: [number, number, number],
            i: number
          ): [number, number, number] => {
            return [cases - yesterday[i][0], deaths - yesterday[i][1], active - yesterday[i][2]]
          }
        )
      )
    }
  }

  function setStates() {
    states = Object.freeze(
      STATE_FIPS?.reduce((acc: any, state: any) => {
        acc[state] = [
          [0, 0, 0],
          [0, 0, 0]
        ] as any
        ;(stateData as any)?.[state].forEach((county: any) => {
          const index = (fipsData as any)[county]
          acc[state][0][0] += today[index][0]
          acc[state][0][1] += today[index][1]
          acc[state][0][2] += today[index][2]
          acc[state][1][0] += delta[index][0]
          acc[state][1][1] += delta[index][1]
          acc[state][1][2] += delta[index][2]
        })
        return acc
      }, {})
    )
  }

  function getCountyValuesByFips(fips: any): [number, number, number] {
    return today?.[(fipsData as any)?.[fips]]
  }

  function getCountyDeltasByFips(fips: any): [number, number, number] {
    return delta?.[(fipsData as any)?.[fips]]
  }

  function getHistoricalCountyValuesByFips(fips: any): any[] {
    return statsData?.[fipsData?.[fips]] || []
  }

  function getStateValuesByFips(fips: any): [number, number, number] | null {
    return states?.[fips]?.[0] || null
  }

  function getStateDeltasByFips(fips: any): [number, number, number] | null {
    return states?.[fips]?.[1] || null
  }

  function getStatePopulationByFips(fips: string) {
    return (populationData?.states as any)?.[fips] || null
  }

  function getStateDataByFips(fips: string) {
    return {
      values: [getStateValuesByFips(fips), getStateDeltasByFips(fips)],
      population: getStatePopulationByFips(fips)
    }
  }

  function chooseExample(example: string) {
    if (example) {
      const day = example.slice(2, 4)
      const month = example.slice(0, 2)
      const year = example.slice(-4)
      const date = new Date(`${month}/${day}/${year}`)
      if (date) setDateByDateObject(date)
    }
  }

  function setDateByIndex(i: number) {
    day = i
  }

  function setDateByDateObject(date: Date) {
    day = DATE_MAP?.[date.valueOf()]

    setYesterday()
    setToday()
    setDelta()
    setStates()
  }

  function getCountyByFips(fips: string): Location {
    return locationData?.[(fipsData as any)?.[fips]]
  }

  function selectCountyByFips(fips: string) {
    const county = getCountyByFips(fips)
    const index: number = selectedCounties.indexOf(county)
    if (index === -1) {
      selectedCounties.push(county)
    } else {
      selectedCounties.filter((v: Location) => county.fips !== v.fips)
    }
  }

  async function fetchData() {
    const [collection, days, map, population, states, stats, usaData] = await Promise.all(
      [
        '/data.collection.json',
        '/data.days.json',
        '/data.map.json',
        '/data.population.json',
        '/data.states.json',
        '/data.stats.json',
        '/data.usa.json'
      ].map(async (file) => await fetch(file).then((res) => res.json()))
    )

    fipsData = Object.freeze(map)
    populationData = Object.freeze(population)
    stateData = Object.freeze(states)
    locationData = Object.freeze(collection)
    dayData = Object.freeze(days)
    statsData = Object.freeze(stats)
    usa = Object.freeze(usaData)
    loaded = true
    STATE_FIPS = Object.freeze(Object.keys(states))!
    dates = Object.freeze(dayData?.map((d: string) => new Date(d)))
    DATE_MAP = Object.freeze(
      dates.reduce((acc: any, date: any, i: number) => {
        acc[date.valueOf()] = i
        return acc
      }, {})
    )
    day = 0
    setYesterday()
    setToday()
    setDelta()
    setStates()
  }

  let interval: any

  onMounted(() => {
    fetchData().then(() => {
      clearInterval(interval)
      let i = 365

      interval = setInterval(() => {
        setDateByDateObject(dates[i])

        if (i === dates.length - 1) {
          clearInterval(interval)
          return
        }

        i = Math.min(i + 14, dates.length - 1)
      }, 750)
    })
  })

  onBeforeUnmount(() => {
    clearInterval(interval)
  })

  return {
    fetchData,
    dataset,
    day,
    date,
    dates,
    today,
    yesterday,
    delta,
    states,
    getCountyValuesByFips,
    getCountyDeltasByFips,
    getStateValuesByFips,
    getStateDeltasByFips,
    getStateDataByFips,
    getStatePopulationByFips,
    getHistoricalCountyValuesByFips,
    setDateByIndex,
    setDateByDateObject,
    perCapita,
    fipsData,
    loaded,
    locationData,
    usa,
    selectCountyByFips,
    chooseExample
  }
})
