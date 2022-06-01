import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateAndTimeForm from '../components/DateAndTimeForm';

describe('DateAndTimeForm component', () => {
  it('should contain the start and end date/time for the form', async () => {
    const props = {
      start: '2022-06-01T12:00:00Z',
      end: '2022-06-05T12:00:00Z',
      update: () => jest.fn(),
      data: { loading: false, msg: '' }
    };
    const rendered = render(<DateAndTimeForm {...props} />);

    expect(rendered.getByTestId('start_date_time')).toBeInTheDocument();

    expect(rendered.getByTestId('end_date_time')).toBeInTheDocument();
  });
});
