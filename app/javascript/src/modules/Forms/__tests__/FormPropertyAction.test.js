import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { FormPropertyQuery } from '../graphql/forms_queries';
import { FormPropertyDeleteMutation } from '../graphql/forms_mutation';
import FormPropertyAction from '../components/FormPropertyAction';

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

  const deletePropertyMock = {
    request: {
      query: FormPropertyDeleteMutation,
      variables: mocks.request.variables
    },
    result: {
      data: {
        formPropertiesDelete: {
          formProperty: {
            id: '5290d212-edf8-4c1e-a20b',
            __typename: 'FormProperties'
          },
          __typename: 'FormPropertiesDeletePayload'
        }
      }
    }
  };


  it('should delete a form property', async () => {
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks, deletePropertyMock]} addTypename>
        <FormPropertyAction
          propertyId={mocks.request.variables.formPropertyId}
          formId={mocks.request.variables.formId}
          refetch={refetchMock}
          editMode
        />
      </MockedProvider>
    );
    expect(container.queryByTestId('property_delete')).toBeInTheDocument();
    expect(container.queryByTestId('property_edit')).toBeInTheDocument();



    fireEvent.click(container.queryByTestId('property_edit'));
    // here we expect the edit modal to be open with proper fields
    expect(container.queryByText('form_fields.field_name')).toBeInTheDocument();
    expect(container.queryByText('form_fields.required_field')).toBeInTheDocument();
    expect(container.queryByText('form_fields.admins_only')).toBeInTheDocument();
    expect(container.queryByText('actions.update_property')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('property_delete'));
    await waitFor(() => {
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('misc.deleted_form_property')).toBeInTheDocument();
    }, 50);
  })
});
