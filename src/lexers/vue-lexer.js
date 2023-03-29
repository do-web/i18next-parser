import { parse, compileTemplate } from '@vue/compiler-sfc'

import BaseLexer from './base-lexer.js'
import JavascriptLexer from './javascript-lexer.js'

export default class VueLexer extends BaseLexer {
  constructor(options = {}) {
    super(options)

    this.functions = options.functions || ['$t']
  }

  extract(content, filename) {
    let keys = []

    const Lexer = new JavascriptLexer()
    Lexer.on('warning', (warning) => this.emit('warning', warning))
    keys = keys.concat(Lexer.extract(content))

    // Parse the SFC content
    const sfc = parse(content, { sourceMap: true, filename })
    const scriptContent = sfc.descriptor.script
      ? sfc.descriptor.script.content
      : ''
    const templateContent = sfc.descriptor.template
      ? sfc.descriptor.template.content
      : ''

    // Extract i18n keys from the script content
    const Lexer2 = new JavascriptLexer({ functions: this.functions })
    Lexer2.on('warning', (warning) => this.emit('warning', warning))
    keys = keys.concat(Lexer2.extract(scriptContent))

    // Compile the template content and extract i18n keys
    if (templateContent) {
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
