import Community from ".."
import { allUserTypes } from '../../../utils/constants';
import t from "../../__mocks__/t";

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Community', () => {
  it('exports necessary info', () => {
    expect(Community.routeProps.path).toBe('')
    expect(Community.name(t)).toBe('menu.community')
    expect(Community.styleProps.icon).toBeDefined()
    expect(Community.subMenu).toHaveLength(12)
  });

  allUserTypes.forEach((userType) => {
    it(`contains ${userType}`, () => {
      expect(Community.accessibleBy).toContain(userType);
    });
  })
});
