'use strict'

const svgToJsx = import 'svg-to-jsx'
const MagicString = import 'magic-string'
const {createFilter} = import 'rollup-pluginutils'

export default = function (options) {
  options = options || {}
  var filter = createFilter(options.include || '**/*.svg', options.exclude)
  return {
    transform: function sourceToCode (code, id) {
      if (!filter(id)) return null

      var s = new MagicString(code)
      return svgToJsx(code).then(function (jsx) {
        let result = jsx.replace(/^<svg/, '<svg {...props}') + ';\n'
        s.overwrite(0, code.length, result)
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        }
      })
    }
  }
}
