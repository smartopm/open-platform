import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import MockedThemeProvider from '../../modules/__mocks__/mock_theme';
import SplitScreen from '../SplitScreen';

describe('Drawer', () => {
  it('renders drawer component', async () => {
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <SplitScreen open onClose={jest.fn()} logoStyles={{}}>
            <div>Split Screen</div>
          </SplitScreen>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    expect(container.queryByTestId('drawer')).toBeInTheDocument();
    expect(container.queryByText('Split Screen')).toBeInTheDocument();
  });
});
