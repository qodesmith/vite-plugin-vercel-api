import pico from 'picocolors'

export default function logger(message: string) {
  const date = new Date()
  const timeStr = date.toLocaleTimeString()
  const grayTime = pico.dim(timeStr)
  const cyanName = pico.cyan(pico.bold('[vitePluginVercelApi]'))

  console.log(`${grayTime} ${cyanName} ${message}`)
}
