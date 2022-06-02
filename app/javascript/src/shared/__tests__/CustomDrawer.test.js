import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomDrawer from '../CustomDrawer';

describe('CustomDrawer component', () => {
  it('should render correctly', () => {
    const container = render(<CustomDrawer open><p>sample text</p></CustomDrawer>);

    expect(container.queryByText('sample text')).toBeInTheDocument();
    expect(container.queryByTestId('drawer')).toBeInTheDocument();
  });
});
