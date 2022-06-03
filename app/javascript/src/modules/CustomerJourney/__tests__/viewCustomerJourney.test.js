import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import ViewCustomerJourney from '../Components/ViewCustomerJourney';

describe('User Detail Component', () => {
  it('should render the user detail component', () => {
    const translate = jest.fn();
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ViewCustomerJourney translate={translate} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('view')).toBeInTheDocument()
    fireEvent.click(container.queryByTestId('customer'))
  });
});
