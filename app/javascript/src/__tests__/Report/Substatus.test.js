import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import SubStatusReportDialog, { StatusCount } from '../../components/User/SubStatusReport';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../../components/Loading';

describe('Substatus component', () => {
  it('should render the substatus modal ', async () => {
    const statusMock = {
      request: {
        query: SubStatusQuery
      },
      result: {
        data: {
          substatusQuery: {
            applied: 0,
            approved: 0,
            architectureReviewed: 2,
            interested: 0,
            built: 0,
            contracted: 0,
            inConstruction: 0,
            movedIn: 0,
            paying: 0,
            readyForConstruction: 0
          }
        }
      }
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={[statusMock]}>
          <SubStatusReportDialog open handleClose={jest.fn()} />
        </MockedProvider>
      );
    });
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByText('Substatus')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('Architecture Reviewed')).toBeInTheDocument();
      expect(container.queryByText('Approved')).toBeInTheDocument();
      expect(container.queryByText('Applied')).toBeInTheDocument();
      expect(container.queryByText('Interested')).toBeInTheDocument();
      expect(container.queryByText('In Construction')).toBeInTheDocument();
      expect(container.queryByText('Ready For Construction')).toBeInTheDocument();
    }, 200);
  });
});

describe('StatusCount component', () => {
  it('should render status count', () => {
    const container = render(<StatusCount title='Applied' count={1} />);
    expect(container.queryAllByText('Applied')[0]).toBeInTheDocument();
    expect(container.queryAllByText('1')[0]).toBeInTheDocument();
  });
});
