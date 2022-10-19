import path from 'node:path'
import chalk from 'chalk'

export function filePathToRoute(filePath: string): string {
  const {dir, name: nameWithoutExt} = path.parse(filePath)
  const lastSegment = (() => {
    const routeType = getRouteType(nameWithoutExt)
    if (nameWithoutExt === 'index') return
    if (routeType === 'dynamic') return `:${nameWithoutExt.slice(1, -1)}`
    if (routeType === 'catchAll' || routeType === 'optionalCatchAll') {
      throw createRouteTypeError({segment: nameWithoutExt, itemPath: filePath})
    }

    return nameWithoutExt
  })()

  const parameterizedPath = dir
    .slice(dir.indexOf('/api'))
    .split('/')
    .map(segment => {
      const routeType = getRouteType(segment)

      if (routeType === 'catchAll' || routeType === 'optionalCatchAll') {
        const prePath = filePath.slice(0, filePath.indexOf(segment))
        const segmentPath = `${prePath}${segment}`
        throw createRouteTypeError({segment, itemPath: segmentPath})
      }

      if (routeType === 'dynamic') {
        return segment.replace('[', ':').slice(0, -1)
      }

      return segment
    })
    .join('/')

  return `${parameterizedPath}${lastSegment ? `/${lastSegment}` : ''}`
}

type RouteType = 'explicit' | 'dynamic' | 'catchAll' | 'optionalCatchAll'
function getRouteType(str: string): RouteType {
  if (str.startsWith('[[...') && str.endsWith(']]')) return 'optionalCatchAll'
  if (str.startsWith('[...') && str.endsWith(']')) return 'catchAll'
  if (str.startsWith('[') && str.endsWith(']')) return 'dynamic'
  return 'explicit'
}

type CreateRouteTypeErrorInputType = {
  segment: string
  itemPath: string
}

function createRouteTypeError({
  segment,
  itemPath,
}: CreateRouteTypeErrorInputType): Error {
  const projectPath = itemPath.replace(process.cwd(), '')
  const redPath = chalk.red(
    projectPath.replace(segment, chalk.red.bold(segment))
  )
  const message = chalk.red('Catch all routes are not supported -')
  const errorMessage = `${message} ${redPath}`

  // Log this to the console so the user can see.
  console.error(errorMessage)

  // This error will be caught in a try catch and not stop the process.
  return new Error(errorMessage)
}

export function isValidFile(name: string): boolean {
  return ['.ts', '.js', '.mjs', '.cjs'].some(ending => name.endsWith(ending))
}
