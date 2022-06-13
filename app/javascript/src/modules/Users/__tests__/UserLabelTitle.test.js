import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserLabelTitle from '../Components/UserLabelTitle';

describe('User Label Title Component', () => {
  it('should render the user label title component when labelOpen is true', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserLabelTitle isLabelOpen setIsLabelOpen={jest.fn()} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('label_toggler')).toHaveTextContent('label:label.labels');
    expect(container.queryByTestId('labels_open_icon')).toBeInTheDocument();
  });

  it('should render the user label title component when labelOpen is false', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserLabelTitle isLabelOpen={false} setIsLabelOpen={jest.fn()} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('labels_closed_icon')).toBeInTheDocument();
  });
});
