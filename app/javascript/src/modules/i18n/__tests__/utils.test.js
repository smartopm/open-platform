import { getCurrentLng } from '../util';

describe('i18n utilities', () => {
  const { localStorage } = window;

  beforeAll(() => {
    delete window.localStorage;
    window.localStorage = {
      getItem: jest.fn(() => 'en')
    };
  });
  afterAll(() => {
    window.localStorage = localStorage;
  });
  it('returns current locale', () => {
    expect(getCurrentLng()).toEqual('en-US');
  });
});
