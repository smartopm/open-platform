import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import SubStatusReportDialog from '../Components/SubStatusReport';
import { SubStatusQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import StatusCount from '../../../shared/Status';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Substatus component', () => {
  it('should render the substatus modal', async () => {
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
            buildingPermitApproved: 0,
            constructionInProgress: 0,
            constructionCompleted: 0,
            constructionInProgressSelfBuild: 0,
            residentsCount: 0
          }
        }
      }
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={[statusMock]} addTypename={false}>
          <MockedThemeProvider>
            <SubStatusReportDialog open handleClose={jest.fn()} handleFilter={jest.fn()} />
          </MockedThemeProvider>
        </MockedProvider>
      );
    });
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByText('Customer Journey Stage')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('Plots Fully Purchased')).toBeInTheDocument();
      expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument();
      expect(container.queryByText('Building Permit Approved')).toBeInTheDocument();
      expect(container.queryByText('Construction in Progress')).toBeInTheDocument();
      expect(container.queryByText('Construction Completed')).toBeInTheDocument();
    }, 200);
  });
});

describe('StatusCount component', () => {
  it('should render status count', () => {
    const container = render(
      <StatusCount title="Plots Fully Purchased" count={1} handleFilter={jest.fn()} />
    );
    expect(container.queryAllByText('Plots Fully Purchased')[0]).toBeInTheDocument();
    expect(container.queryAllByText('1')[0]).toBeInTheDocument();
  });
});
