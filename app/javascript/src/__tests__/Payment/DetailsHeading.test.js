import React from 'react';
import { render } from '@testing-library/react';

import DetailHeading from '../../shared/DetailHeading';

describe('It should test the detail heading component', () => {
  it('should render detail heading', () => {
    const container = render(<DetailHeading title="Heading" />);
    expect(container.queryByText('Heading')).toBeInTheDocument();
  });
});
