import React from 'react'
import { render } from '@testing-library/react'
import CampaignWarningDialog from '../components/Campaign/CampaignWarningDialog'
import '@testing-library/jest-dom/extend-expect'

const props = {
  open: true,
  handleClose: jest.fn(),
  createCampaign: jest.fn()
}
describe('CampaignWarningDialog component', () => {
  it('should render necessary elements', () => {
    const container = render(<CampaignWarningDialog {...props} />)
    const warningMsg = `You are going to create a campaign for 2000+ users. We recommend using a smaller list. Do you still want to proceed?`

    expect(container.queryByText('Warning')).toBeInTheDocument()
    expect(container.queryByText('Create')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText(warningMsg)).toBeInTheDocument()
  })
})
