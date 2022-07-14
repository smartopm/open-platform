import PaymentRoutesInfo from '..';
import t from '../../__mocks__/t';

describe('Payments', () => {
  it('exports necessary info', () => {
    expect(PaymentRoutesInfo.routeProps.path).toBe('/payments');
    expect(PaymentRoutesInfo.name(t)).toBe('menu.plan_plural');
    expect(PaymentRoutesInfo.featureName).toBe('Payments');
    expect(PaymentRoutesInfo.moduleName).toBe('plan_payment');
  });
});
