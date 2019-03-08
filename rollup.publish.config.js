import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
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

const NAME = 'AMapUtils'

let rst = {
  input: 'src/main.js',
  output: [{
    file: 'lib/index.js',
    format: 'umd',
    name: NAME,
    sourcemap: false,
  }],
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
    })
  ]
};

export default rst