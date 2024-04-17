import { parse, compileTemplate, compileScript } from '@vue/compiler-sfc'

import BaseLexer from './base-lexer.js'
import JavascriptLexer from './javascript-lexer.js'

export default class VueLexer extends BaseLexer {
  constructor(options = {}) {
    super(options)
    this.functions = options.functions || ['$t']
  }

  extract(content, filename) {
    let keys = []
    const sfc = parse(content, { sourceMap: true, filename })

    // Handle <script> block
    if (sfc.descriptor.script) {
      const scriptContent = sfc.descriptor.script.content
      const Lexer1 = new JavascriptLexer({ functions: this.functions })
      Lexer1.on('warning', (warning) => this.emit('warning', warning))
      keys = keys.concat(Lexer1.extract(scriptContent))
    }

    // Handle <script setup> block
    if (sfc.descriptor.scriptSetup) {
      const scriptSetupContent = compileScript(sfc.descriptor, {
        id: filename,
      }).content
      const Lexer2 = new JavascriptLexer({ functions: this.functions })
      Lexer2.on('warning', (warning) => this.emit('warning', warning))
      keys = keys.concat(Lexer2.extract(scriptSetupContent))
    }

    // Handle <template> block
    if (sfc.descriptor.template) {
      const templateContent = sfc.descriptor.template.content
      const compiledTemplate = compileTemplate({
        source: templateContent,
        filename,
        id: filename,
      }).code
      const Lexer3 = new JavascriptLexer({ functions: this.functions })
      Lexer3.on('warning', (warning) => this.emit('warning', warning))
      keys = keys.concat(Lexer3.extract(compiledTemplate))
    }

    return keys
  }
}
