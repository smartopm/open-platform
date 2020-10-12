import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import Loading from '../../components/Loading'
import Form from '../../components/Forms/Form'
import { FormPropertiesQuery } from '../../graphql/queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Form Component', () => {
  it('should render form without error', async () => {
    const mocks = {
        request: {
          query: FormPropertiesQuery,
          variables: { formId: 'caea7b44-ee95-42a6-a42f-3e530432172e' }
        },
        result: {
          data: {
            formProperties: [
                {
                id: "837b8ce8-f8e6-45fb-89a8-abb8fc0cc079",
                fieldName: "Client Name",
                fieldType: "text",
                shortDesc: "This is a short description",
                longDesc: null,
                required: false,
                adminUse: false
                }
            ],
          },
        },
      }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Form formId="caea7b44-ee95-42a6-a42f-3e530432172e" />
      </MockedProvider>
    )
    const loader = render(<Loading />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryByText('Submit')).toBeInTheDocument(1)
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1)
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(container.queryAllByLabelText('text-input')[0]).toHaveTextContent('Client Name')
      },
      { timeout: 500 }
    )
  })
})
