import type {Connect, PluginOption} from 'vite'
import type {RequestHandler} from 'express'
import express from 'express'
import createRoutesAndHandlers from './createRoutesAndHandlers'
import addReqBodyMiddleware from './middlewareHelpers/addReqBodyMiddleware'
import reqCookiesMiddleware from './middlewareHelpers/reqCookiesMiddleware'

export type VitePluginVercelApiOptionsType = {
  /**
   * The directory, relative to the project root, which contains the api
   * endpoints. Defaults to `'api'`.
   */
  apiDir?: string

  /**
   * Log a variety of results and errors happening under the hood. Using this option will override the config with `clearScreen: true`.
   *
   * `true` - shorthand for including all logging options.
   *
   * `'apiFiles'` - log the files used for api endpoints.
   *
   * `'apiPath'` - log the path used for the api.
   *
   * `'apiRoutes'` - log the routes constructed for Express.
   *
   * `'buildResults'` - log the esbuild results. Uses console.log which does *not* log deeply nested object values.
   *
   * `'buildResultsDeep'` - log the esbuild results. Uses console.dir which *does* log deeply nested object values. *NOTE: this can lead to large logs in the console!*
   *
   * `'failedRouteImports'` - log errors encountered with dynamically importing the route handler files.
   */
  debugOptions?: DebuggerOptionsType | boolean | null
}

const allDebuggerOptionNames = [
  'apiFiles',
  'apiPath',
  'apiRoutes',
  'buildResults',
  'buildResultsDeep',
  'failedRouteImports',
] as const
export type DebuggerOptionsType = typeof allDebuggerOptionNames[number][]
export type DebugNamesType = Set<DebuggerOptionsType[number]>

/**
 *
 * Mimics Vercel's /api functionality locally. No need to be online or run
 * `vercel dev`. You can simply run `npm run dev` to start Vite locally and use
 * the /api directory the same way Vercel parses it in production.
 *
 * This plugin provides 2 main features:
 * 1. Traverses the /api directory at the root of your project and parses files
 *    the same way Vercel does in production.
 * 2. Adds a number of middleware features found on the request and response
 *    objects in Vercel's serverless functions.
 *
 * See https://nextjs.org/docs/api-routes/dynamic-api-routes for how the logic
 * works for the /api directory, its files, and its folder structure.
 *
 * Please note that Vercel /api features do NOT have parity with Next.js
 * /pages/api. In particular, Vercel does not support [...catchAll] or
 * [[...optionaCatchAll]] routes - see https://github.com/vercel/community/discussions/947.
 *
 * See https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects
 * for what middleware Vercel exposes on the request and response objects in
 * serverless functions.
 *
 */
export default function vitePluginVercelApi(
  options: VitePluginVercelApiOptionsType = {}
): PluginOption {
  const {debugOptions} = options

  return {
    name: 'vite-plugin-vercel-api',
    async configureServer(devServer) {
      const debugNames: DebugNamesType = (() => {
        if (debugOptions === true) {
          return new Set(allDebuggerOptionNames)
        }
        if (Array.isArray(debugOptions)) return new Set(debugOptions)
        return new Set([])
      })()

      const routesAndHandlers = await createRoutesAndHandlers({
        apiDir: options.apiDir ?? 'api',
        debugNames,
      })

      // Do nothing if the user doesn't have back end routes to parse.
      if (routesAndHandlers.length === 0) return

      // Express will handle all our routing and most of our middleware.
      const app = express()

      /*
        Vercel doesn't parse path params the same way Express does. Instead,
        Vercel populates `req.query` with those values. In the case of a clash
        between a path segment (param) and a query (i.e. /:name?name=qodesmith),
        Vercel prioritizes the path segment value. This middleware will move
        Express' req.params values to req.query, mimicing Vercel in production.
      */
      const paramsToQueryMiddleware: RequestHandler = (req, res, next) => {
        req.query = {...req.query, ...req.params}
        next()
      }

      // Add all the routes to our Express app.
      routesAndHandlers.forEach(({route, handler}) => {
        app.use(route, paramsToQueryMiddleware, handler)
      })

      // Add middleware that express doesn't give us out of the box.
      addReqBodyMiddleware(devServer) // req.body
      devServer.middlewares.use(
        reqCookiesMiddleware as Connect.NextHandleFunction
      ) // req.cookies

      /*
        Instead of trying to figure out how to directly map each handler to the
        Vercel path syntax (i.e. /api/[first]/[second]), it's easier to convert
        the Vercel path syntax to Express path syntax (i.e. /api/:first/:seconf)
        and add route handlers to an Express app. Then we use the entire Express
        app as middleware to the Vite devServer. #winWin
      */
      devServer.middlewares.use(app)

      // TODO: rebuild `/api` files when they are added, removed, or changed.
      // TODO: do we need an option to prevent transforming require() calls?
    },
    config() {
      // When we have debug options, we want to ensure they are seen in the console.
      if (debugOptions) {
        return {clearScreen: false}
      }
    },
  }
}
