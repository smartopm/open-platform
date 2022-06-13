/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import processMock from '../__mocks__/processMock';
import ProcessItem from '../Components/ProcessItem';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('ProcessItem', () => {
  it('renders process template list item with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    const menuList = [
      {
        content: 'payment.misc.payment_reminder',
        isAdmin: true,
        handleClick: () => jest.fn()
      }
    ];

    const menuData = {
      menuList,
      handleMenu: jest.fn,
      anchorEl: null,
      open: false,
      handleClose: () => jest.fn
    };

    render(
      <MockedProvider mocks={[]} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessItem process={processMock} menuData={menuData} />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('process_name')).toBeInTheDocument();
      expect(screen.getByTestId('process_name').textContent).toEqual(processMock.name);
      expect(screen.queryAllByText('templates.edit_task_list')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.edit_form')[0]).toBeInTheDocument();
    });
  });
});
