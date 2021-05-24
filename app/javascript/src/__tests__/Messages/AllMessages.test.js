import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import AllMessages from '../../containers/Messages/AllMessages';

describe('AllMessages Component', () => {
  it('renders loader when loading form', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <AllMessages />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('common:misc.filter_message_by_category')).toBeInTheDocument()
  });
});
