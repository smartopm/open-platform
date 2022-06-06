/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Feedback from '../../containers/Activity/Feedback';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('Feedback Component', () => {
  it('renders necessary elements', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Feedback />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const thumbDownIcon = container.queryByTestId('thumbdown-icon');

    expect(thumbDownIcon).toBeInTheDocument();
    expect(container.queryByTestId('thumbup-icon')).toBeInTheDocument();
    expect(container.queryByTestId('feedback-form')).toBeNull();

    fireEvent.click(thumbDownIcon);
    expect(container.queryByTestId('feedback-form')).toBeInTheDocument();
  });
});
