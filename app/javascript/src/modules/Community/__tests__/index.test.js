import Community from '..';
import t from '../../__mocks__/t';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Community', () => {
  it('exports necessary info', () => {
    expect(Community.routeProps.path).toBe('');
    expect(Community.name(t)).toBe('menu.community');
    expect(Community.styleProps.icon).toBeDefined();
    // removed permits and request forms menu item
    expect(Community.subMenu).toHaveLength(14);
  });
});
