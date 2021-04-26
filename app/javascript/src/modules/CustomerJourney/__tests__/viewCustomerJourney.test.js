import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import ViewCustomerJourney from '../Components/ViewCustomerJourney';

describe('User Detail Component', () => {
  it('should render the user detail component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ViewCustomerJourney />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('view')).toHaveTextContent('View Customer Journey')
    fireEvent.click(container.queryByTestId('customer'))
  });
});
