import ActionFlow from ".."

describe('ActionFlow', () => {
  it('exports necessary info', () => {

    expect(ActionFlow.routeProps.path).toBe('/action_flows')
    expect(ActionFlow.name).toBe('Action Flows')
    expect(ActionFlow.styleProps.icon).toBeDefined()
    expect(ActionFlow.accessibleBy).toHaveLength(1)
    expect(ActionFlow.accessibleBy[0]).toBe('admin')
  });
});
