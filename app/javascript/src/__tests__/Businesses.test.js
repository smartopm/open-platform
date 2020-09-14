/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import Business from '../components/Business/BusinessList';

describe('It tests the business directory list', () => {

    const props = {
        businessData: {
            businesses: [
                {
                    category: 'health',
                    createdAt: "2020-06-30T15:54:34Z",
                    homeUrl: null,
                    name: "Artist",
                    userId: "4f1492a9-5451-4f0a-b35d-bc567e1e56b7",
                    id: "43c596de-e07f-4d0f-a727-53fb4b8b44ce",
                    description: null,
                    status: 'verified'
                }
            ]
        },
        userType: 'resident'
    }
    it('It should render business category', () => {
        const container = render(
          <BrowserRouter>
            <MockedProvider mocks={[]}>
              <Business {...props} />
            </MockedProvider>
          </BrowserRouter>)
        expect(container.queryByTestId('business-category').textContent).toContain('Health Service')
        expect(container.queryByTestId('business-name').textContent).toContain('Artist')
        expect(container.queryByText('Create a Business')).toBeNull()
    });

});
