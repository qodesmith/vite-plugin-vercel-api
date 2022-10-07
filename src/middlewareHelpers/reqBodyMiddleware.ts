import type {VercelRequest, VercelResponse} from '@vercel/node'
import type {Connect} from 'vite/dist/node'
import bodyParser from 'body-parser'

/**
 *
 * This module uses the `body-parser` package from Express.js to handle (and
 * mimic) all the body-parsing middleware.
 *
 * How Vercel populates req.body - https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/request-body
 *
 * bodyParser.json()
 * https://github.com/expressjs/body-parser#bodyparserjsonoptions
 * Header - {'Content-Type': 'application/json'}
 *
 * bodyParser.raw()
 * https://github.com/expressjs/body-parser#bodyparserrawoptions
 * Header - {'Content-Type': 'application/octet-stream'}
 *
 * bodyParser.text()
 * https://github.com/expressjs/body-parser#bodyparsertextoptions
 * Header - {'Content-Type': 'text/plain'}
 *
 * bodyParser.urlencoded({extended: false})
 * https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
 * Header - {'Content-Type': 'application/x-www-form-urlencoded'}
 *
 */
export default function reqBodyMiddleware(
  req: VercelRequest,
  res: VercelResponse,
  next: Connect.NextFunction
) {
  const bodyMiddlewares = [
    bodyParser.json(),
    bodyParser.raw(),
    bodyParser.text(),
    bodyParser.urlencoded({extended: false}),
  ]

  bodyMiddlewares.forEach(middleware => middleware(req, res, next))
}
