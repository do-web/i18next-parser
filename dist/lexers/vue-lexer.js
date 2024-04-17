import _classCallCheck from '@babel/runtime/helpers/classCallCheck'
import _createClass from '@babel/runtime/helpers/createClass'
import _inherits from '@babel/runtime/helpers/inherits'
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn'
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf'
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct()
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor
      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }
    return _possibleConstructorReturn(this, result)
  }
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    )
    return true
  } catch (e) {
    return false
  }
}
import { parse, compileTemplate, compileScript } from '@vue/compiler-sfc'

import BaseLexer from './base-lexer.js'
import JavascriptLexer from './javascript-lexer.js'
var VueLexer = /*#__PURE__*/ (function (_BaseLexer) {
  _inherits(VueLexer, _BaseLexer)
  var _super = _createSuper(VueLexer)
  function VueLexer() {
    var _this
    var options =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    _classCallCheck(this, VueLexer)
    _this = _super.call(this, options)
    _this.functions = options.functions || ['$t']
    return _this
  }
  _createClass(VueLexer, [
    {
      key: 'extract',
      value: function extract(content, filename) {
        var _this2 = this
        var keys = []
        var sfc = parse(content, { sourceMap: true, filename: filename })

        // Handle <script> block
        if (sfc.descriptor.script) {
          var scriptContent = sfc.descriptor.script.content
          var Lexer1 = new JavascriptLexer({ functions: this.functions })
          Lexer1.on('warning', function (warning) {
            return _this2.emit('warning', warning)
          })
          keys = keys.concat(Lexer1.extract(scriptContent))
        }

        // Handle <script setup> block
        if (sfc.descriptor.scriptSetup) {
          var scriptSetupContent = compileScript(sfc.descriptor, {
            id: filename,
          }).content
          var Lexer2 = new JavascriptLexer({ functions: this.functions })
          Lexer2.on('warning', function (warning) {
            return _this2.emit('warning', warning)
          })
          keys = keys.concat(Lexer2.extract(scriptSetupContent))
        }

        // Handle <template> block
        if (sfc.descriptor.template) {
          var templateContent = sfc.descriptor.template.content
          var compiledTemplate = compileTemplate({
            source: templateContent,
            filename: filename,
            id: filename,
          }).code
          var Lexer3 = new JavascriptLexer({ functions: this.functions })
          Lexer3.on('warning', function (warning) {
            return _this2.emit('warning', warning)
          })
          keys = keys.concat(Lexer3.extract(compiledTemplate))
        }

        return keys
      },
    },
  ])
  return VueLexer
})(BaseLexer)
export { VueLexer as default }
//# sourceMappingURL=vue-lexer.js.map
