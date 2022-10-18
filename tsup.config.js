import esbuild from 'esbuild'
import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['./src/vitePluginVercelApi.ts'],
  sourcemap: true,
  dts: true,
  format: 'cjs',
  clean: true,
  outDir: './dist',

  /*
    https://github.com/egoist/tsup/issues/572#issuecomment-1060599574
    If we didn't use the footer option, the result for `require(...)` would be
    an object with a key of 'default'.
  */
  esbuildOptions(options) {
    options.footer = {
      js: 'module.exports = module.exports.default;',
    }
  },

  async onSuccess() {
    await esbuild.build({
      entryPoints: ['./src/vitePluginVercelApi.ts'],
      bundle: true,
      platform: 'node',
      external: ['./node_modules/*'],
      outdir: './dist',
      format: 'esm',
    })
  },
})
