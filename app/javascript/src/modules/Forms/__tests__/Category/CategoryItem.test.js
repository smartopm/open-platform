import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import CategoryItem from '../../components/Category/CategoryItem';
import FormContextProvider, { FormContext } from '../../Context';

jest.mock('@rails/activestorage/src/file_checksum', () => []);
describe('CategoryItem', () => {
  const category = {
    fieldName: 'Main Category',
    headerVisible: true,
    id: '34234234'
  };
  const props = {
    handleAddField: jest.fn(),
    handleEditCategory: jest.fn(),
    handleDeleteCategory: jest.fn(),
    collapsed: false,
    loading: false,
    currentId: '2343242'
  };
  const wrapper = render(
    <MockedProvider>
      <FormContextProvider>
        <CategoryItem {...props} category={category} editMode>
          <p>Some child component</p>
        </CategoryItem>
      </FormContextProvider>
    </MockedProvider>
  );

  it('should properly render given props', () => {
    expect(wrapper.queryByTestId('add_property')).toBeInTheDocument();
    expect(wrapper.queryByTestId('category_option')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByTestId('add_property'));
    expect(props.handleAddField).toBeCalled();

    fireEvent.click(wrapper.queryByTestId('category_option'));
    expect(wrapper.queryByText('common:menu.edit')).toBeInTheDocument();
    fireEvent.click(wrapper.queryByText('common:menu.edit'));
    expect(props.handleEditCategory).toBeCalled();

    expect(wrapper.queryByText('common:menu.delete')).toBeInTheDocument();
    fireEvent.click(wrapper.queryByText('common:menu.delete'));
    expect(props.handleDeleteCategory).toBeCalled();
  });
  
  it('should not show the category if not matching condition', () => {
    const hiddenCategory = {
      fieldName: 'Main Category',
      headerVisible: false,
      id: '34234234',
      displayCondition: {
        condition: '===',
        value: 'fine',
        groupingId: '9e50f4db-3d75-431d-a772-261971a6ed92'
      }
    };

    const properties = {
      'How are you?': {
        form_property_id: '9e50f4db-3d75-431d-a772-261971a6ed92',
        value: 'not fine'
      },
      Name: {
        form_property_id: '9e50f4db-3d75-431d-a772-261971-a6ed92',
        value: 'their name'
      }
    };

    const hiddenWrapper = render(
      <MockedProvider>
        <FormContext.Provider value={{ formProperties: properties }}>
          <CategoryItem {...props} category={hiddenCategory} editMode={false}>
            <p>Some child component</p>
          </CategoryItem>
        </FormContext.Provider>
      </MockedProvider>
    );
    expect(hiddenWrapper.queryByText('Main Category')).not.toBeInTheDocument();
    expect(hiddenWrapper.queryByText('Some child component')).not.toBeInTheDocument();
  });
});
