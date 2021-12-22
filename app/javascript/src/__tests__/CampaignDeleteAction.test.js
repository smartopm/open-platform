import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import CampaignActionMenu from '../components/Campaign/CampaignDeleteAction'
import { DeleteCampaign } from '../graphql/mutations'
import { Spinner } from '../shared/Loading';

describe('campaign action menu component', () => {
  it('show correct action menu', async () => {
    const props = {
      data: {
        id: "6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3"
      }
    }

    const mocks = {
      request: {
        query: DeleteCampaign,
        variables: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' }
      },
      result: {
        data: {
          campaignDelete: {
            campaign:
            {
              status: 'deleted',
              id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
              __typename: 'typename'
            },
            __typename: 'typename'
          }
        }
      }
    }

    const container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <CampaignActionMenu
            data={props.data}
            refetch={jest.fn()}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.getByTestId("deleteIcon")).toBeInTheDocument()
    fireEvent.click(container.getByTestId("deleteIcon"))
    expect(container.getByText("actions.delete_campaign")).toBeInTheDocument()
    fireEvent.click(container.getByTestId("no"))
    expect(container.queryByText("actions.delete_campaign")).not.toBeInTheDocument()
    fireEvent.click(container.getByTestId("deleteIcon"))
    fireEvent.click(container.getByTestId("yes"))

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText("actions.delete_campaign")).not.toBeInTheDocument()
      },
      { timeout: 30 }
    );
  })
})
