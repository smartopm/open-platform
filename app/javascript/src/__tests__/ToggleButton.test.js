import React from 'react'
import {
    render
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ToggleButton from "../components/Campaign/ToggleButton"

describe('It should render the toggle button delete', () => {
  const container = render(
    <ToggleButton
      campaignType={jest.fn()}
      handleCampaignType={jest.fn()}
    />
  )
  it('It should render toggle button', () => {
    expect(container.queryByText('Draft')).toBeInTheDocument()
    expect(container.queryByText('Schedule')).toBeInTheDocument()
  });
});