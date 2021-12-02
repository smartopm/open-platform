import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../../../shared/Loading'
import { UserFormPropertiesQuery, FormUserQuery } from '../graphql/forms_queries'
import FormUpdate from '../components/FormUpdate'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Form Component', () => {
  const formUserMocks = {
    request: {
      query: FormUserQuery,
      variables: {
        userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
      }
    },
    result: {
      data: {
        formUser: {
          id: "162f7517-7cc8-398542-b2d0-384sds",
          status: "pending",
          form: {
            id: "caea7b44-ee95-42a6-a42f-3e530432172e",
            name: "Test Form",
            description: "Some description"
          },
          statusUpdatedBy: {
            id: "162f7517-7cc8-398542-b2d0-a83569",
            name: "Olivier JM Maniraho",
          },
          updatedAt: "2020-11-05T11:25:07Z"
        }
      }
    }
  };

  const authState = {
    user: { userType: 'admin' },
  };

  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
          userId: "162f7517-7cc8-42f9-b2d0-a83a16d59569"
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
                groupingId: '3145c47e-1279-47b0-9dac',
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
                groupingId: '3145c47e-1279-47b0',
                adminUse: false,
                order: '2'
              },
              value: null,
              imageUrl: 'https://another_image.com',
              fileType: 'null'
            },
            {
              formProperty: {
                fieldName: 'Image 1',
                fieldType: 'file_upload',
                fieldValue: null,
                id: '3145c47e-1279-47b0-9da454c-dc4a7e362e',
                groupingId: '3145c47e-1279-47b0',
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
                fieldType: 'file_upload',
                fieldValue: null,
                id: '3145c47e-1234-47b0-9dac-dc723d2e',
                groupingId: '3145c47e-1279-47',
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
                groupingId: '3145c47e-1279-9dac',
                adminUse: false,
                order: '6'
              },
              value: "{\"checked\"=>\"Yes\", \"label\"=>\"Would you rather?\"}",
              imageUrl: null,
              fileType: null,
            },
            {
              formProperty: {
                fieldName: 'Select your favorite colors',
                fieldType: 'checkbox',
                fieldValue: [
                  {
                    value: "Red",
                    label: "Red"
                  },
                  {
                    value: "Green",
                    label: "Green"
                  },
                  {
                    value: "Blue",
                    label: "Blue"
                  }
                ],
                id: '3145c47e-1234-1093-9dac-dc723d2e',
                groupingId: '3145c47e-1001-9dac',
                adminUse: false,
                order: '7'
              },
              value: "{\"Red\"=>true, \"Blue\"=>true}",
              imageUrl: null,
              fileType: null,
            }
          ]
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[mocks, formUserMocks]} addTypename={false}>
        <BrowserRouter>
          <FormUpdate
            formUserId="caea7b44-ee95-42a6-a42f-3e530432172e"
            userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
            authState={authState}
          />
        </BrowserRouter>
      </MockedProvider>
    );
    const loader = render(<Loading />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(
      () => {
        expect(container.queryByText('form_status_actions.update')).toBeInTheDocument()
        expect(container.queryByText('form_status_actions.approved')).toBeInTheDocument()
        expect(container.queryByText('form_status_actions.rejected')).toBeInTheDocument()
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1)
        expect(
          container.queryAllByLabelText('text-input')[0]
          ).toHaveTextContent('Address')
          expect(
            container.queryAllByTestId('date-picker')[0]
            ).toHaveTextContent('Dead Line')
        expect(
          container.queryAllByTestId('attachment-name')[0]
          ).toHaveTextContent('Image 1')
        expect(container.queryByText('form:misc.download_file')).toBeInTheDocument()
        expect(container.queryByLabelText('Yes')).toBeInTheDocument()
        expect(container.queryByLabelText('No')).toBeInTheDocument()
        expect(container.queryByTestId('radio_field_name')).toBeInTheDocument()
        expect(container.queryByTestId('checkbox_field_name')).toBeInTheDocument()
        expect(container.queryByTestId('radio_field_name').textContent).toContain('Would you rather?')
        expect(container.queryByTestId('checkbox_field_name').textContent).toContain('Select your favorite colors')
      },
      { timeout: 50 }
    )
  })

  it('does not render download buton when there is no attachment', async () => {
    const mocks = {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
          userId: "162f7517-7cc8-42f9-b2d0-a83a16d59569"
        }
      },
      result: {
        data: {
          formUserProperties: [
            {
              formProperty: {
                fieldName: 'Attach a file here',
                fieldType: 'file_upload',
                fieldValue: null,
                id: '3145c47e-1234-47b0-9dac-dc723d2e',
                groupingId: '3145c47e-1279-47',
                adminUse: false,
                order: '5'
              },
              value: null,
              imageUrl: null,
              fileType: null
            }
          ]
        }
      }
    };

    render(
      <MockedProvider mocks={[mocks, formUserMocks]} addTypename={false}>
        <BrowserRouter>
          <FormUpdate
            formUserId="caea7b44-ee95-42a6-a42f-3e530432172e"
            userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
            authState={authState}
          />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.queryAllByTestId('attachment-name')[0]
        ).toHaveTextContent('Attach a file here')
      expect(screen.queryByText('form:misc.download_file')).not.toBeInTheDocument();
    });
  });
})
