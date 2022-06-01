import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GuestUpdateForm from '../../Components/GuestUpdateForm';

describe('DateAndTimeForm component', () => {
  it('should render invite start and end date/time update form', async () => {
    const props = {
      onUpdate: () => jest.fn(),
      close: () => jest.fn(),
      type: 'update',
      data: {
        id: 'random-id',
        status: 'active',
        startsAt: '2022-06-01T12:00:00Z',
        endsAt: '2022-06-05T12:00:00Z',
        occursOn: ['monday', 'tuesday'],
        visitationDate: '2022-06-01T12:00:00Z',
        visitEndDate: '2022-06-05T12:00:00Z',
        loading: false
      }
    };
    const rendered = render(<GuestUpdateForm {...props} />);

    expect(rendered.queryAllByTestId('date-picker')[0]).toBeInTheDocument();
    expect(rendered.queryAllByTestId('time_picker')[0]).toBeInTheDocument();
    expect(rendered.queryAllByTestId('date-picker')).toHaveLength(2);

    expect(rendered.queryAllByTestId('time_picker')[0]).toBeInTheDocument();
    expect(rendered.queryAllByTestId('time_picker')[1]).toBeInTheDocument();
    expect(rendered.queryAllByTestId('date-picker')).toHaveLength(2);

    expect(rendered.getByTestId('update_button')).toBeInTheDocument();
    expect(rendered.getByTestId('close_button')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('update_button'));
    await waitFor(() => {
      expect(rendered.queryByTestId('loader')).toBeInTheDocument();
    });
  });
});
