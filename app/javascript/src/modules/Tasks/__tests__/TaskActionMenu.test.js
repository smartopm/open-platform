import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskActionMenu from '../Components/TaskActionMenu';

describe('Task Action Menu', () => {
  it('should work with given props', () => {
    const props = {
      currentTile: 'tasksOpen',
      setSelectAllOption: jest.fn(),
      selectedTasks: ['34343'],
      taskListIds: ['34343'],
      checkedOptions: 'all',
      handleCheckOptions: jest.fn(),
      bulkUpdating: false,
      handleBulkUpdate: jest.fn()
    };
    const wrapper = render(<TaskActionMenu {...props} />);
    expect(wrapper.queryByTestId('select_all')).toBeInTheDocument();
    expect(wrapper.queryByTestId('select_all')).not.toBeDisabled()
    expect(wrapper.queryByText('Select')).toBeInTheDocument()
    expect(wrapper.queryByText('Mark as Complete')).toBeInTheDocument()
    expect(wrapper.queryByTestId('bulk_update')).toBeInTheDocument();
    expect(wrapper.queryByTestId('bulk_update')).not.toBeDisabled();

    fireEvent.click(wrapper.queryByTestId('bulk_update'))
    expect(props.handleBulkUpdate).toBeCalled()
  });
});
