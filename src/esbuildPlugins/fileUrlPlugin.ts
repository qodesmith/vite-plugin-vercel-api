import type esbuild from 'esbuild'

const fileUrlPlugin: esbuild.Plugin = {
  name: 'fileUrlPlugin',
  setup(build) {
    // Use a "match-all" regex so we can filter on other properties later.
    build.onResolve({filter: /.*/}, async args => {
      const {kind, namespace, resolveDir, path: importPath} = args

      /*
        For non-native node_modules, we're interested in transforming the import
        path to an absolute `file://...` path.
      */
      if (kind === 'import-statement' && namespace === 'file') {
        /*
          https://esbuild.github.io/plugins/#resolve
          Use esbuild's built-in behavior to search for a package in the user's
          node_modules directory.
        */
        const result = await build.resolve(importPath, {resolveDir})
        const isNativeNodeModule = result.path === importPath

        // Let esbuild continue the process undisturbed.
        if (!result.external || isNativeNodeModule) return undefined

        /*
          Explicitly mark non-native node_modules as external and give it an
          absolute `file://...` path for resolution. This will be used to
          resolve the file during development.
        */
        return {
          external: true,
          path: `file://${result.path}`,
        }
      }

      return undefined
    })
  },
}

export default fileUrlPlugin
