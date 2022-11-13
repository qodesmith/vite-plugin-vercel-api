import type {CreateRoutesAndHandlersInputType} from './createRoutesAndHandlers'
import esbuild from 'esbuild'
import pico from 'picocolors'
import {errorLogger} from './logger'
import {filePathToRoute, RouteError} from './utils'

type CreateRouteHandlerDataInputType = {
  buildResults: esbuild.BuildResult
  entryPoints: string[]
  debugNames: CreateRoutesAndHandlersInputType['debugNames']
}

export default async function createRouteHandlerData({
  buildResults,
  entryPoints,
  debugNames,
}: CreateRouteHandlerDataInputType) {
  if (!buildResults.outputFiles) {
    throw new Error('No outputFiles found from ')
  }
  const promises = buildResults.outputFiles.map(({text}, i) => {
    /*
      https://2ality.com/2019/10/eval-via-import.html
      eval() doesn't support import and export statements, but dynamic
      import() does, using a `data:` URI.
    */
    const encodedJs = encodeURIComponent(text)
    const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`

    return import(dataUri)
      .then(mod => {
        if (typeof mod !== 'object' || typeof mod.default !== 'function') {
          return null
        }

        const absolutePath = entryPoints[i]
        const route = filePathToRoute(absolutePath)
        return {route, handler: mod.default}
      })
      .catch(error => {
        /*
          Only log non-RouteErrors here. `filePathToRoute` above will throw a
          RouteError (leading to this catch) but it will also log a message
          indicating an unsupported route was found.
        */
        if (
          debugNames.has('failedRouteImports') &&
          !(error instanceof RouteError)
        ) {
          errorLogger(
            pico.red(`Error dynamically importing file - ${entryPoints[i]}`),
            '\n',
            error.message
          )
        }

        return null
      })
  })
  const results = await Promise.all(promises)

  return results
    .filter(<T>(item: T | null): item is T => Boolean(item))
    .sort((a, b) => {
      const length1 = a.route.split('/').length
      const length2 = b.route.split('/').length

      return length2 - length1
    })
}
