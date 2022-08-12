import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import LinkButtons from '../../components/AuthScreens/LinkButtons';

describe('Password Reset component', () => {
  it('should render the password reset properly', async () => {
    const handleEmailInputModal = jest.fn();
    const handleModal = jest.fn();
    const props = {
      handleEmailInputModal,
      handleModal,
    };
    const container = render(
      <MockedProvider addTypename={false}>
        <LinkButtons {...props} />
      </MockedProvider>
    );

    expect(container.queryByTestId('trouble-logging-in-btn')).toBeInTheDocument();
    expect(container.queryByTestId('password-reset-btn')).toBeInTheDocument();

    const troubleSignBtn = container.queryByTestId('trouble-logging-in-btn');
    const passwordResetIcon = container.queryByTestId('password-reset-btn');

    fireEvent.click(troubleSignBtn);
    await waitFor(() => {
      expect(handleModal).toHaveBeenCalled();
    });

    fireEvent.click(passwordResetIcon);
    await waitFor(() => {
      expect(handleEmailInputModal).toBeCalled();
    });
  });
});
