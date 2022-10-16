import path from 'node:path'

export function filePathToRoute(filePath: string): string {
  const {dir, name: nameWithoutExt} = path.parse(filePath)
  const lastSegment = (() => {
    const routeType = getRouteType(nameWithoutExt)
    if (nameWithoutExt === 'index') return
    if (routeType === 'dynamic') return `:${nameWithoutExt.slice(1, -1)}`
    if (routeType === 'catchAll' || routeType === 'optionalCatchAll') {
      throw createRouteTypeError(nameWithoutExt)
    }

    return nameWithoutExt
  })()

  const parameterizedPath = dir
    .slice(dir.indexOf('/api'))
    .split('/')
    .map(segment => {
      const routeType = getRouteType(segment)

      if (routeType === 'catchAll' || routeType === 'optionalCatchAll') {
        throw createRouteTypeError(segment)
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

function createRouteTypeError(str: string): Error {
  const errorMessage = `Catch all routes are not supported - ${str}`

  // Log this to the console so the user can see.
  console.error(errorMessage)

  // This error will be caught in a try catch and not stop the process.
  return new Error(errorMessage)
}

export function isValidFile(name: string): boolean {
  return ['.ts', '.js', '.mjs', '.cjs'].some(ending => name.endsWith(ending))
}
