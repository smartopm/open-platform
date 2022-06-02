import React from 'react';
import { render } from '@testing-library/react';
import ClientRequestForm from '../containers/ClientRequestForm';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Mounts page with no errors', () => {
  it('should render', () => {
    const { getByTestId } = render(<ClientRequestForm />);
    expect(getByTestId('iframe')).toBeInTheDocument();
  });
});
