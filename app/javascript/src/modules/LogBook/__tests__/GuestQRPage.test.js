import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils'; 
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import GuestQRPage from '../Components/GuestQRPage';
import { Spinner } from '../../../shared/Loading';

describe('Log Events Component', () => {
  it('renders log event component', () => {
    act(() => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={authState}>
            <GuestQRPage
              match={{params: {id: '22'}}}
            />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      expect(container.queryByText('guest.qr_code')).toBeInTheDocument();
    });
  });

});