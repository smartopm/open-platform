import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { LabelsQuery } from '../../../graphql/queries';
import LabelList from '../Components/LabelList';

describe('Label List Component', () => {
  it('should render without error', async () => {
    const mocks = {
      request: {
        query: LabelsQuery,
        variables: { limit: 5, offset: 0 }
      },
      result: {
        data: {
          labels: [
            {
              id: '2b3f902b-eb44-42a1-b2f3',
              shortDesc: 'com_news_sms',
              color: '#fff',
              description: 'this',
              userCount: 1,
              groupingName: 'Status'
            },
            {
              id: '2b3f902b-eb44-42a1-b2f',
              shortDesc: 'com_news_email',
              color: '#fff',
              description: 'this',
              userCount: 3,
              groupingName: 'Status'
            }
          ]
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <LabelList userType="admin" />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(
      () => {
        expect(container.queryByText('common:table_headers.labels')).toBeInTheDocument();
        expect(
          container.queryByText('common:table_headers.labels_description')
        ).toBeInTheDocument();
        expect(
          container.queryByText('common:table_headers.labels_total_no_of_users')
        ).toBeInTheDocument();
        expect(container.queryByTestId('button')).toBeInTheDocument();
        fireEvent.click(container.queryByTestId('button'));
        expect(container.queryByText('label.new_dialog_title')).toBeInTheDocument();
        expect(container.queryByTestId('dialog_cancel')).toBeInTheDocument();
        fireEvent.click(container.queryByTestId('dialog_cancel'));
        expect(container.queryByText('com_news_sms')).toBeInTheDocument();
        expect(container.queryByText('com_news_email')).toBeInTheDocument();
        expect(container.queryAllByTestId('short_desc')).toHaveLength(2);
        expect(container.queryByTestId('prev-btn')).toHaveTextContent('misc.previous');
        expect(container.queryByTestId('prev-btn')).toBeDisabled();
        expect(container.queryByTestId('next-btn')).toHaveTextContent('misc.next');
        fireEvent.click(container.queryByTestId('next-btn'));
      }
    );
  });
});
