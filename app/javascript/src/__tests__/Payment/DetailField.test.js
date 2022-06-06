import React from 'react';
import { render } from '@testing-library/react';

import DetailsField from '../../shared/DetailField';

describe('Detail Component', () => {
  it('renders correctly', () => {
    const container = render(<DetailsField title="Some Title" value="Some Value" />);
    expect(container.queryByTestId('text-field').value).toContain('Some Value');
  });
});
