import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionCardMenu from '../components/ActionCardMenu'


const props = {
  open: true,
  handleClose: jest.fn(),
  openFlowModal: jest.fn(),
  refetch: jest.fn(),
  anchorEl: document.createElement("button"),
  data: {
    id: 'uuid000120',
    eventType: 'task_update',
    description: 'Some description',
    title: 'A workflow',
    active: true
  }
}
describe('ActionCardMenu', () => {
  it('renders necessary menu options', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionCardMenu {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('common:menu.edit')).toBeInTheDocument()
    expect(container.queryByText('common:menu.delete')).toBeInTheDocument()
  })
})
