import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import Loading from '../../components/Loading'
import { UserFormProperiesQuery } from '../../graphql/queries'
import FormUpdate from '../../components/Forms/FormUpdate'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Form Component', () => {
  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: UserFormProperiesQuery,
        variables: {
          formId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
          userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
        }
      },
      result: {
        data: {
          formUserProperties: [
            {
              formProperty: {
                fieldName: 'Address',
                fieldType: 'text',
                id: '3145c47e-1279-47b0-9dac-dc4a7e30562e',
                adminUse: false,
                order: '1'
              },
              value: '7th Street'
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'date',
                id: '3145c47e-1279-47b0-9dac-dc4a7e362e',
                adminUse: false,
                order: '2'
              },
              value: null
            }
          ]
        }
      }
    }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <FormUpdate
          formId="caea7b44-ee95-42a6-a42f-3e530432172e"
          userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
        />
      </MockedProvider>
    )
    const loader = render(<Loading />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(
      () => {
        expect(container.queryByText('Update')).toBeInTheDocument(1)
        expect(container.queryByText('Approve')).toBeInTheDocument(1)
        expect(container.queryByText('Reject')).toBeInTheDocument(1)
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1)
        expect(
          container.queryAllByLabelText('text-input')[0]
        ).toHaveTextContent('Address')
        expect(
          container.queryAllByTestId('date-picker')[0]
        ).toHaveTextContent('Dead Line')
      },
      { timeout: 500 }
    )
  })
})
