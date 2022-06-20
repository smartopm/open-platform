import PaymentRoutesInfo from '..';
import t from '../../__mocks__/t';

describe('Payments', () => {
  it('exports necessary info', () => {
    expect(PaymentRoutesInfo.routeProps.path).toBe('/payments');
    expect(PaymentRoutesInfo.name(t)).toBe('menu.payment');
    expect(PaymentRoutesInfo.featureName).toBe('Transactions');
    expect(PaymentRoutesInfo.moduleName).toBe('transaction');
    expect(PaymentRoutesInfo.subMenu).toHaveLength(2);
    expect(PaymentRoutesInfo.subRoutes).toHaveLength(2);
    expect(PaymentRoutesInfo.subMenu[1].routeProps.path).toBe('/payments/pay');
  });
});
