import Campaigns from '..'
import t from '../../__mocks__/t';

describe('Campaigns', () => {
  it('exports necessary info', () => {
    expect(Campaigns.routeProps.path).toBe('/campaigns')
    expect(Campaigns.name(t)).toBe('misc.campaigns')
    expect(Campaigns.accessibleBy).toHaveLength(1)
    expect(Campaigns.accessibleBy).toContain('admin');
  });
});
