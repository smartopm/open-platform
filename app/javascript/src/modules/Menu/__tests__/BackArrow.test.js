import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import routeData, { MemoryRouter } from 'react-router';
import ArrowBack from '../component/BackArrow';

describe('It should test the ArrowBack component', () => {
  const mockHistory = {
    goBack: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should render ArrowBack', () => {
    const container = render(
      <MemoryRouter>
        <MockedProvider>
          <ArrowBack path="/path" />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(container.queryByTestId('arrow')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('arrow'))
    expect(mockHistory.goBack).toBeCalled()
  });

  it('should not render ArrowBack', () => {
    const container = render(
      <MemoryRouter>
        <MockedProvider>
          <ArrowBack path="/" />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(container.queryByTestId('arrow')).not.toBeInTheDocument();
  });
});
