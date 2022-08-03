import React from 'react';
import { render } from '@testing-library/react';

import IconWithLabel from '../../label/IconWithLabel';

describe('IconWithLabel Component', () => {
  const props = {
    children: <div data-testid="label-icon" />,
    iconColor: '#000'
  };

  it('should render icon only if label is not required', () => {
    const screen = render(<IconWithLabel {...props} />);

    expect(screen.queryByTestId('label-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-label')).not.toBeInTheDocument();
  });

  it('should render icon with label if label prop is true', () => {
    const screen = render(<IconWithLabel {...props} isLabel data={5} />);

    expect(screen.queryByTestId('icon-label')).toBeInTheDocument();
    expect(screen.queryByTestId('label-icon')).toBeInTheDocument();
  });
});
