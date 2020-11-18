import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionFlowModal from '../containers/ActionFlows/ActionFlowModal'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const props = {
  open: true,
  closeModal: jest.fn(),
  handleSave: jest.fn(),
  selectedActionFlow: {
    id: 'uuid12345',
    eventAction: {
      action_fields: {
        email: {
          name: 'email',
          value: 'email@gmail.com',
          type: 'string'
        }
      }
    }
  }
}
describe('ActionFlowModal', () => {
  it('renders "Edit Workflow" and "Save Changes" and other necessary elements', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionFlowModal {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Edit Workflow')).toBeInTheDocument()
    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save Changes')).toBeInTheDocument()
    expect(container.queryByText('New Workflow')).toBeNull()
    expect(container.queryByText('Save')).toBeNull()
  })

  it('renders "New Workflow" and "Save" and other necessary elements', () => {
    const updatedProps = {
      ...props,
      selectedActionFlow: {}
    }
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionFlowModal {...updatedProps} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Edit Workflow')).toBeNull()
    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save')).toBeInTheDocument()
    expect(container.queryByText('Save Changes')).toBeNull()
    expect(container.queryByText('New Workflow')).toBeInTheDocument()
  })
})
