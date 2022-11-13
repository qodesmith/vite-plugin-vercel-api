import pico from 'picocolors'

type LogParams = Parameters<typeof console.log>
type LogType = 'error' | 'info'

export function logger(...messages: LogParams) {
  log('info', messages)
}

export function errorLogger(...messages: LogParams) {
  log('error', messages)
}

function log(type: LogType, messages: LogParams) {
  const timeStr = new Date().toLocaleTimeString()
  const grayTime = pico.dim(timeStr)
  const colorFn = type === 'error' ? pico.red : pico.cyan
  const pluginName = colorFn(pico.bold('[vitePluginVercelApi]'))

  console.log(grayTime, pluginName, ...messages)
}
