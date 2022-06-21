import React from 'react';
import { render } from '@testing-library/react';
import DividerWithText from '../DividerWithText';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('DividerWithText Component', () => {
  const props = {
    children: <div data-testid="content" />
  };

  it('should render correctly', () => {
    const screen = render(
      <MockedThemeProvider>
        <DividerWithText {...props} />
      </MockedThemeProvider>
    );

    expect(screen.queryByTestId('divider')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).toBeInTheDocument();
  });
});
