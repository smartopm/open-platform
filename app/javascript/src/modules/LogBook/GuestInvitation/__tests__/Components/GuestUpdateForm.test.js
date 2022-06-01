import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GuestUpdateForm from '../../Components/GuestUpdateForm';

describe('DateAndTimeForm component', () => {
  it('should contain the start and end date/time for the form', async () => {
    const props = {
      start: '2022-06-01T12:00:00Z',
      end: '2022-06-05T12:00:00Z',
      update: () => jest.fn(),
      close: () => jest.fn(),
      type: 'update',
      data: { loading: false, msg: '' }
    };
    const rendered = render(<GuestUpdateForm {...props} />);

    expect(rendered.getByTestId('start_date_time')).toBeInTheDocument();

    expect(rendered.getByTestId('end_date_time')).toBeInTheDocument();
  });
});
