import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import CategoryList from '../../components/Category/CategoryList';
import FormContextProvider from '../../Context';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('CategoryList Component', () => {
  const categoriesData = {
    refetch: jest.fn(),
    loading: false,
    data: {
      formCategories: [
        {
          id: '345345234',
          fieldName: 'Some Field',
          formProperties: [
            {
              fieldName: 'First Field',
              id: '23423423'
            }
          ]
        },
        {
          id: '342423',
          fieldName: 'Another Field',
          formProperties: []
        }
      ]
    }
  };
  const categoryActions = {
    handleAddField: jest.fn(),
    handleEditCategory: jest.fn(),
    handleDeleteCategory: jest.fn()
  };

  const props = {
    editMode: true,
    loading: false,
    formId: '3423312312',
    categoryId: 'sdfadasdasdf',
    propertyFormOpen: false,
    formDetailRefetch: jest.fn()
  };

  it('should render without crashing', () => {
    render(
      <MockedProvider>
        <FormContextProvider>
          <CategoryList categoriesData={categoriesData} categoryItem={categoryActions} {...props} />
        </FormContextProvider>
      </MockedProvider>
      );
  });
});
