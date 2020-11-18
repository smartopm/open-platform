import React from 'react'
import { render } from '@testing-library/react'
import UsersActionMenu from '../components/UsersActionMenu'
import '@testing-library/jest-dom/extend-expect'

const props = {
  campaignCreateOption: 'none',
  setCampaignCreateOption: jest.fn(),
  handleCampaignCreate: jest.fn(),
}
describe('UsersActionMenu component', () => {
  it('should render "Select" and hide "Create Campaign" link', () => {
    const container = render(<UsersActionMenu {...props} />)

    expect(container.queryByText('Select')).toBeInTheDocument()
    expect(container.queryByText('Create Campaign')).toBeNull()
  })

  it('should render both "Select" and "Create Campaign" link', () => {
    const newProps = {
      ...props,
      campaignCreateOption: 'all'
    }
    const container = render(<UsersActionMenu {...newProps} />)

    expect(container.queryByText('Select')).toBeInTheDocument()
    expect(container.queryByText('Create Campaign')).toBeInTheDocument()
  })
})
