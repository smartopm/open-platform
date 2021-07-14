import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import FormPropertyCreateForm from '../components/FormPropertyCreateForm';
import { FormPropertyQuery } from '../graphql/forms_queries';
import { FormPropertyUpdateMutation, FormPropertyCreateMutation } from '../graphql/forms_mutation';

describe('Form that creates other forms component', () => {
  // create a query mock
  const mocks = {
    request: {
      query: FormPropertyQuery,
      variables: { formId: '39c3b38e-136d-42e0', formPropertyId: '5290d212-edf8-4c1e-a20b' }
    },
    result: {
      data: {
        formProperty: {
          id: '5290d212-edf8-4c1e-a20b',
          fieldName: 'Last Name',
          fieldType: 'text',
          fieldValue: [
            {
              value: '',
              label: ''
            }
          ],
          required: true,
          adminUse: false,
          order: '1',
          __typename: 'FormProperties'
        }
      }
    }
  };
  const updatePropertyMock = {
    request: {
      query: FormPropertyUpdateMutation,
      variables: {
        id: '5290d212-edf8-4c1e-a20b',
        fieldName: '',
        fieldType: '',
        required: false,
        adminUse: false,
        order: '1',
        fieldValue: [{ value: '', label: '' }]
      }
    },
    result: {
      data: {
        formPropertiesUpdate: {
          formProperty: {
            id: '5290d212-edf8-4c1e-a20b',
            fieldName: '',
            fieldType: '',
            __typename: 'FormProperties'
          },
          __typename: 'FormPropertiesUpdatePayload'
        }
      }
    }
  };
  const createPropertyMock = {
    request: {
      query: FormPropertyCreateMutation,
      variables: {
        formId: '39c3b38e-136d-42e0',
        fieldName: '',
        fieldType: '',
        required: false,
        adminUse: false,
        order: '1',
        fieldValue: [{ value: '', label: '' }]
      }
    },
    result: {
      data: {
        formPropertiesCreate: {
          formProperty: {
            id: '5290d212-edf8-4c1e-a20b',
            fieldName: '',
            fieldType: '',
            __typename: 'FormProperties'
          },
          __typename: 'FormPropertiesCreatePayload'
        }
      }
    }
  };
  it('it should render with no errors and should update the form property', async () => {
    const closeMock = jest.fn();
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks, updatePropertyMock]} addTypename>
        <FormPropertyCreateForm
          propertyId={mocks.request.variables.formPropertyId}
          formId="39c3b38e-136d-42e0"
          refetch={refetchMock}
          close={closeMock}
        />
      </MockedProvider>
    );
    expect(container.queryByText('form_fields.field_name')).toBeInTheDocument();
    expect(container.queryAllByText('form_fields.field_type').length).toBe(2);
    expect(container.queryByText('form_fields.required_field')).toBeInTheDocument();
    expect(container.queryByText('form_fields.admins_only')).toBeInTheDocument();
    expect(container.queryByText('actions.update_property')).toBeInTheDocument();
    expect(container.queryAllByText('form_fields.order_number').length).toBe(2);

    expect(container.queryByTestId('form_property_submit')).toBeInTheDocument();

    fireEvent.change(container.queryByTestId('field_name'), { target: { value: 'Field 1' } });

    fireEvent.submit(container.queryByTestId('form_property_submit'));

    await waitFor(() => {
      expect(closeMock).toBeCalled();
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('misc.updated_form_property')).toBeInTheDocument();
    }, 50);
  });

  it('should create a form property when a form is submitted', async () => {
    const closeMock = jest.fn();
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks, createPropertyMock]} addTypename>
        <FormPropertyCreateForm
          formId={createPropertyMock.request.variables.formId}
          refetch={refetchMock}
          close={closeMock}
        />
      </MockedProvider>
    );
    expect(container.queryByText('form_fields.field_name')).toBeInTheDocument();
    expect(container.queryByTestId('form_property_submit')).toBeInTheDocument();
    expect(container.queryByText('actions.add_form_property')).toBeInTheDocument();

    fireEvent.change(container.queryByTestId('field_name'), { target: { value: 'Field 1' } });
    fireEvent.submit(container.queryByTestId('form_property_submit'));

    await waitFor(() => {
      expect(closeMock).not.toBeCalled();
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('misc.created_form_property')).toBeInTheDocument();
    }, 50);
  })
});
