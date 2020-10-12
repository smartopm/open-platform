import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../../components/Loading'
import Form from '../../components/Forms/Form'
import { FormPropertiesQuery } from '../../graphql/queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Form Component', () => {
  it('should render form without error', async () => {
    const mocks = {
        request: {
          query: FormPropertiesQuery,
          variables: { formId: '837b8ce8-sd' }
        },
        result: {
          data: {
            formProperties: [
                {
                id: "837b8ce8-f8e6",
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
      <BrowserRouter>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <Form />
        </MockedProvider>
      </BrowserRouter>
    )
    const loader = render(<Loading />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryAllByTestId('text-input')).toHaveLength(2)
      },
      { timeout: 500 }
    )
    // await waitFor(() => {
    //     expect(container.queryAllByTestId('form_name')).toHaveLength(2)
    //     expect(container.queryAllByTestId('form_name')[0]).toHaveTextContent('Lease Form')
    //     expect(container.queryAllByTestId('form_name')[1]).toHaveTextContent('Another Form')
    //   },
    //   { timeout: 500 }
    // )
  })
})
