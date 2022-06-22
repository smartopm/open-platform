import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import Loading from '../../../shared/Loading';
import { UserFormPropertiesQuery, FormUserQuery } from '../graphql/forms_queries';
import FormUpdate from '../components/FormUpdate';
import FormContextProvider from '../Context';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-markdown', () => 'div');
describe('Form Component', () => {
  const formUserMocks = {
    request: {
      query: FormUserQuery,
      variables: {
        userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e'
      }
    },
    result: {
      data: {
        formUser: {
          id: '162f7517-7cc8-398542-b2d0-384sds',
          status: 'pending',
          hasAgreedToTerms: false,
          form: {
            id: 'caea7b44-ee95-42a6-a42f-3e530432172e',
            name: 'Test Form',
            hasTermsAndConditions: true,
            description: 'Some description'
          },
          statusUpdatedBy: {
            id: '162f7517-7cc8-398542-b2d0-a83569',
            name: 'Olivier JM Maniraho'
          },
          updatedAt: '2020-11-05T11:25:07Z'
        }
      }
    }
  };

  const categoriesData = [
    {
      id: 'sfkjwfwefwef',
      fieldName: 'sampleName',
      headerVisible: true
    }
  ];

  const authState = {
    user: { userType: 'admin' }
  };

  it('should render form without error', async () => {
    const mocks = {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
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
                groupingId: '3145c47e-1279-47b0-9dac',
                adminUse: false,
                order: '1',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: [
                {
                  id: '290834032',
                  image_url: 'https://image.com',
                  file_type: null,
                  file_name: 'img.jpg'
                }
              ],
              imageUrl: 'https://image.com',
              fileType: null,
              fileName: 'img.jpg',
              value: '7th Street',
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Does'
              }
            },
            {
              formProperty: {
                fieldName: 'Dead Line',
                fieldType: 'date',
                fieldValue: null,
                id: '3145c47e-1279-47b0-8dac-dc4a7e362e',
                groupingId: '3145c47e-1279-47b0',
                adminUse: false,
                order: '2',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: [
                {
                  id: '290834032',
                  image_url: 'https://another_image.com',
                  file_type: 'null',
                  file_name: 'img2.jpg'
                }
              ],
              value: null,
              imageUrl: 'https://another_image.com',
              fileType: 'null',
              fileName: 'img2.jpg',
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Doe'
              }
            },
            {
              formProperty: {
                fieldName: 'Image 1',
                fieldType: 'file_upload',
                fieldValue: null,
                id: '3145c47e-1279-47b0-9da454c-dc4a7e362e',
                groupingId: '3145c47e-1279-47b0',
                adminUse: false,
                order: '3',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: [
                {
                  id: '290834032',
                  image_url: 'https://another2_image.com',
                  file_type: 'image/jpg',
                  file_name: 'img3.jpg'
                }
              ],
              imageUrl: 'https://another2_image.com',
              fileType: 'image/jpg',
              fileName: 'img3.jpg',
              value: 'some values',
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Doe'
              }
            },
            {
              formProperty: {
                fieldName: 'Attach a file here',
                fieldType: 'file_upload',
                fieldValue: null,
                id: '3145c47e-1234-47b0-9dac-dc723d2e',
                groupingId: '3145c47e-1279-47',
                adminUse: false,
                order: '5',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: null,
              imageUrl: null,
              fileType: null,
              fileName: null,
              value: null,
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Doe'
              }
            },
            {
              formProperty: {
                fieldName: 'Would you rather?',
                fieldType: 'radio',
                fieldValue: [
                  {
                    value: 'Yes',
                    label: 'Yes'
                  },
                  {
                    value: 'No',
                    label: 'No'
                  }
                ],
                id: '3145c47e-1234-34b0-9dac-dc723d2e',
                groupingId: '3145c47e-1279-9dac',
                adminUse: false,
                order: '6',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: null,
              imageUrl: null,
              fileType: null,
              fileName: null,
              value: '{"checked"=>"Yes", "label"=>"Would you rather?"}',
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Doe'
              }
            },
            {
              formProperty: {
                fieldName: 'Select your favorite colors',
                fieldType: 'checkbox',
                fieldValue: [
                  {
                    value: 'Red',
                    label: 'Red'
                  },
                  {
                    value: 'Green',
                    label: 'Green'
                  },
                  {
                    value: 'Blue',
                    label: 'Blue'
                  }
                ],
                id: '3145c47e-1234-1093-9dac-dc723d2e',
                groupingId: '3145c47e-1001-9dac',
                adminUse: false,
                order: '7',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: null,
              imageUrl: null,
              fileType: null,
              fileName: null,
              value: '{"Red"=>true, "Blue"=>true}',
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'some_ids',
                name: 'John Doe'
              }
            }
          ]
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[mocks, formUserMocks]} addTypename={false}>
        <BrowserRouter>
          <FormContextProvider>
            <MockedThemeProvider>
              <FormUpdate
                formUserId="caea7b44-ee95-42a6-a42f-3e530432172e"
                userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
                authState={authState}
                categoriesData={categoriesData}
              />
            </MockedThemeProvider>
          </FormContextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const loader = render(<Loading />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(
      () => {
        expect(container.queryByText('form_status_actions.submit_form')).toBeInTheDocument();
        expect(container.queryByText('form_status_actions.approved')).toBeInTheDocument();
        expect(container.queryByText('form_status_actions.rejected')).toBeInTheDocument();
        expect(container.queryAllByLabelText('text-input')).toHaveLength(1);
        expect(container.queryAllByLabelText('text-input')[0]).toHaveTextContent('Address');
        expect(container.queryAllByTestId('date-picker')[0]).toHaveTextContent('Dead Line');
        expect(container.queryAllByTestId('attachment_name')[0]).toHaveTextContent('Image 1');
        expect(container.queryByTestId('download-icon')).toBeInTheDocument();
        expect(container.queryByLabelText('Yes')).toBeInTheDocument();
        expect(container.queryByLabelText('No')).toBeInTheDocument();
        expect(container.queryByTestId('radio_field_name')).toBeInTheDocument();
        expect(container.queryByTestId('checkbox_field_name')).toBeInTheDocument();
        expect(container.queryByTestId('radio_field_name').textContent).toContain(
          'Would you rather?'
        );
        expect(container.queryByTestId('checkbox_field_name').textContent).toContain(
          'Select your favorite colors'
        );
        expect(container.queryAllByTestId('filename')[0].textContent).toContain('img3.jpg');
      },
      { timeout: 50 }
    );
  });

  it('does not render download buton when there is no attachment', async () => {
    const mocks = {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          formUserId: 'caea7b44-ee95-42a6-a42f-3e530432172e',
          userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
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
                order: '5',
                category: {
                  id: 'sfkjwfwefwef'
                }
              },
              attachments: null,
              imageUrl: null,
              fileType: null,
              fileName: null,
              value: null,
              createdAt: '2020-10-07T09:37:03Z',
              user: {
                id: 'somes',
                name: 'John Doe'
              }
            }
          ]
        }
      }
    };

    render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[mocks, formUserMocks]} addTypename={false}>
          <BrowserRouter>
            <FormContextProvider>
              <MockedThemeProvider>
                <FormUpdate
                  formUserId="caea7b44-ee95-42a6-a42f-3e530432172e"
                  userId="162f7517-7cc8-42f9-b2d0-a83a16d59569"
                  authState={authState}
                  categoriesData={categoriesData}
                />
              </MockedThemeProvider>
            </FormContextProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('form-file-upload-btn')[0]).toHaveTextContent(
        'form:misc.select_file'
      );
      expect(screen.queryByTestId('approved')).toBeInTheDocument();
      expect(screen.queryByTestId('rejected')).toBeInTheDocument();
      fireEvent.click(screen.queryByTestId('approved'));
      fireEvent.click(screen.queryByTestId('rejected'));
      fireEvent.click(screen.queryByTestId('submit'));
      expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
    });
  });
});
