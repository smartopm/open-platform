import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import GuestTime from '../Components/GuestTime';

describe('Should render Guest Time Component', () => {

  it('should render proper data', async() => {
    const change = jest.fn();
    const handleDays = jest.fn()
    const userData = {
        visitationDate: '2021-09-07T12:53:30.834Z',
        startTime: '2021-09-07T02:53:30.834Z',
        endTime: '2021-09-07T19:53:30.834Z',
        occursOn: ['monday', 'tuesday'],
        visitEndDate: '2021-09-17T12:53:30.834Z',
    }
    const container = render(
      <MockedThemeProvider>
        <GuestTime userData={userData} handleChange={change} handleChangeOccurrence={handleDays} />
      </MockedThemeProvider>
    );
    
    expect(container.queryByLabelText('common:misc.day_of_visit')).toBeInTheDocument()
    expect(container.queryAllByTestId('week_days')[0]).toBeInTheDocument()
    expect(container.queryAllByTestId('guest_repeats_on')[0]).toBeInTheDocument()
    expect(container.queryAllByTestId('time_picker')[0]).toBeInTheDocument()
  });
});
