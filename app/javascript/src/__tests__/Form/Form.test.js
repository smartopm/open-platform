import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import Loading from '../../components/Loading'
import Form from '../../components/Forms/Form'
import { FormPropertiesQuery } from '../../graphql/queries'
import { addPropWithValue, propExists } from '../../components/Forms/GenericForm'

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
                fieldValue: null,
                shortDesc: "This is a short description",
                longDesc: null,
                required: false,
                adminUse: false,
                order: '1'
                },
                {
                  id: "837b8ce8-f8e6-45fb-45a8-abb8fc0cc079",
                  fieldName: "Would you rather do this?",
                  fieldType: "radio",
                  fieldValue: [
                    {
                      value: "Yes",
                      label: "Yes"
                    },
                    {
                      value: "No",
                      label: "No"
                    }
                  ],
                  shortDesc: "This is a short description",
                  longDesc: null,
                  required: false,
                  adminUse: false,
                  order: '2'
                }
            ],
          }
        },
      }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Form formId="caea7b44-ee95-42a6-a42f-3e530432172e" pathname="form" />
      </MockedProvider>
    )
    const loader = render(<Loading />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryByText('Submit')).toBeInTheDocument(1)
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1)
        expect(container.queryAllByLabelText('text-input')[0]).toHaveTextContent('Client Name')
        expect(container.queryByLabelText('Yes')).toBeInTheDocument()
        expect(container.queryByLabelText('No')).toBeInTheDocument()
        expect(container.queryByLabelText('Would you rather do this?')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
  it('modifies the prop value array', () => {
    // propExists
    const values = [{value: '24223', form_property_id: '34fw4342'}, {value: '45', form_property_id: '3fw4342'}]
    expect(propExists(values, '34fw4342')).toBe(true)
    expect(propExists(values, '34f')).toBe(false)
    // add null values to array
    addPropWithValue(values, '34f')
    expect(values).toHaveLength(3)
    // this should pass this time
    expect(propExists(values, '34f')).toBe(true)
  })
})


