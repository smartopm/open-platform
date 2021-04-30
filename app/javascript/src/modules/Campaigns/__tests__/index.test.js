import Campaigns from '..'

describe('Campaigns', () => {
  it('exports necessary info', () => {
    expect(Campaigns.routeProps.path).toBe('/campaigns')
    expect(Campaigns.name).toBe('Campaigns')
    expect(Campaigns.accessibleBy).toHaveLength(1)
    expect(Campaigns.accessibleBy).toContain('admin');
  });
});
