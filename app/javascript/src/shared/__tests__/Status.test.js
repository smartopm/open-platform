import React from 'react';
import { render } from '@testing-library/react';

import StatusCount, { StatusList } from '../Status';

describe('Text component', () => {
  it('should render correctly', () => {
    const container = render(<StatusCount title="task-one" handleFilter={jest.fn()} />);
    expect(container.queryByText('0')).toBeInTheDocument();
    expect(container.queryByText('task-one')).toBeInTheDocument();
  });
  it('GridText should render correctly', () => {
    const container = render(
      <StatusList data={{ open: 1 }} statuses={{ open: '1' }} handleFilter={jest.fn()} />
    );
    expect(container.queryAllByText('1')[0]).toBeInTheDocument();
  });
});
