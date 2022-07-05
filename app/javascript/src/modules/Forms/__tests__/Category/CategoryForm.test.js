import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import CategoryForm from '../../components/Category/CategoryForm';
import { FormCategoryUpdateMutation } from '../../graphql/form_category_mutations';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { mockedSnackbarProviderProps } from '../../../__mocks__/mock_snackbar';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

jest.mock('@rails/activestorage/src/file_checksum', () => []);
describe('CategoryForm Component', () => {
  const props = {
    data: {
      id: '2938423942',
      fieldName: 'Some Name',
      order: 1,
      description: 'ser',
      headerVisible: false,
      renderedText: '',
      general: false,
      displayCondition: {
        condition: '',
        value: '',
        groupingId: ''
      }
    },
    formData: [
      {
        id: '23423',
        fieldName: 'Some Other Name'
      }
    ],
    close: jest.fn(),
    refetchCategories: jest.fn(),
    handleCategoryClose: jest.fn(),
    categoryFormOpen: true
  };
  const updateCategoryMock = {
    request: {
      query: FormCategoryUpdateMutation,
      variables: {
        id: '2938423942',
        fieldName: 'This category form',
        order: 2,
        description: 'This describes this category',
        headerVisible: false,
        renderedText: 'Some long paragraph should be here',
        general: false,
        displayCondition: { condition: '', groupingId: '', value: '' },
        categoryId: '2938423942',
      }
    },
    result: {
      data: {
        categoryUpdate: {
          category: {
            id: 'caea7b44-a42f-3e530432172'
          },
          message: '',
          newFormVersion: {
            id: '92834iuhsds'
          }
        }
      }
    }
  };

  const formWrapper = render(
    <MockedProvider mocks={[updateCategoryMock]} addTypename={false}>
      <BrowserRouter>
        <MockedThemeProvider>
          <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
            <CategoryForm {...props} />
          </SnackbarContext.Provider>
        </MockedThemeProvider>
      </BrowserRouter>
    </MockedProvider>
  );

  it('should include all necessary form fields', async () => {
    expect(formWrapper.queryByText('form_fields.name')).toBeInTheDocument();
    expect(formWrapper.queryByText('form_fields.description')).toBeInTheDocument();
    expect(formWrapper.queryAllByText('form_fields.rendered_text')[0]).toBeInTheDocument();
    expect(formWrapper.queryByText('form_fields.header_visible')).toBeInTheDocument();
    expect(formWrapper.queryByText('form_fields.general_category')).toBeInTheDocument();
    expect(formWrapper.queryAllByText('form_fields.order_number')[0]).toBeInTheDocument();
    expect(formWrapper.queryByTestId('dialog_cancel').textContent).toContain(
      'common:form_actions.cancel'
    );
    expect(formWrapper.queryByTestId('clear_condition')).toBeInTheDocument();
    expect(formWrapper.queryByTestId('custom-dialog-button')).not.toBeDisabled();

    fireEvent.change(formWrapper.queryByTestId('name'), {
      target: { value: 'This category form' }
    });
    expect(formWrapper.queryByTestId('name').value).toBe('This category form');

    fireEvent.change(formWrapper.queryByTestId('description'), {
      target: { value: 'This describes this category' }
    });
    expect(formWrapper.queryByTestId('description').value).toBe('This describes this category');

    fireEvent.change(formWrapper.queryByTestId('rendered_text'), {
      target: { value: 'Some long paragraph should be here' }
    });
    expect(formWrapper.queryByTestId('rendered_text').value).toBe(
      'Some long paragraph should be here'
    );

    fireEvent.change(formWrapper.queryByTestId('order_number'), { target: { value: '2' } });
    expect(formWrapper.queryByTestId('order_number').value).toBe('2');

    fireEvent.click(formWrapper.queryByTestId('custom-dialog-button'));

    await waitFor(() => {
      expect(props.close).toBeCalled();
      expect(props.refetchCategories).toBeCalled();
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        type: mockedSnackbarProviderProps.messageType.success,
        message: 'misc.updated_form_category'
      });
    }, 50);
  });
});
