import Business from ".."
import t from "../../__mocks__/t";

describe('Business', () => {
  it('exports necessary info', () => {
    expect(Business.routeProps.path).toBe('/businesses')
    expect(Business.name(t)).toBe('misc.business')
  });
});
