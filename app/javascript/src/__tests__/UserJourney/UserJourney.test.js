import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import UserJourney, { getSubStatusChangeContent, getInitialSubStatusContent, subsStatusLogsFormatter } from '../../components/User/UserJourney';

const log =  {
  id: '90849232-234234-sdfloeop34-',
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
    expect(container.queryAllByTestId('user_journey_content')[0].textContent).toContain('User Name changed status from Plots Fully Purchased to Eligible to start Construction between 2020-03-01 and 2020-03-03')
    expect(container.queryAllByTestId('edit_journey')[0]).toBeInTheDocument()
    expect(container.queryAllByTestId('edit_journey')).toHaveLength(2)
  });
});

describe('user journey utils', () => {
  it('should check the substatus content formatter', () => {
    const subWrapper = render(getSubStatusChangeContent({ ...log }))
    expect(subWrapper.queryByTestId('log_content').textContent).toContain(' changed status from Plots Fully Purchased to Eligible to start Construction between 2020-03-01 and 2020-03-03')
  })
  
  it('should render for first or last items that dont have stopDate', () => {
    const anotherLog =  {
      id: '90849232-234234-sdfloeop34-',
      date: '2020-03-01',
      previousStatus: 'plots_fully_purchased',
      newStatus: 'eligible_to_start_construction'
    }
    const subWrapper = render(getInitialSubStatusContent({ ...anotherLog }))
    expect(subWrapper.queryByTestId('initial_log_content').textContent).toContain(' changed status from Eligible to start Construction to Plots Fully Purchased 2020-03-01')
  })
  it('should format the substatus', () => {
    const logs = [
      {
        ...log,
        userId: '2384923842'
      }
    ]
    const formattedLogs = subsStatusLogsFormatter(logs)
    expect(formattedLogs[0].previousStatus).toContain('plots_fully_purchased')
    expect(formattedLogs[0].startDate).toContain('2020-03-01')
    expect(formattedLogs[0].stopDate).toContain('2020-03-03')
  })
})
