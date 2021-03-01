import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import ShowroomLogs from '../../containers/showroom/ShowroomLogs';

describe('Home Component', () => {
  it('renders Home texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ShowroomLogs />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
