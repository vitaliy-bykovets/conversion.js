import babel from 'rollup-plugin-babel';
import { banner } from "./banner";

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/conversion.js',
    format: 'umd',
    name: 'conversion.js',
    banner
  },
  plugins: [
    babel({
      plugins: [
        'external-helpers'
      ]
    })
  ]
}