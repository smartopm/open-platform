import React from 'react';
import { render } from '@testing-library/react';
import FixedHeader from '../FixedHeader';


describe('AddmoreButton', () => {
  it('should render the container fixed header', () => {
    const container = render(
      <FixedHeader>
        <div>Sample Text</div>
      </FixedHeader>
    );

    expect(container.queryByTestId('contained-header')).toBeInTheDocument();
    expect(container.queryByText('Sample Text')).toBeInTheDocument();
  });

  it('should render the fullwidth fixed header', () => {
    const container = render(
      <FixedHeader fullWidth>
        <div>Sample Text</div>
      </FixedHeader>
    );
    expect(container.queryByTestId('fullwidth-header')).toBeInTheDocument();
    expect(container.queryByText('Sample Text')).toBeInTheDocument();
  });
});
