import ActionFlow from ".."
import t from "../../__mocks__/t";

describe('ActionFlow', () => {
  it('exports necessary info', () => {

    expect(ActionFlow.routeProps.path).toBe('/action_flows')
    expect(ActionFlow.name(t)).toBe('misc.action_flows')
    expect(ActionFlow.styleProps.icon).toBeDefined()
    expect(ActionFlow.accessibleBy).toHaveLength(1)
    expect(ActionFlow.accessibleBy[0]).toBe('admin')
  });
});
