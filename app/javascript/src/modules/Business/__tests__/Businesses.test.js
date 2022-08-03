import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Business from '../Components/BusinessList';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It tests the business directory list', () => {
  const props = {
    businessData: {
      businesses: [
        {
          category: 'health',
          createdAt: '2020-06-30T15:54:34Z',
          homeUrl: null,
          name: 'Artist',
          userId: '4f1492a9-5451-4f0a-b35d-bc567e1e56b7',
          id: '43c596de-e07f-4d0f-a727-53fb4b8b44ce',
          description: null,
          status: 'verified'
        }
      ]
    },
    authState,
    refetch: jest.fn()
  };
  it('should render business category', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <Business {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('business-category').textContent).toContain('Health Service');
    expect(container.queryByTestId('business-name').textContent).toContain('Artist');
    expect(container.queryByText('form_actions.create_business')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(container.queryByTestId('open_menu'));
      expect(container.queryByText('menu.delete')).toBeInTheDocument();
      expect(container.queryByText('menu.view_details')).toBeInTheDocument();
      fireEvent.click(document);
      fireEvent.click(container.queryByText('form_actions.create_business'));
      expect(container.queryAllByText('form_actions.create_business')[0]).toBeInTheDocument();
    });
  });
});
