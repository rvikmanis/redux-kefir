var rollup = require('rollup').rollup
var babel = require('rollup-plugin-babel')
var uglify = require('rollup-plugin-uglify')
var nodeResolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')

function roll(plugins, bundlerOptions) {
  rollup({
    entry: 'src/index.js',
    plugins: plugins,
    external: ['kefir']
  })
  .then(function (bundle) {
    bundle.write(bundlerOptions)
  })
}

function umd(dest, sourceMap) {
  return {
    format: 'umd',
    moduleName: 'ReduxKefir',
    dest: dest,
    globals: {
      kefir: 'Kefir'
    },
    sourceMap: !!sourceMap
  }
}

roll([ babel(), nodeResolve({jsnext: true, main: true}), commonjs() ],
  umd('dist/redux-kefir.js')
)

roll([ babel(), nodeResolve({jsnext: true, main: true}), commonjs(), uglify() ],
  umd('dist/redux-kefir.min.js', true)
)
