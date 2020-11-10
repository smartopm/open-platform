import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionFlows from '../containers/ActionFlows/ActionFlows'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('ActionFlows', () => {
  it('renders necessary elements', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionFlows />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('New Workflow')).toBeInTheDocument()

    const newFlow = container.queryByText('New Workflow')

    fireEvent.click(newFlow)

    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save')).toBeInTheDocument()
  })
})
