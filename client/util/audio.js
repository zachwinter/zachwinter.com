import { min, max } from 'd3-array'

export function getMicrophoneStream () {
	return new Promise((resolve, reject) => {
		if (navigator && navigator.getUserMedia) {
			navigator.getUserMedia({ audio: true }, stream => resolve(stream), err => reject(err))
		} else {
			reject('Unable to capture browser audio.')
		}
	})
}

export function createAudioContext () {
  return new (window.AudioContext || window.webkitAudioContext)()
}

export function createAnalyser (ctx, {
  bitDepth = Math.pow(2, 10),
  smoothingTimeConstant = .9
} = {}) {
  const analyser = ctx.createAnalyser()
  const frequencyBuffer = new Uint8Array(bitDepth/2)
  const waveformBuffer = new Uint8Array(bitDepth)
  analyser.fftSize = bitDepth
  analyser.smoothingTimeConstant = smoothingTimeConstant
  return { analyser, frequencyBuffer, waveformBuffer }
}

export function determineVolume (buffer) {
  let val = 0
  buffer.forEach(datum => val = val + (datum / 255))
  return (val / buffer.length) * 1000
}

export function determineBass (buffer) {
  let val = 0
  for (var i = 0; i < buffer.length / 3; i++) {
    val = val + (buffer[i] / 255)
  }
  return (val / buffer.length / 3) * 1000
}


export function determineMids (buffer) {
  let val = 0
  for (var i = buffer.length / 3; i < buffer.length * 2 / 3; i++) {
    val = val + (buffer[i] / 255)
  }
  return (val / buffer.length / 3) * 1000
}

export function determineTreble (buffer) {
  let val = 0
  for (var i = buffer.length * 2 / 3; i < buffer.length; i++) {
    val = val + (buffer[i] / 255)
  }
  return (val / buffer.length / 3) * 1000
}

export function determineVolumeAverages (volume) {
  const all = [...volume.all]

  if (all.length > 5) {
    const _50 = [...all].splice(all.length - 6, 5)
    volume['50'] = {
      average: _50.reduce((a, b) => (a + b)) / 5,
      min: min(_50),
      max: max(_50)
    }
  }

  if (all.length > 10) {
    const _100 = [...all].splice(all.length - 11, 10)
    volume['100'] = {
      average: _100.reduce((a, b) => (a + b)) / 10,
      min: min(_100),
      max: max(_100)
    }
  }

  if (all.length > 25) {
    const _250 = [...all].splice(all.length - 26, 25)
    volume['250'] = {
      average: _250.reduce((a, b) => (a + b)) / 25,
      min: min(_250),
      max: max(_250)
    }
  }

  if (all.length > 50) {
    const _500 = [...all].splice(all.length - 51, 50)
    volume['500'] = {
      average: _500.reduce((a, b) => (a + b)) / 50,
      min: min(_500),
      max: max(_500)
    }
  }

  if (all.length > 100) {
    const _1000 = [...all].splice(all.length - 101, 100)
    volume['1000'] = {
      average: _1000.reduce((a, b) => (a + b)) / 100,
      min: min(_1000),
      max: max(_1000)
    }
  }

  if (all.length > 250) {
    const _2500 = [...all].splice(all.length - 251, 250)
    volume['2500'] = {
      average: _2500.reduce((a, b) => (a + b)) / 250,
      min: min(_2500),
      max: max(_2500)
    }
  }

  if (all.length > 500) {
    const _5000 = [...all].splice(all.length - 501, 500)
    volume['5000'] = {
      average: _5000.reduce((a, b) => (a + b)) / 500,
      min: min(_5000),
      max: max(_5000)
    }
  }

  if (all.length > 1000) {
    const _10000 = [...all].splice(all.length - 1001, 1000)
    volume['10000'] = {
      average: _10000.reduce((a, b) => (a + b)) / 1000,
      min: min(_10000),
      max: max(_10000)
    }
  }
}