import React from 'react';
import { fireEvent, render } from '@testing-library/react';

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

    expect(container.queryAllByTestId('week_days')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('guest_repeats_on')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('time_picker')[0]).toBeInTheDocument();

    const dayOfVisit = container.queryAllByTestId('date-picker')[0];
    const dayInput = dayOfVisit.querySelector('input')
    fireEvent.change(dayInput, { target: { value: '2021-09-09' } });
    expect(dayInput.value).toBe('2021-09-09');

    const startTime = container.queryAllByTestId('time_picker')[0];
    const startInput = startTime.querySelector('input')
    fireEvent.change(startInput, { target: { value: '2021-09-09 10:30' } });
    expect(startInput.value).toBe('2021-09-09 10:30');

    const endTime = container.queryAllByTestId('time_picker')[1];
    const endInput = endTime.querySelector('input')
    fireEvent.change(endInput, { target: { value: '2021-09-09 11:30' } });
    expect(endInput.value).toBe('2021-09-09 11:30');

    const repeatsUntil = container.queryAllByTestId('date-picker')[1];
    const repeatInput = repeatsUntil.querySelector('input')
    fireEvent.change(repeatInput, { target: { value: '2021-09-29' } });
    expect(repeatInput.value).toBe('2021-09-29');

    const days = container.queryAllByTestId('week_days');
    fireEvent.click(days[0]);
    expect(handleDays).toBeCalled();
  });
});
