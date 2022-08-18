/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FeedbackSuccess from '../Components/FeedbackSuccess';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Feedback Component', () => {
  it('renders loader when loading notes', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <FeedbackSuccess />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('feedback-txt').textContent).toContain(
      'feedback.thankyou_for_feedback'
    );
  });
});
