import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import CodeScreen from '../../components/AuthScreens/ConfirmCodeScreen';
import currentCommunity from '../../__mocks__/currentCommunity';

describe('Code Confirmation Screen', () => {
  const params = {
    params: {
      id: 343,
    },
  };
  const wrapper = render(
    <MemoryRouter>
      <MockedProvider mocks={[currentCommunity]} addTypename={false}>
        <CodeScreen match={params} />
      </MockedProvider>
    </MemoryRouter>
  );
  it('renders the OTP verification page', async () => {
    await waitFor(() => {
      expect(wrapper.queryByTestId('arrow_back')).toBeInTheDocument();
      expect(wrapper.queryByTestId('community_logo')).toBeInTheDocument();
      expect(wrapper.queryByTestId('screen_title')).toBeInTheDocument();
      expect(wrapper.queryByTestId('otp_code_input')).toBeInTheDocument();
      expect(wrapper.queryByTestId('screen_title').textContent).toContain('login.otp_verification');
      expect(wrapper.queryByTestId('submit_btn')).toBeInTheDocument();
      expect(wrapper.queryByTestId('submit_btn')).toBeDisabled();
    });
  });
});
