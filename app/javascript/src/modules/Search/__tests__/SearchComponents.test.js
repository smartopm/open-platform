import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import SearchContainer, { NewRequestButton, Results } from '../Components/Search';
import authState from '../../../__mocks__/authstate';

describe('new request button', () => {
  it('should render the correct button', () => {
    const container = render(
      <BrowserRouter>
        <NewRequestButton />
      </BrowserRouter>
    );
    expect(container.queryByText('search.create_request')).not.toBeNull();
    expect(container.queryByText('search.create_request')).toBeInTheDocument();
  });
});

describe('search result component', () => {
  it('should return no results when nothing found', () => {
    const props = {
      data: {
        userSearch: []
      },
      loading: false,
      called: true,
      authState: {
        user: {
          userType: 'client'
        }
      }
    };
    const container = render(
      <BrowserRouter>
        <Results {...props} />
      </BrowserRouter>
    );
    expect(container.queryByText('search.no_results')).not.toBeNull();
    expect(container.queryByText('search.no_results')).toBeInTheDocument();
  });
  it('should return create request button when admin is logged in', async () => {
    const props = {
      data: {
        userSearch: []
      },
      loading: false,
      called: true
    };
    const container = render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <Results {...props} />
        </BrowserRouter>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByText('search.create_request')).toBeInTheDocument();
    });
  });

  it('should display the returned results', async () => {
    const props = {
      data: {
        userSearch: [
          {
            name: 'Mocked Jane D',
            id: 'ee6df98a-8016',
            phoneNumber: null,
            roleName: 'Admin',
            extRefId: '2020/1/230'
          },
          {
            name: 'Mocked John',
            id: '685019cc-05f3',
            phoneNumber: '2609715',
            roleName: '',
            extRefId: '2019/19/190'
          }
        ]
      },
      loading: false,
      called: true,
      authState: {
        user: {
          userType: 'admin'
        }
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Results {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('Mocked John')).toBeInTheDocument();
      expect(container.queryByText('Mocked Jane D')).toBeInTheDocument();
      expect(container.queryByText('2020/1/230')).toBeInTheDocument();
      expect(container.queryByText('2019/19/190')).toBeInTheDocument();
      expect(container.getAllByTestId('link_search_user')).toHaveLength(2);
    }, 5);
  });
  it('should render properly', async () => {
    const location = { state: { from: '/somewhere' } };
    render(
      <MockedProvider>
        <BrowserRouter>
          <SearchContainer location={location} />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });
});
