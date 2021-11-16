import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import IdPrintPage, { UserPrintDetail } from '../../containers/IdPrint';
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserPrint Detail component', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null
    }
  };
  it('should render correctly', () => {
    let container;
    
    act(() => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider>
            <BrowserRouter>
              <UserPrintDetail data={data} />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    })

    expect(container.queryByText('Another somebodyy')).toBeInTheDocument();
    expect(container.queryByText('misc.role: Client')).toBeInTheDocument();
    expect(container.queryByText('misc.exp: Never')).toBeInTheDocument();
    expect(container.getByTestId('download_button')).toBeInTheDocument();
    const button = container.getByTestId('download_button');
    fireEvent.click(button);
  });
it('renders id card page', () => {
    const matchProps = {
        params: { id: "59927651-9bb4-4e47-8afe-0989d03d210d"}
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <IdPrintPage match={matchProps} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
