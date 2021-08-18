import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategoryItem from '../../components/Category/CategoryItem';

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
    <CategoryItem {...props}>
      <p>Some child component</p>
    </CategoryItem>
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
