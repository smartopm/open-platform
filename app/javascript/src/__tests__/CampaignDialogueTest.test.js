import React from 'react'
import {
    render
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DeleteDialogue from "../components/Campaign/CampaignDeleteDialogue"

describe('It should render the dialog box for delete', () => {
  const container = render(
    <DeleteDialogue
      open
      handleClose={jest.fn()}
      handleDelete={jest.fn()}
    />
  )
  it('should render with dialog', () => {
    expect(container.queryByText('actions.delete_campaign')).toBeInTheDocument()
  });
});
