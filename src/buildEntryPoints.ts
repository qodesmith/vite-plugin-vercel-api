import esbuild from 'esbuild'
import requireToEsmPlugin from './esbuildPlugins/requireToEsmPlugin'
import fileUrlPlugin from './esbuildPlugins/fileUrlPlugin'

export default function buildEntryPoints(entryPoints: string[]) {
  return esbuild.build({
    // Have esbuild process many files at once.
    entryPoints,

    // Avoid bundling anything from node_modules. They're accessible in dev.
    external: ['./node_modules/*'],

    /*
      Bundle local dependencies (node_modules is ignored above). Anything from
      node_modules can be imported and used at runtime.
    */
    bundle: true,

    // After all, this is for mimicing Vercel's /api functionality in Node.
    platform: 'node',

    // Stick with esm as opposed to CommonJS.
    format: 'esm',

    // Don't write the results to any file, keep it in memory for later use.
    write: false,

    // Helpful while developing and debugging. Doesn't affect the output.
    metafile: true,

    /*
      Ensure non-native node_modules have an absolute file://... url.
      Transform the few require()'s that we have to esm.
      Vite + Vercel needs require() for node_modules - https://bit.ly/3EiphjJ
    */
    plugins: [fileUrlPlugin, requireToEsmPlugin],

    // No output directory will be written to because of `write:false`.
    outdir: '/api',
  })
}
