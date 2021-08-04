import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Payments from '../../modules/Payments/Components/Payments';
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';

describe('Payments Component', () => {
  it('renders Payments text', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <Payments />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByText('Client Name')).toBeInTheDocument()
    expect(container.queryAllByText('search.search_for')[0]).toBeInTheDocument()
    expect(container.queryByText('common:misc.add_filter')).toBeInTheDocument()
    expect(container.queryByText('Add group')).toBeInTheDocument()
    expect(container.queryByText('misc.previous')).toBeInTheDocument()
    expect(container.queryByText('misc.next')).toBeInTheDocument()
  });
});
