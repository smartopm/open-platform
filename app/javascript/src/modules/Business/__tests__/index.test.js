import Business from ".."
import t from "../../__mocks__/t";

describe('Business', () => {
  it('exports necessary info', () => {
    expect(Business.routeProps.path).toBe('/businesses')
    expect(Business.name(t)).toBe('misc.business')
    expect(Business.accessibleBy).toHaveLength(5)
  });

  ["admin", "client", "prospective_client", "contractor", "resident"].forEach((userType) => {
    it(`contains ${userType}`, () => {
      expect(Business.accessibleBy).toContain(userType);
    });
  })
});
