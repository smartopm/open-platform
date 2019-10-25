// Enzyme setup
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as Aphrodite from 'aphrodite';
import * as AphroditeNoImportant from 'aphrodite/no-important';

Aphrodite.StyleSheetTestUtils.suppressStyleInjection();
AphroditeNoImportant.StyleSheetTestUtils.suppressStyleInjection();

global.File = () => {console.log('File called')}

configure({ adapter: new Adapter() });
