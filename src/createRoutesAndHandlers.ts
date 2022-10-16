import fs from 'node:fs'
import path from 'node:path'
import type {RequestHandler} from 'express'
import buildEntryPoints from './buildEntryPoints'
import createRouteHandlerData from './createRouteHandlerData'
import {isValidFile} from './utils'

type RouteAndHandlerType = {
  route: string
  handler: RequestHandler
}

export default async function createRoutesAndHandlers({
  apiDir,
}): Promise<RouteAndHandlerType[]> {
  // Do nothing if the user doesn't have back end routes to parse.
  const apiPath = path.join(process.cwd(), apiDir)
  const apiDirExists = fs.existsSync(apiPath)
  if (apiDirExists === false) return []

  const entryPoints = getHandlerPaths(apiPath)
  const buildResults = await buildEntryPoints(entryPoints)
  const routeHandlerData = await createRouteHandlerData({
    buildResults,
    entryPoints,
  })

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
