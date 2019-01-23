import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer';
// import cssnano from 'cssnano';
// import livereload from 'rollup-plugin-livereload'
import {
  uglify
} from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import {
  version
} from './package.json';

const debug = process.env.NODE_ENV === 'development' ? true : false


export default {
  input: 'src/main.js',
  output: {
    file: debug ? 'test/gdmap-utils.js' : `dist/gdmap-utils.${version}.min.js`,
    format: 'umd',
    name: 'AMapUtils',
    sourcemap: debug,
  },
  plugins: [
    postcss({
      plugins: [autoprefixer]
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 排除引入的库
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    (!debug && uglify()),
    (debug && serve({
      open: true,
      openPage: '/polyrectlist/',
      verbose: true,
      contentBase: 'test',
      host: 'localhost',
      port: 8085
    })),
  ]
};