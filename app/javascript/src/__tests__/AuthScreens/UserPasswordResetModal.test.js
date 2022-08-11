import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Utils as QbUtils } from 'react-awesome-query-builder';
import { UserPasswordResetMutation } from '../../graphql/mutations/user';
import UserPasswordResetModal from '../../components/AuthScreens/UserPasswordResetModal';
import { SnackbarContext } from '../../shared/snackbar/Context';
import { mockedSnackbarProviderProps } from '../../modules/__mocks__/mock_snackbar';
import { Context } from '../../containers/Provider/AuthStateProvider';
import authState from '../../__mocks__/authstate';

describe('User Password Reset modal component', () => {
  it('should render the password reset properly', async () => {
    const openModalHandler = jest.fn();
    const data = {
      user: {
        id: '1',
        name: 'X User',
        username: 'X User',
      },
    };

    const userPasswordResetDataMock = {
      request: {
        query: UserPasswordResetMutation,
        variables: {
          userId: '1',
        },
      },
      result: {
        data: {
          resetPassword: {
            username: 'TheBigBoss',
            password: 'TheBigBosspassword1234',
          },
        },
      },
    };
    const props = {
      data,
      openModal: true,
      setOpenModal: openModalHandler,
    };
    const container = render(
      <MockedProvider mocks={[userPasswordResetDataMock]} addTypename={false}>
        <Context.Provider value={authState}>
          <SnackbarContext.Provider value={{ ...mockedSnackbarProviderProps }}>
            <UserPasswordResetModal {...props} />
          </SnackbarContext.Provider>
        </Context.Provider>
      </MockedProvider>
    );

    expect(container.queryByText('users.confirm_reset_password')).toBeInTheDocument();
    const resetBtn = container.queryByText('common:misc.reset');
    expect(resetBtn).toBeInTheDocument();
    const closeIcon = container.queryByTestId('password-reset-close-icon');
    expect(closeIcon).toBeInTheDocument();

    fireEvent.click(closeIcon);
    expect(openModalHandler).toHaveBeenCalled();

    fireEvent.click(resetBtn);
    await waitFor(() => {
      expect(openModalHandler).toBeCalled();
    });
  });
});
