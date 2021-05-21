import React from 'react';
import { render } from '@testing-library/react';
import PaymentPlan from '../../components/LandParcels/PaymentPlan';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('PaymentPlan Component', () => {
  it('should render the given text', () => {
    const container = render(
      <MockedThemeProvider>
        <PaymentPlan type="lease" percentage="100%" />
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('payment_plan').textContent).toContain('Plan: lease/100% of latest valuation')
  });
});
