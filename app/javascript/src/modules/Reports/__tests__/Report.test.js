import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import FormSubmissionsQuery from '../graphql/report_queries';
import Report from '../components/Report';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';

describe('Report Component', () => {
  it('should mount component correctly', async () => {
    const data = [
      {
        id: 'd57b81b7-6388-401b-ae4d-28cadfb92aae',
        value: '{"checked"=>"3", "label"=>"Ano"}',
        fieldName: 'Ano'
      },
      {
        id: '7daa1af6-d299-4513-acc3-1039b7a9c3a3',
        value: null,
        fieldName: '4rd '
      }
    ];
    const mock = [
      {
        request: {
          query: FormSubmissionsQuery,
          variables: { userId: '279546' }
        },
        result: {
          data: {
            formSubmission: data
          }
        }
      }
    ];
    const container = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={mock}>
            <Report />
          </MockedProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    expect(container.queryByText('misc.generate_report')).toBeInTheDocument()
    expect(container.queryByText('misc.pick_start_date')).toBeInTheDocument()
    expect(container.queryByText('misc.pick_end_date')).toBeInTheDocument()
  });
});
