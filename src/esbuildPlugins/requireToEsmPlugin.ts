import esbuild from 'esbuild'
import fs from 'node:fs'

const requireToEsmPlugin: esbuild.Plugin = {
  name: 'requireToEsmPlugin',
  setup(build) {
    // require() => esm
    build.onLoad({filter: /.*/}, async args => {
      /*
        https://esbuild.github.io/plugins/#on-resolve
        Many callbacks may be running concurrently. In JavaScript, if your
        callback does expensive work that can run on another thread such as
        fs.existsSync(), you should make the callback async and use await
        (in this case with fs.promises.exists()) to allow other code to run in
        the meantime.
      */
      const fileContents = await fs.promises.readFile(args.path, {
        encoding: 'utf8',
      })

      if (fileContents.includes(' = require(')) {
        // https://ar.al/2021/01/27/commonjs-to-esm-in-node.js - require => esm
        const regex = /const (.*?)\s*?=\s*?require\(('.*?')\)/g
        const newContents = fileContents.replace(regex, 'import $1 from $2')
        const results = esbuild.transformSync(newContents, {loader: 'ts'})

        return {contents: results.code}
      }

      return undefined
    })
  },
}

export default requireToEsmPlugin
