import Business from ".."

describe('Business', () => {
  it('exports necessary info', () => {
    expect(Business.routeProps.path).toBe('/business')
    expect(Business.name).toBe('Business')
    expect(Business.accessibleBy).toHaveLength(5)
  });

  ["admin", "client", "prospective_client", "contractor", "resident"].forEach((userType) => {
    it(`contains ${userType}`, () => {
      expect(Business.accessibleBy).toContain(userType);
    });
  })
});
