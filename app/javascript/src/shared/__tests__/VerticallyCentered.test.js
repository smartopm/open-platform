import React from 'react';
import { render } from '@testing-library/react';

import VerticallyCentered from '../VerticallyCentered';

describe('VerticallyCentered', () => {
  it('should check if the VerticallyCentered component renders properly', () => {
    const wrapper = render(
      <VerticallyCentered>
        <p>Some text here</p>
      </VerticallyCentered>
    );
    expect(wrapper.queryByText('Some text here')).toBeInTheDocument();
  });
});
