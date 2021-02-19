import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import SubStatusReportDialog from '../../components/User/SubStatusReport';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import StatusCount from '../../shared/Status';

describe('Substatus component', () => {
  it('should render the substatus modal ', async () => {
    const statusMock = {
      request: {
        query: SubStatusQuery
      },
      result: {
        data: {
          substatusQuery: {
            plotsFullyPurchased: 4,
            eligibleToStartConstruction: 0,
            floorPlanPurchased: 0,
            constructionApproved: 0,
            constructionInProgress: 0,
            constructionCompleted: 0,
          }
        }
      }
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={[statusMock]}>
          <SubStatusReportDialog open handleClose={jest.fn()} handleFilter={jest.fn()} />
        </MockedProvider>
      );
    });
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByText('Substatus')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('Plots Fully Purchased')).toBeInTheDocument();
      expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument();
      expect(container.queryByText('Construction Approved')).toBeInTheDocument();
      expect(container.queryByText('Construction in Progress')).toBeInTheDocument();
      expect(container.queryByText('Construction Completed')).toBeInTheDocument();
      expect(container.queryByText('Census')).toBeInTheDocument();
    }, 200);
  });
});

describe('StatusCount component', () => {
  it('should render status count', () => {
    const container = render(<StatusCount title="Applied" count={1} handleFilter={jest.fn()} />);
    expect(container.queryAllByText('Applied')[0]).toBeInTheDocument();
    expect(container.queryAllByText('1')[0]).toBeInTheDocument();
  });
});
