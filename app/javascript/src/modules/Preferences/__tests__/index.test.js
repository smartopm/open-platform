import Preferences from ".."
import t from "../../__mocks__/t";

describe('Preferences', () => {
  it('exports necessary info', () => {
    expect(Preferences.routeProps.path).toBe('/settings')
    expect(Preferences.name(t)).toBe('misc.preferences')
    expect(Preferences.featureName).toBe('Preferences')
  });
});
