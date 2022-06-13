import React from 'react';
import { render } from '@testing-library/react';

import Label from '../../../shared/label/Label';

describe('Label component', () => {
  it('should render proper the label', () => {
    const container = render(<Label title="In-Progress" color="#000" />);
    expect(container.queryByText('In-Progress')).toBeInTheDocument();
  });
});
