import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import PaymentPlan from '../../components/LandParcels/PaymentPlan';
import { theme } from '../../themes/nkwashi/theme';

describe('PaymentPlan Component', () => {
  it('should render the given text', () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <PaymentPlan type="lease" percentage="100%" />
      </ThemeProvider>
    );
    expect(container.queryByTestId('payment_plan').textContent).toContain('Plan: lease/100% of latest valuation')
  });
});
