/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FeedbackSuccess from '../../containers/Activity/FeedbackSuccess';



describe('Feedback Component', () => {
  it('renders loader when loading notes', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <FeedbackSuccess />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('feedback-txt').textContent).toContain('Thank you for your feedback');
  });
});
