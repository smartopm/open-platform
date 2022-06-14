import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import UserJourney, { getSubStatusChangeContent, getInitialSubStatusContent, subsStatusLogsFormatter } from '../../Users/Components/UserJourney';

const log =  {
  id: '90849232-234234-sdfloeop34-9-',
  startDate: '2020-03-01',
  stopDate: '2020-03-03',
  previousStatus: 'plots_fully_purchased',
  newStatus: 'eligible_to_start_construction'
}
describe('<UserJourney />', () => {
  it('render correctly', () => {
    const props = {
      user: {
        id: '90849232-234234fsdf-232',
        name: 'User Name',
        substatusLogs: [
          log,
          {
            id: '90849232-234234-sdfloeop34-',
            startDate: new Date(),
            stopDate: new Date(),
            previousStatus: 'construction_in_progress_self_build',
            newStatus: 'plots_fully_purchased'
          }
        ]
      }
    };
    const refetch = jest.fn();
    const container = render(
      <MockedProvider>
        <UserJourney data={props} refetch={refetch} />
      </MockedProvider>
    );

    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument();
    expect(container.queryAllByTestId('user_journey_content')[0].textContent).toContain('User Name users.user_journey_status Plots Fully Purchased users.to Eligible to start Construction users.between 2020-03-01 users.and')
    expect(container.queryAllByTestId('edit_journey')[0]).toBeInTheDocument()
    expect(container.queryAllByTestId('edit_journey')).toHaveLength(2)
  });
  it('should show when there are no logs yet', () => {
    const props = {
      user: {
        id: '90849232-234234fsdf-232',
        name: 'User Name',
        substatusLogs: []
      }
    };
    const refetch = jest.fn();
    const container = render(
      <MockedProvider>
        <UserJourney data={props} refetch={refetch} />
      </MockedProvider>
    );
    expect(container.queryByText('users.user_journey_message')).toBeInTheDocument();
  })
});

describe('user journey utils', () => {
  it('should check the substatus content formatter', () => {
    const subWrapper = render(getSubStatusChangeContent({ ...log }))
    expect(subWrapper.queryByTestId('log_content').textContent).toContain(' users.user_journey_status Plots Fully Purchased users.to Eligible to start Construction users.between 2020-03-01 users.and')
  })

  it('should render for first or last items that dont have stopDate', () => {
    const anotherLog =  {
      id: '90849232-234234-sdfloeop34-9',
      date: '2020-03-01',
      previousStatus: 'plots_fully_purchased',
      newStatus: 'eligible_to_start_construction'
    }
    const subWrapper = render(getInitialSubStatusContent({ ...anotherLog }))
    expect(subWrapper.queryByTestId('initial_log_content').textContent).toContain(' users.change users.from Plots Fully Purchased users.to Eligible to start Construction 2020-03-01')
  })
  it('should format the substatus', () => {
    const t = jest.fn();
    const logs = [
      {
        ...log,
        userId: '2384923842'
      }
    ]
    const formattedLogs = subsStatusLogsFormatter(logs, t)
    expect(formattedLogs[0].previousStatus).toContain('plots_fully_purchased')
    expect(formattedLogs[0].startDate).toContain('2020-03-01')
    expect(formattedLogs[0].stopDate).toContain('2020-03-03')
  })
})
