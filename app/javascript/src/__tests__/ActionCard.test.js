import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionCard from '../components/ActionCard'
import '@testing-library/jest-dom/extend-expect'

const props = {
  openFlowModal: jest.fn(),
  actionFlow: {
    id: 'uuid000120',
    eventType: 'task_update',
    description: 'Some description',
    title: 'A workflow',
    active: true
  }
}
describe('ActionCard', () => {
  it('renders action-flow information', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionCard {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('A workflow')).toBeInTheDocument()
    expect(container.queryByText('Some description')).toBeInTheDocument()
    expect(
      container.queryByText('Event Type: On Task Update')
    ).toBeInTheDocument()
    expect(container.queryByText('Active')).toBeInTheDocument()
  })
})
