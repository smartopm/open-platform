import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import CampaignActionMenu from '../components/Campaign/CampaignDeleteAction'

describe('campaign action menu component', () => {
  it('show correct action menu', () => {
    const props = {
      data: {
        id: "6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3"
      }
    }

    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CampaignActionMenu
            data={props.data}
            refetch={jest.fn()}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.getByTestId("deleteIcon")).toBeInTheDocument()
  })
})
