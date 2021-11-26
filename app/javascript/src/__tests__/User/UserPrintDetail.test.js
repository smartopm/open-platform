import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import IdPrintPage, { qrCodeAddress, UserPrintDetail } from '../../containers/IdPrint';
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
  it('should render correctly', async () => {
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

    await waitFor(() => {
      expect(container.queryByText('Another somebodyy')).toBeInTheDocument();
      expect(container.getByTestId('download_button')).toBeInTheDocument();
      expect(container.getByTestId('error')).toBeInTheDocument();
      expect(container.getByTestId('error').textContent).toBe("");
      expect(container.queryByTestId('download_button').textContent).toContain('misc.download_id');
      const button = container.getByTestId('download_button');
      fireEvent.click(button);
    })
  });
it('renders id card page', async () => {
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
    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    })
  });

  it('test for the qr code helper', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-01-01 01:00'));
    const link = qrCodeAddress('somefsuhdw83928329')
    expect(link).toContain("http://localhost/user/somefsuhdw83928329/1609462800000")
  })
});
