import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { FormPropertyQuery } from '../graphql/forms_queries';
import { FormPropertyDeleteMutation } from '../graphql/forms_mutation';
import FormPropertyAction from '../components/FormPropertyAction';
import MockedThemeProvider from '../../__mocks__/mock_theme';

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
          groupingId: '6789-tyu4762',
          shortDesc: '50',
          longDesc: 'This is another description',
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
          newFormVersion: {
            id: '542781-e6sf6',
            __typename: 'Forms'
          },
          message: '',
          __typename: 'FormPropertiesDeletePayload'
        }
      }
    }
  };

  it('should delete a form property', async () => {
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks, deletePropertyMock]} addTypename>
        <MockedThemeProvider>
          <FormPropertyAction
            propertyId={mocks.request.variables.formPropertyId}
            formId={mocks.request.variables.formId}
            refetch={refetchMock}
            categoryId=""
            editMode
            formDetailRefetch={jest.fn()}
          />
        </MockedThemeProvider>
      </MockedProvider>
    );
    expect(container.queryByTestId('action_options')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('action_options'));
    // here we expect the edit modal to be open with proper fields
    expect(container.queryByText('common:menu.delete')).toBeInTheDocument();
    expect(container.queryByText('common:menu.edit')).toBeInTheDocument();

    fireEvent.click(container.queryByText('common:menu.delete'));
    await waitFor(() => {
      expect(refetchMock).toBeCalled();
      expect(container.queryByText('misc.deleted_form_property')).toBeInTheDocument();
    }, 50);
  });

  it('should edit a form property', async () => {
    const refetchMock = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks, deletePropertyMock]} addTypename>
        <MockedThemeProvider>
          <FormPropertyAction
            propertyId={mocks.request.variables.formPropertyId}
            formId={mocks.request.variables.formId}
            refetch={refetchMock}
            categoryId=""
            editMode
            formDetailRefetch={jest.fn()}
          />
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('action_options'));
      expect(container.queryByText('common:menu.edit')).toBeInTheDocument();

      fireEvent.click(container.queryByText('common:menu.edit'));
      expect(container.queryByText('actions.update_form_property')).toBeInTheDocument();
    });
  });
});
