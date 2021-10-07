import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import GuestTime from '../Components/GuestTime';

describe('Should render Guest Time Component', () => {
  it('should render proper data', async () => {
    const change = jest.fn();
    const handleDays = jest.fn();
    const userData = {
      visitationDate: '2021-09-07T12:53:30.834Z',
      startsAt: '2021-09-07T02:53:30.834Z',
      endTime: '2021-09-07T19:53:30.834Z',
      occursOn: ['monday', 'tuesday'],
      visitEndDate: '2021-09-17T12:53:30.834Z'
    };
    const container = render(
      <MockedThemeProvider>
        <GuestTime
          userData={userData}
          handleChange={change}
          handleChangeOccurrence={handleDays}
          disableEdit={jest.fn()}
        />
      </MockedThemeProvider>
    );

    expect(container.queryByLabelText('common:misc.day_of_visit')).toBeInTheDocument();
    expect(container.queryAllByTestId('week_days')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('guest_repeats_on')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('time_picker')[0]).toBeInTheDocument();

    const dayOfVisit = container.queryByTestId('day_of_visit_input');
    fireEvent.change(dayOfVisit, { target: { value: '2021-09-09' } });
    expect(dayOfVisit.value).toBe('2021-09-09');

    const startTime = container.queryByTestId('start_time_input');
    fireEvent.change(startTime, { target: { value: '2021-09-09 10:30' } });
    expect(startTime.value).toBe('2021-09-09 10:30');

    const endTime = container.queryByTestId('end_time_input');
    fireEvent.change(endTime, { target: { value: '2021-09-09 11:30'} });
    expect(endTime.value).toBe('2021-09-09 11:30');

    const repeatsUntil = container.queryByTestId('repeats_until_input');
    fireEvent.change(repeatsUntil, { target: { value: '2021-09-29' },  });
    expect(repeatsUntil.value).toBe('2021-09-29');

    const days = container.queryAllByTestId('week_days');
    fireEvent.click(days[0]);
    expect(handleDays).toBeCalled();
  });
});
