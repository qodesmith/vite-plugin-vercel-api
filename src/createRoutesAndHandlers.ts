import type {DebugNamesType} from './vitePluginVercelApi'
import type {RequestHandler} from 'express'
import fs from 'node:fs'
import path from 'node:path'
import buildEntryPoints from './buildEntryPoints'
import createRouteHandlerData from './createRouteHandlerData'
import {isValidFile} from './utils'
import {logger} from './logger'

type RouteAndHandlerType = {
  route: string
  handler: RequestHandler
}

export type CreateRoutesAndHandlersInputType = {
  apiDir: string
  debugNames: DebugNamesType
}

export default async function createRoutesAndHandlers({
  apiDir,
  debugNames,
}: CreateRoutesAndHandlersInputType): Promise<RouteAndHandlerType[]> {
  // Do nothing if the user doesn't have back end routes to parse.
  const apiPath = path.join(process.cwd(), apiDir)
  const apiDirExists = fs.existsSync(apiPath)

  if (debugNames.has('apiPath')) {
    logger('path to api -', apiPath)
  }

  if (apiDirExists === false) return []

  const entryPoints = getHandlerPaths(apiPath)
  if (debugNames.has('apiFiles')) {
    logger('files used for api endpoints -', entryPoints)
  }

  const buildResults = await buildEntryPoints(entryPoints)
  const hasBuildResultsDeep = debugNames.has('buildResultsDeep')
  if (debugNames.has('buildResults') || hasBuildResultsDeep) {
    logger('esbuild results -')

    if (hasBuildResultsDeep) {
      const results = {
        ...buildResults,
        outputFiles: buildResults.outputFiles.map(({contents, ...obj}) => {
          /*
            The `text` property is a getter. It will not show in the console
            unless the property is explicitly accessed like so here. We avoid
            printing `contents` because it's just the binary version of `text`.
          */
          return {...obj, text: obj.text}
        }),
      }
      console.dir(results, {depth: null})
    } else {
      console.log(buildResults)
    }
  }

  const routeHandlerData = await createRouteHandlerData({
    buildResults,
    entryPoints,
    debugNames,
  })
  if (debugNames.has('apiRoutes')) {
    logger(
      'api routes (in priority order) -',
      routeHandlerData.map(({route}) => route)
    )
  }

  return routeHandlerData
}

function getHandlerPaths(dir: string): string[] {
  return fs.readdirSync(dir, {withFileTypes: true}).reduce((acc, dirent) => {
    const {name} = dirent
    if (dirent.isFile() && isValidFile(name)) {
      acc.push(`${dir}/${name}`)
    } else if (dirent.isDirectory()) {
      const dirContents = getHandlerPaths(`${dir}/${name}`)
      acc.push(...dirContents)
    }

    return acc
  }, [] as string[])
}
