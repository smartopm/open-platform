import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import CategoryItem from '../../components/Category/CategoryItem';
import FormContextProvider from '../../Context';

jest.mock('@rails/activestorage/src/file_checksum', () => []);
describe('CategoryItem', () => {
  const props = {
    category: {
      fieldName: 'Main Category',
      headerVisible: true,
      id: '34234234'
    },
    handleAddField: jest.fn(),
    handleEditCategory: jest.fn(),
    handleDeleteCategory: jest.fn(),
    collapsed: false,
    editMode: true,
    loading: false,
    currentId: '2343242'
  };
  const wrapper = render(
    <MockedProvider>
      <FormContextProvider>
        <CategoryItem {...props}>
          <p>Some child component</p>
        </CategoryItem>
      </FormContextProvider>
    </MockedProvider>
  );

  it('should properly render given props', () => {
    expect(wrapper.queryByText('Some child component')).toBeInTheDocument();
    expect(wrapper.queryByLabelText(/delete this category/)).toBeInTheDocument();
    expect(wrapper.queryByLabelText(/edit this category/)).toBeInTheDocument();
    expect(wrapper.queryByLabelText(/add questions to this category/)).toBeInTheDocument();
    expect(wrapper.queryByTestId('add-icon')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByLabelText(/delete this category/))
    expect(props.handleDeleteCategory).toBeCalled()

    fireEvent.click(wrapper.queryByLabelText(/edit this category/))
    expect(props.handleEditCategory).toBeCalled()

    fireEvent.click(wrapper.queryByLabelText(/add questions to this category/))
    expect(props.handleAddField).toBeCalled()

  });
});
