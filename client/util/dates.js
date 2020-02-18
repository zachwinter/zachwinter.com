export const months = [
  {
    full: 'January',
    abbreviation: 'Jan'
  },
  {
    full: 'February',
    abbreviation: 'Feb'
  },
  {
    full: 'March',
    abbreviation: 'Mar'
  },
  {
    full: 'April',
    abbreviation: 'Apr'
  },
  {
    full: 'May',
    abbreviation: 'May'
  },
  {
    full: 'June',
    abbreviation: 'Jun'
  },
  {
    full: 'July',
    abbreviation: 'July'
  },
  {
    full: 'August',
    abbreviation: 'Aug'
  },
  {
    full: 'September',
    abbreviation: 'Sep'
  },
  {
    full: 'October',
    abbreviation: 'Oct'
  },
  {
    full: 'November',
    abbreviation: 'Nov'
  },
  {
    full: 'December',
    abbreviation: 'Dec'
  }
]

export const days = [
  {
    full: 'Monday',
    abbreviation: 'Mon'
  },
  {
    full: 'Tuesday',
    abbreviation: 'Tue'
  },
  {
    full: 'Wednesday',
    abbreviation: 'Wed'
  },
  {
    full: 'Thursday',
    abbreviation: 'Thu'
  },
  {
    full: 'Friday',
    abbreviation: 'Fri'
  },
  {
    full: 'Saturday',
    abbreviation: 'Sat'
  },
  {
    full: 'Sunday',
    abbreviation: 'Sun'
  }
]

export function format (val) {
  const date = new Date(val)
  const month = date.getMonth()
  const day = date.getDay()
  const _date = date.getDate()
  const year = date.getFullYear()
  let period = 'am'
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if (hours > 12) {
    hours = hours - 12
    period = 'pm'
  }

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  return {
    date,
    month: {
      ...months[month],
      index: month
    },
    day: {
      ...days[day],
      index: day
    },
    date: _date,
    year,
    time: `${hours}:${minutes} ${period}`,
    basic: `${months[month].abbreviation} ${_date}, ${year} @ ${hours}:${minutes} ${period}`
  }
}