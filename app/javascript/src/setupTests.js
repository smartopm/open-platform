/* eslint-disable */
// Enzyme setup
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as Aphrodite from 'aphrodite';
import * as AphroditeNoImportant from 'aphrodite/no-important';
import { JSDOM } from 'jsdom';
import ReactGA from 'react-ga';
import '@testing-library/jest-dom/extend-expect';

ReactGA.initialize('dummy', { testMode: true });

Aphrodite.StyleSheetTestUtils.suppressStyleInjection();
AphroditeNoImportant.StyleSheetTestUtils.suppressStyleInjection();

global.File = () => {
  console.log('File called');
};

configure({ adapter: new Adapter() });

const url = 'http://localhost';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url });

const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
  platform: 'Win32'
};
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};
copyProps(window, global);

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
});
global.File = class MockFile {
  constructor(parts, filename, type) {
    this.parts = parts;
    this.name = filename;
    this.type = type;
  }
};
