# vite-plugin-vercel-api

Mimics Vercel's `/api` functionality locally. No need to be online or run `vercel dev`. You can simply run `npm run dev` to start Vite locally and use the `/api` directory the same way Vercel parses it in production.

This plugin provides 2 main features:

1.  Traverses the `/api` directory at the root of your project and parses files
    the same way Vercel does in production.
2.  Adds a number of middleware features found on the request and response
    objects in Vercel's serverless functions.

See https://nextjs.org/docs/api-routes/dynamic-api-routes for how the logic works for the `/api` directory, its files, and its folder structure.

Please note that Vercel `/api` features do NOT have parity with Next.js `/pages/api`. In particular, Vercel does not support `[...catchAll]` or `[[...optionaCatchAll]]` routes - see https://github.com/vercel/community/discussions/947.

See https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects for what middleware Vercel exposes on the request and response objects in serverless functions.

## Usage

```javascript
import {defineConfig} from 'vite'
import vitePluginVercelApi from 'vite-plugin-vercel-api'

export default defineConfig({
  plugins: [vitePluginVercelApi()],
})
```

Or with `require` syntax:

```javascript
const {defineConfig} = require('vite')
const vitePluginVercelApi = require('vite-plugin-vercel-api')

export default defineConfig({
  plugins: [vitePluginVercelApi()],
})
```
