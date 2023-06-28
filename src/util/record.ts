export default {}
// export function record(canvas: any, setTime: Function) {
//   var stream = canvas.captureStream(60)
//   var recordedChunks: any = []

//   var options = {
//     mimeType: 'video/webm;codecs=h264',
//     videoBitsPerSecond: 100000000
//   }

//   const mediaRecorder = new MediaRecorder(stream, options)

//   window.START = window.performance.now() / 1000

//   setTime(window.START)

//   mediaRecorder.ondataavailable = handleDataAvailable
//   mediaRecorder.start()

//   function handleDataAvailable(event) {
//     recordedChunks.push(event.data)
//     download()
//   }

//   function download() {
//     var blob = new Blob(recordedChunks, {
//       type: 'video/webm'
//     })
//     var url = URL.createObjectURL(blob)
//     var a = document.createElement('a')
//     document.body.appendChild(a)
//     a.style = 'display: none'
//     a.href = url
//     a.download = 'test.webm'
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }
// }
