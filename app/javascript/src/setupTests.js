// Enzyme setup
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as Aphrodite from 'aphrodite'
import * as AphroditeNoImportant from 'aphrodite/no-important'
import { JSDOM } from 'jsdom'

Aphrodite.StyleSheetTestUtils.suppressStyleInjection()
AphroditeNoImportant.StyleSheetTestUtils.suppressStyleInjection()

global.File = () => {
  console.log('File called')
}

configure({ adapter: new Adapter() })

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function(id) {
  clearTimeout(id)
}
copyProps(window, global)
