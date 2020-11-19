import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../../components/Loading'
import { UserFormProperiesQuery, FormUserQuery } from '../../graphql/queries'
import FormUpdate from '../../components/Forms/FormUpdate'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Form Component', () => {
  it('should render form without error', async () => {
    const formUserMocks = {
      request: {
        query: FormUserQuery,
        variables: {
          formId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
          userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
        }
      },
      result: {
        data: {
          formUser: {
            id: "162f7517-7cc8-398542-b2d0-384sds",
            status: "pending",
            statusUpdatedBy: {
              id: "162f7517-7cc8-398542-b2d0-a83569",
              name: "Olivier JM Maniraho",
            },
            updatedAt: "2020-11-05T11:25:07Z"
          }
        }
      }
    } 
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
                fieldValue: null,
                id: '3145c47e-1279-47b0-9dac-dc4a7e30562e',
                adminUse: false,
                order: '1'
              },
              value: '7th Street',
              imageUrl: 'https://image.com',
              fileType: null
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'date',
                fieldValue: null,
                id: '3145c47e-1279-47b0-8dac-dc4a7e362e',
                adminUse: false,
                order: '2'
              },
              value: null,
              imageUrl: 'https://another_image.com',
              fileType: 'null'
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'image',
                fieldValue: null,
                id: '3145c47e-1279-47b0-9da454c-dc4a7e362e',
                adminUse: false,
                order: '3'
              },
              value: 'some values',
              imageUrl: 'https://another2_image.com',
              fileType: 'image/jpg'
            },
            {
              formProperty: {
                fieldName: 'Attach a file here',
                fieldType: 'image',
                fieldValue: null,
                id: '3145c47e-1234-47b0-9dac-dc723d2e',
                adminUse: false,
                order: '5'
              },
              value: null,
              imageUrl: null,
              fileType: null
            },
            {
              formProperty: {
                fieldName: 'Would you rather?',
                fieldType: 'radio',
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
                id: '3145c47e-1234-34b0-9dac-dc723d2e',
                adminUse: false,
                order: '6'
              },
              value: "{\"checked\"=>\"Yes\", \"label\"=>\"Would you rather?\"}",
              imageUrl: null,
              fileType: null
            }
          ]
        }
      }
    }
    const authState = {
      user: { userType: 'admin' },
      token: '894573rhuehf783'
    }
    const container = render(
      <MockedProvider mocks={[mocks, formUserMocks]} addTypename={false}>
        <BrowserRouter>
          <FormUpdate
            formId="caea7b44-ee95-42a6-a42f-3e530432172e"
            userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
            authState={authState}
          />
        </BrowserRouter>
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
        expect(container.queryAllByAltText('authenticated link')).toHaveLength(1)
        // expect(container.queryByText('Signature')).toBeInTheDocument()
        expect(container.queryByText('Attachments')).toBeInTheDocument()
        // expect(container.queryAllByLabelText('sign_title')[0].textContent).toContain('SIGNATURE')
        expect(container.queryByLabelText('Yes')).toBeInTheDocument()
        expect(container.queryByLabelText('No')).toBeInTheDocument()
        expect(container.queryByText('Would you rather?')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
})
