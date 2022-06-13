import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import { render, waitFor } from '@testing-library/react'
import CodeScreen from '../components/AuthScreens/ConfirmCodeScreen'
import currentCommunity from '../__mocks__/currentCommunity';


describe('Code Confirmation Screen', () => {
  const params = {
    params: {
      id: 343
    }
  }
  const wrapper = render(
    <MemoryRouter>
      <MockedProvider mocks={[currentCommunity]} addTypename={false}>
        <CodeScreen match={params} />
      </MockedProvider>
    </MemoryRouter>
  )

  it('renders and has a paragraph element', async () => {
    await waitFor(() => {
      expect(wrapper.queryByTestId('welcome').textContent).toContain('login.welcome')
      expect(wrapper.queryAllByTestId('code-input')).toHaveLength(7)
      expect(wrapper.queryByTestId('arrow_back')).toBeInTheDocument()
      expect(wrapper.queryByTestId('submit_btn')).toBeInTheDocument()
      expect(wrapper.queryByTestId('submit_btn').textContent).toContain('login.login_button_text')
    }, 10)
  })
})
