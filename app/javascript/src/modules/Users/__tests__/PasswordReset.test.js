import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Utils as QbUtils } from 'react-awesome-query-builder';
import { ResetUserPasswordUserMutation } from '../../../graphql/mutations/user';
import PasswordReset from '../Components/PasswordReset';
import { SnackbarContext } from '../../../shared/snackbar/Context';
import { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

describe('Password Reset component', () => {
  it('should render the password reset properly', async () => {
    const openModalHandler = jest.fn();
    const data = {
      user: {
        id: '1',
        name: 'X User',
        username: 'X User',
      },
    };

    const passwordResetDataMock = {
      request: {
        query: ResetUserPasswordUserMutation,
        variables: {
          userId: '1',
          username: 'X User',
          password: 'a889a98b-0123-445',
        },
      },
      result: {
        data: {
          resetPassword: {
            success: true,
          },
        },
      },
    };
    const props = {
      data,
      openModal: true,
      setOpenModal: openModalHandler,
    };
    jest.spyOn(QbUtils, 'uuid').mockReturnValue('a889a98b-0123-4456-b89a-b1825459775b');
    const container = render(
      <MockedProvider mocks={[passwordResetDataMock]} addTypename={false}>
        <Context.Provider value={authState}>
          <SnackbarContext.Provider value={{ ...mockedSnackbarProviderProps }}>
            <PasswordReset {...props} />
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
      expect(openModalHandler).toBeCalled()
    }, 5);
  });
});
