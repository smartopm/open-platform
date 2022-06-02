import React from 'react';
import { render } from '@testing-library/react';

import MobileMoney from '../components/MobileMoney';

describe('Mobile Money Component', () => {
  it('should render  correctly', () => {
    const wrapper = render(<MobileMoney />);

    expect(wrapper.queryByText('Nkwashi accepts mobile money!')).toBeInTheDocument();
    expect(
      wrapper.queryByText(
        "Nkwashi uses MTN's mobile money. Follow these instructions to make your payment:"
      )
    ).toBeInTheDocument();
    expect(wrapper.queryByText("Dial *303# and select 'Send Money'")).toBeInTheDocument();
    expect(wrapper.queryByText("Select Send Money to 'Mobile User' and follow the prompts")).toBeInTheDocument();
    expect(wrapper.queryByText("You and Nkwashi will receive a transaction message when the transaction is successfully completed")).toBeInTheDocument();
    expect(wrapper.queryByText("Enter Nkwashi's number '0961722433' and send the money through MTN with your full name and NRC number")).toBeInTheDocument();
  });
});
