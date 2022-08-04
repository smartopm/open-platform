import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import PasswordSetup from '../../components/AuthScreens/PasswordSetup';
import { ResetPasswordAfterLoginMutation } from '../../graphql/mutations/user';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('PasswordSetup page', () => {
  const mocks = [
    {
      request: {
        query: ResetPasswordAfterLoginMutation,
        variables: {
          userId: '11cdad78-5a04-4026-828c-17290a2c44b6',
          password: '26000000748',
        },
      },
      result: {
        data: {
          resetPasswordAfterLogin: {
            authToken: '11cdad78-5a04-4026-828c-17290a2c44b6',
          },
        },
      },
    },
  ];

  it('should render the PasswordSetup with all fields', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <PasswordSetup />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(async () => {
      const passwordTextField = screen.getByLabelText('common:form_fields.password');
      expect(passwordTextField).toBeInTheDocument();

      const confirmPasswordTextField = screen.getByLabelText('common:form_fields.confirm_password');
      expect(confirmPasswordTextField).toBeInTheDocument();

      fireEvent.change(confirmPasswordTextField, {
        target: { value: 'bogmanboss!#password' },
      });

      const loginBtn = screen.queryByTestId('submit_btn');
      expect(loginBtn).toBeInTheDocument();
      fireEvent.click(loginBtn);
    }, 10);
  });
});
