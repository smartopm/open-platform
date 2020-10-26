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
              value: '7th Street',
              imageUrl: 'https://image.com'
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'date',
                id: '3145c47e-1279-47b0-8dac-dc4a7e362e',
                adminUse: false,
                order: '2'
              },
              value: null,
              imageUrl: 'https://another_image.com'
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'image',
                id: '3145c47e-1279-47b0-9da454c-dc4a7e362e',
                adminUse: false,
                order: '3'
              },
              value: 'some values',
              imageUrl: 'https://another2_image.com'
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'signature',
                id: '3145c47e-1279-47b0-9dac-dc7e362e',
                adminUse: false,
                order: '4'
              },
              value: null,
              imageUrl: 'https://another3_image.com'
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
        expect(container.queryByText('Update')).toBeInTheDocument()
        expect(container.queryByText('Approve')).toBeInTheDocument()
        expect(container.queryByText('Reject')).toBeInTheDocument()
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1)
        expect(
          container.queryAllByLabelText('text-input')[0]
          ).toHaveTextContent('Address')
          expect(
            container.queryAllByTestId('date-picker')[0]
            ).toHaveTextContent('Dead Line')
        expect(container.queryAllByAltText('authenticated link')).toHaveLength(2)
        expect(container.queryByText('Signature')).toBeInTheDocument()
        expect(container.queryByText('Attachments')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
})
