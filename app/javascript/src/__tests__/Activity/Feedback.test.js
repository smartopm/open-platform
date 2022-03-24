/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Feedback from '../../containers/Activity/Feedback';

describe('Feedback Component', () => {
  it('renders necessary elements', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Feedback />
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
