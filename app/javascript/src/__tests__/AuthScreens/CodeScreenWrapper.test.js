import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import currentCommunity from '../../__mocks__/currentCommunity';
import CodeScreenWrapper from '../../components/AuthScreens/CodeScreenWrapper';

describe('Code Confirmation Screen', () => {
  const mocks = {
    title: "HOC component",
    isDisabled: true,
    loading: true,
    handleConfirm: jest.fn(),
  }

  it('renders some part of the screen with loading component', async () => {
    const wrapper = render(
      <MemoryRouter>
        <MockedProvider mocks={[currentCommunity]} addTypename={false}>
          <CodeScreenWrapper {...mocks}>
            <p>Hello World</p>
          </CodeScreenWrapper>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(wrapper.queryByTestId('arrow_back')).toBeInTheDocument();
    expect(wrapper.queryByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {

      const title = wrapper.queryByTestId('screen_title');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain('HOC component');
      expect(wrapper.queryByTestId('submit_btn')).toBeDisabled();
      expect(wrapper.queryByAltText('community logo')).toBeInTheDocument()
    }, 10);
  });

  it('renders code confirmation wrapper', async () => {
    const customMocks = {...mocks, loading: false, isDisabled: false};
    const wrapper = render(
      <MemoryRouter>
        <MockedProvider mocks={[currentCommunity]} addTypename={false}>
          <CodeScreenWrapper {...customMocks}>
            <p>Hello World</p>
          </CodeScreenWrapper>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(wrapper.queryByTestId('submit_btn')).not.toBeDisabled();
    await waitFor(() => {
      expect(wrapper.queryByTestId('loader')).not.toBeInTheDocument();
      expect(wrapper.queryByText('login.continue_button_text')).toBeInTheDocument()


      fireEvent.click(wrapper.getByTestId('submit_btn'));
      expect(customMocks.handleConfirm).toHaveBeenCalled();
    });
  });
});
